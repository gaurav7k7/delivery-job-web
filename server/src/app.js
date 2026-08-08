import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node';

import { env, isProduction } from './config/env.js';
import { corsOptions } from './config/cors.config.js';
import { globalLimiter } from './middlewares/rateLimiter.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import routes from './routes/index.js';
import sitemapRoutes from './routes/sitemap.routes.js';
import robotsRoutes from './routes/robots.routes.js';

const app = express();

// Required for secure cookies / correct req.ip behind a reverse proxy (Render, Railway, Nginx, etc.)
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(globalLimiter);

// Conventionally served at the site root, not under /api — see the
// "Sitemap & robots.txt routing" note in docs/PRODUCTION-OPTIMIZATION.md for
// what this assumes about how the SPA and API are deployed together.
app.use('/sitemap.xml', sitemapRoutes);
app.use('/robots.txt', robotsRoutes);

app.use('/api', routes);

app.use(notFound);

// Reports the error to Sentry (a no-op when SENTRY_DSN is unset — see
// instrument.js) and forwards it to our own error handler below, which is
// what actually shapes the HTTP response. Must come after all routes and
// before any other error-handling middleware, per Sentry's Express integration.
Sentry.setupExpressErrorHandler(app);

app.use(errorHandler);

export default app;
