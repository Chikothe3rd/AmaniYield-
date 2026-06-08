import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  const { phoneNumber, password, role, region } = req.body;

  if (!phoneNumber || !password || !role) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // Allow all roles for public signup to ensure everyone can reach their dashboard
  const allowedRoles = ['FARMER', 'HERDER', 'YOUTH_OFFICER', 'GOV_ADMIN', 'BUYER', 'NGO'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ success: false, error: 'Invalid role selection' });
  }


  try {
    const existingUser = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        phoneNumber,
        password: hashedPassword,
        role,
        region: region || 'Zambia',
      },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ success: true, token, user: { id: user.id, phoneNumber: user.phoneNumber, role: user.role } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/auth/register-farmer (Assisted Onboarding)
router.post('/register-farmer', async (req: Request, res: Response) => {
  const { phoneNumber, role, region } = req.body;

  if (!phoneNumber || !role || !region) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  if (role !== 'FARMER' && role !== 'HERDER') {
    return res.status(400).json({ success: false, error: 'Only Farmers and Herders can be registered via assisted onboarding.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await prisma.user.create({
      data: {
        phoneNumber,
        role,
        region,
        password: null, // No password for offline USSD actors
      },
    });

    res.status(201).json({ success: true, user: { id: user.id, phoneNumber: user.phoneNumber, role: user.role } });
  } catch (error) {
    console.error('Assisted registration error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).json({ success: false, error: 'Missing credentials' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ success: true, token, user: { id: user.id, phoneNumber: user.phoneNumber, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
