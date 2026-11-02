import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

try {
  if (env.NODE_ENV !== 'test' && !env.GEMINI_API_KEY) console.warn('GEMINI_API_KEY is empty. Case generation requests will fail with a recoverable configuration message.');
  await connectDatabase();
  app.listen(env.PORT, () => console.log(`AI Mystery Room API listening on port ${env.PORT}`));
} catch (error) {
  console.error('Startup failed. Check MongoDB and required environment settings.', error.message);
  process.exit(1);
}
