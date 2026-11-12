import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import wasteRoutes from './modules/waste/waste.routes.js';
import recyclerRoutes from './modules/recyclers/recycler.routes.js';
import matchingRoutes from './modules/matching/matching.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import auditLogRoutes from './modules/audit-logs/audit-log.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { ENV } from './config/env.js';
import { HttpError } from './utils/http-error.js';

const app: Application = express();

// Middlewares
app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (
      !origin ||
      ENV.FRONTEND_ORIGINS.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost')
    ) {
      callback(null, true);
      return;
    }

    callback(new HttpError(403, 'Origin tidak diizinkan.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Portal'],
  maxAge: 600,
}));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Root & Health Check
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'RecyNect Backend API',
    status: 'online',
    version: '1.0.0',
    health: '/api/health',
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// App Modules (Sesuai Bab 13 Dokumentasi)
app.use('/api/auth', authRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/recyclers', recyclerRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
