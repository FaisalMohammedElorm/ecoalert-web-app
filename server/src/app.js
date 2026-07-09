import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { UPLOADS_DIR } from './middleware/upload.js';
import { notFound, errorHandler } from './middleware/error.js';

import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

// CORS allows the Vite frontend to call this API from a different localhost
// port during development. CLIENT_ORIGIN can be locked down in production.
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
// Express JSON parsing makes req.body available for application/json requests.
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded images statically.
app.use('/uploads', express.static(UPLOADS_DIR));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/upload', uploadRoutes);

// 404 + error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
