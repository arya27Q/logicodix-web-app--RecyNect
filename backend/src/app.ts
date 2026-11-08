import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import wasteRoutes from './modules/waste/waste.routes.js';
import recyclerRoutes from './modules/recyclers/recycler.routes.js';
import matchingRoutes from './modules/matching/matching.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// App Modules (Sesuai Bab 13 Dokumentasi)
app.use('/api/auth', authRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/recyclers', recyclerRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
