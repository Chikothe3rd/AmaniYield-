"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ussd_1 = __importDefault(require("./routes/ussd"));
const scan_1 = __importDefault(require("./routes/scan"));
const reports_1 = __importDefault(require("./routes/reports"));
const marketplace_1 = __importDefault(require("./routes/marketplace"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(',');
// Security & CORS Configuration
app.use((0, cors_1.default)({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Request logging middleware (production-ready)
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip
        }));
    });
    next();
});
// Security Headers Middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=()');
    if (NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});
// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'AmaniYield Backend is running',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV
    });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/marketplace', marketplace_1.default);
app.use('/api/reports', reports_1.default);
app.use('/api/scan', scan_1.default);
app.use('/api/ussd', ussd_1.default);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        path: req.path,
        method: req.method
    });
});
// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        message: err.message,
        stack: NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    }));
    if (!res.headersSent) {
        res.status(500).json({
            error: 'Internal Server Error',
            message: NODE_ENV === 'development' ? err.message : 'An error occurred',
            requestId: req.headers['x-request-id'] || 'unknown'
        });
    }
});
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});
async function main() {
    try {
        await prisma.$connect();
        console.log('✓ Successfully connected to Database');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`✓ AmaniYield API Server running on port ${PORT}`);
            console.log(`✓ Environment: ${NODE_ENV}`);
            console.log(`✓ Allowed Origins: ${ALLOWED_ORIGINS.join(', ')}`);
        });
    }
    catch (error) {
        console.error('✗ Failed to start server:', error);
        process.exit(1);
    }
}
main();
exports.default = app;
