import mongoose from 'mongoose';
import { env } from './env.js';
import { Case } from '../models/Case.js';
import { Solution } from '../models/Solution.js';
import { Accusation } from '../models/Accusation.js';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
  await Promise.all([Case.init(), Solution.init(), Accusation.init()]);
}
