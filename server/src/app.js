import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env.js';
import { casesRouter } from './routes/cases.js';
import { anonymousSession, requireSameOrigin } from './middleware/session.js';
import { errorHandler, notFound } from './middleware/errors.js';

export const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());
app.use(pinoHttp({ redact: ['req.headers.cookie', 'req.headers.authorization'] }));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1', anonymousSession);
app.use('/api/v1', requireSameOrigin);
const generationLimiter = rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX_REQUESTS, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many case generations. Please wait and try again.' } } });
app.use('/api/v1/cases', (req, res, next) => {
  const isGenerationRequest = req.method === 'POST' && (req.path === '/' || /^\/[^/]+\/retry\/?$/.test(req.path));
  return isGenerationRequest ? generationLimiter(req, res, next) : next();
});
app.use('/api/v1/cases', casesRouter);
app.use(notFound);
app.use(errorHandler);
