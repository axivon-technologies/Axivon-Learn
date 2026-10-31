import mongoose from 'mongoose';
import { env } from '../config/env';

let isConnected = false;

export async function connectDatabase(): Promise<boolean> {
  if (isConnected) return true;

  try {
    // 3 second connection timeout to prevent hanging when MongoDB is not running locally
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });

    isConnected = true;
    console.log(`[Database] MongoDB connection established successfully: ${env.MONGODB_URI.split('@').pop()}`);
    return true;
  } catch (error: any) {
    isConnected = false;
    console.warn(`[Database] MongoDB connection notice: ${error.message}. Running in offline/disconnected mode.`);
    return false;
  }
}

export function isDatabaseConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function disconnectDatabase(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('[Database] MongoDB disconnected cleanly.');
  }
}
