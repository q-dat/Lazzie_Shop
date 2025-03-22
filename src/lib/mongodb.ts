import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI as string;

// Biến global giúp tránh kết nối lại nhiều lần
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        dbName: 'quocdatstore79',
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
