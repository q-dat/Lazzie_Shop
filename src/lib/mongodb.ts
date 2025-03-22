import mongoose, { Connection } from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI as string;

if (!MONGO_URI) {
  throw new Error('⚠️ MONGODB_URI is missing in environment variables!');
}

// Định nghĩa kiểu dữ liệu cho cache để tránh any
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Lưu cache vào global để tránh tạo nhiều kết nối (tránh lỗi ESLint)
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Gán giá trị mặc định nếu global chưa có biến mongooseCache
const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

export async function connectDB(): Promise<Connection> {
  if (cached.conn) {
    console.log('MongoDB already connected.');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Connecting to MongoDB...');
    cached.promise = mongoose
      .connect(MONGO_URI, {
        dbName: 'quocdatstore79',
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log('MongoDB connected successfully!');
        return mongooseInstance.connection;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  global.mongooseCache = cached; // Lưu vào global để tránh nhiều kết nối

  return cached.conn;
}
