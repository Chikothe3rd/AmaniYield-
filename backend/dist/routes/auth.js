"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-dev';
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
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
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                phoneNumber,
                password: hashedPassword,
                role,
                region: region || 'Zambia',
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ success: true, token, user: { id: user.id, phoneNumber: user.phoneNumber, role: user.role } });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// POST /api/auth/register-farmer (Assisted Onboarding)
router.post('/register-farmer', async (req, res) => {
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
    }
    catch (error) {
        console.error('Assisted registration error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
        return res.status(400).json({ success: false, error: 'Missing credentials' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { phoneNumber } });
        if (!user || !user.password) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ success: true, token, user: { id: user.id, phoneNumber: user.phoneNumber, role: user.role } });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
exports.default = router;
