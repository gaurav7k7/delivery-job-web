import { Router } from 'express';
import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = Router();

router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  return new ApiResponse(200, { db: dbState, uptime: process.uptime() }, 'OK').send(res);
});

export default router;
