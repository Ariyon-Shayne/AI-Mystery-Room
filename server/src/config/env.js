import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const here = dirname(fileURLToPath(import.meta.url));
const serverRoot = resolve(here, '../..');
dotenv.config({ path: resolve(serverRoot, '.env') });
dotenv.config({ path: resolve(serverRoot, '../.env') });

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1),
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  SESSION_SECRET: z.string().min(32),
  SESSION_TTL_DAYS: z.coerce.number().positive().default(30),
  CASE_RETENTION_DAYS: z.coerce.number().positive().default(30),
  AI_TIMEOUT_MS: z.coerce.number().positive().default(60000),
  AI_MAX_RETRIES: z.coerce.number().int().min(0).max(2).default(2),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().positive().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().positive().default(20),
  MEDIA_PROVIDER: z.string().default('placeholder'),
  MEDIA_STORAGE_PROVIDER: z.string().default('local')
});

export const env = schema.parse(process.env);
