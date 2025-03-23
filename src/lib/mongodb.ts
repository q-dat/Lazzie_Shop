import mongoose, { Connection } from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI as string;

if (!MONGO_URI) {
  throw new Error('⚠️ Thiếu MONGODB_URI trong biến môi trường!');
}

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

export async function connectDB(): Promise<Connection> {
  if (cached.conn) {
    console.log('MongoDB đã được kết nối.');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Đang kết nối tới MongoDB...');
    cached.promise = mongoose
      .connect(MONGO_URI, {
        dbName: 'quocdatstore79',
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log('Kết nối MongoDB thành công!');
        return mongooseInstance.connection;
      })
      .catch((err) => {
        console.error('Lỗi kết nối MongoDB:', err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  global.mongooseCache = cached;

  return cached.conn;
}
