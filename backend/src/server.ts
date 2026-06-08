import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import next from 'next';
import path from 'path';
import ussdRouter from './routes/ussd';
import scanRouter from './routes/scan';
import reportsRouter from './routes/reports';
import marketplaceRouter from './routes/marketplace';
import authRouter from './routes/auth';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: path.join(__dirname, '../../frontend') });
const handle = nextApp.getRequestHandler();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Security & Headers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Production-Ready Content Security Policy
app.use((req, res, next) => {
  const cspHeader = [
    "default-src 'self'",
    `connect-src 'self' http://localhost:* ws://localhost:* https://api.openweathermap.org`,
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:"
  ].join('; ');

  res.setHeader('Content-Security-Policy', cspHeader);
  next();
});



// Handle Chrome DevTools specific paths
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({ status: 'OK', message: 'DevTools metadata bypass' });
});

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'AmaniYield Backend is running' });
});

// API Routes
app.use('/api/ussd', ussdRouter);
app.use('/api/scan', scanRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/auth', authRouter);

// Basic Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message
    });
  }
});

async function main() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to Database');

    // Prepare Next.js
    console.log('Preparing Next.js frontend...');
    await nextApp.prepare();

    // Catch-all route to serve Next.js pages
    app.all('*', (req: Request, res: Response) => {
      return handle(req, res);
    });
    
    app.listen(PORT, () => {
      console.log(`Unified Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Unified Server:', error);
  }
}

main();

export { prisma };
export default app;
