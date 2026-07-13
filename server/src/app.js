import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { UPLOADS_DIR } from './middleware/upload.js';
import { notFound, errorHandler } from './middleware/error.js';

import authRoutes from './routes/authRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import userRoutes from './routes/userRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

// Security headers
app.use(helmet());

// CORS allows the Vite frontend to call this API from a different localhost
// port during development. Set CLIENT_ORIGIN in production to a specific origin.
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || true;
app.use(cors({ origin: CLIENT_ORIGIN }));

// Basic request rate limiting to protect against brute force and abuse.
const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
});
app.use('/api/', globalLimiter);

// Stricter rate limits for sensitive endpoints.
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // limit login/register attempts
	standardHeaders: true,
	legacyHeaders: false,
});

const uploadLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20, // uploads are heavier; still limit per IP
	standardHeaders: true,
	legacyHeaders: false,
});

app.use('/api/auth', authLimiter);
app.use('/api/upload', uploadLimiter);

// Express JSON parsing makes req.body available for application/json requests.
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Basic request sanitization to remove keys that could be used for
// MongoDB injection (keys starting with "$" or containing "."). This is a
// lightweight safeguard in place of a dependency like express-mongo-sanitize.
function sanitizeObject(obj) {
	if (!obj || typeof obj !== 'object') return;
	if (Array.isArray(obj)) {
		for (const v of obj) sanitizeObject(v);
		return;
	}
	for (const key of Object.keys(obj)) {
		if (key.startsWith('$') || key.includes('.')) {
			delete obj[key];
		} else {
			sanitizeObject(obj[key]);
		}
	}
}

app.use((req, _res, next) => {
	sanitizeObject(req.body);
	sanitizeObject(req.query);
	sanitizeObject(req.params);
	next();
});

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
