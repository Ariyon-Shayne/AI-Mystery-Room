import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';
import { Case } from '../models/Case.js';
import { Solution } from '../models/Solution.js';
import { Accusation } from '../models/Accusation.js';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
  } catch (error) {
    if (error.message?.includes('querySrv') || error.message?.includes('ECONNREFUSED')) {
      console.warn('Local DNS failed on MongoDB SRV lookup. Retrying with public DNS (8.8.8.8, 1.1.1.1)...');
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
      } catch {
        // Ignore if setServers fails
      }
      await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
    } else {
      throw error;
    }
  }
  await Promise.all([Case.init(), Solution.init(), Accusation.init()]);
}
