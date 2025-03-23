import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import WalletCatalog from '@/models/WalletCatalog';

// 🟢 GET: Lấy danh sách ví
export async function GET() {
  try {
    await connectDB();
    const wallets = await WalletCatalog.find();
    return NextResponse.json({ message: 'Get all', success: true, data: wallets });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Lỗi:', error.message);
    } else {
      console.error('Lỗi không xác định:', error);
    }
  }
}

// 🟡 POST: Tạo ví mới
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const newWallet = new WalletCatalog(body);
    await newWallet.save();
    return NextResponse.json({ message: 'Post', success: true, data: newWallet });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Lỗi:', error.message);
    } else {
      console.error('Lỗi không xác định:', error);
    }
  }
}
