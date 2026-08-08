import './instrument.js'; // must be the first import — see the file's own comment

import * as Sentry from '@sentry/node';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

let server;

async function start() {
  await connectDB();
  server = app.listen(env.PORT, () => {
    console.log(`[server] listening on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

async function shutdown(signal) {
  console.log(`[server] received ${signal}, shutting down gracefully`);
  if (!server) process.exit(0);

  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('[server] unhandled rejection:', reason);
  Sentry.captureException(reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('[server] uncaught exception:', err);
  Sentry.captureException(err);
  process.exit(1);
});

start();
