import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Wallet from '@/models/Wallet';

// Hàm lấy ID từ URL
const getIdFromUrl = (req: NextRequest) => {
  const paths = req.nextUrl.pathname.split('/');
  return paths[paths.length - 1]; // Lấy ID từ cuối URL
};

// 📌 **GET: Lấy chi tiết ví theo ID**
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const id = getIdFromUrl(req);

    if (!id) return NextResponse.json({ success: false, error: 'Missing wallet ID' }, { status: 400 });

    const wallet = await Wallet.findById(id);

    if (!wallet) return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: wallet });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// 📌 **PUT: Cập nhật số dư ví**
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const id = getIdFromUrl(req);
    const { balance } = await req.json();

    if (!id) return NextResponse.json({ success: false, error: 'Missing wallet ID' }, { status: 400 });

    const updatedWallet = await Wallet.findByIdAndUpdate(id, { balance }, { new: true });

    if (!updatedWallet) return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: updatedWallet });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// 📌 **DELETE: Xóa ví**
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const id = getIdFromUrl(req);

    if (!id) return NextResponse.json({ success: false, error: 'Missing wallet ID' }, { status: 400 });

    const deletedWallet = await Wallet.findByIdAndDelete(id);

    if (!deletedWallet) return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Wallet deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
