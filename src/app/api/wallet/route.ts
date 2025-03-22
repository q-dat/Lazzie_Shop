import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export const runtime = 'nodejs'; // ⚡ Chạy API trên Node.js, không dùng Edge Runtime

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: '✅ MongoDB connected successfully!' });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
