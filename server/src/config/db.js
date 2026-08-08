import mongoose from 'mongoose';
import { env, isProduction } from './env.js';

mongoose.set('strictQuery', true);

export async function connectDB() {
  mongoose.connection.on('connected', () => {
    console.log('[db] MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    // Pool sizing: a small API instance rarely needs more than a handful of
    // concurrent connections; keeping minPoolSize warm avoids a cold-connect
    // penalty on the first request after idle.
    maxPoolSize: 20,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    // Index builds acquire a write lock and can be slow on a large existing
    // collection — in production, indexes are created by a deploy-time
    // migration/script, not implicitly on every app boot.
    autoIndex: !isProduction,
  });
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
