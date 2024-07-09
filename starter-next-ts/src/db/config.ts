import mongoose from 'mongoose';
import { CONFIG } from 'src/config-global';

let isConnected = false;

export default async function connection() {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(CONFIG.mongo.databaseUri);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}
