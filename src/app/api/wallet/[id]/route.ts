import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
import mongoose from 'mongoose';
import redis, { connectRedis } from '@/lib/redis';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Lấy id từ url
const getIdFromUrl = (req: NextRequest): string | null => {
  const paths = req.nextUrl.pathname.split('/');
  const id = paths[paths.length - 1];
  return mongoose.Types.ObjectId.isValid(id) ? id : null;
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await connectRedis();

    const paths = req.nextUrl.pathname.split('/');
    const id = paths[paths.length - 1];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'ID truyền vào không hợp lệ!' }, { status: 400 });
    }

    const cacheKey = `wallet_${id}`;
    const cachedWallet = await redis.get(cacheKey);
    if (cachedWallet) {
      return NextResponse.json({ success: true, data: JSON.parse(cachedWallet) });
    }

    const wallet = await Wallet.findById(id).lean();
    if (!wallet) {
      return NextResponse.json({ success: false, message: 'Sản phẩm không tìm thấy!' }, { status: 404 });
    }

    await redis.set(cacheKey, JSON.stringify(wallet), 'EX', 60);

    return NextResponse.json({ success: true, data: wallet });
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi lấy thông tin ví!' }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'ID truyền vào không hợp lệ!' }, { status: 400 });

    const formData = await req.formData();
    const wallet = await Wallet.findById(id);
    if (!wallet) return NextResponse.json({ success: false, message: 'Sản phẩm không tìm thấy!' }, { status: 404 });

    // 📌 **Xử lý ảnh mới (nếu có)**
    const mainFile = formData.get('image') as Blob | null;
    const thumbFile = formData.get('thumbnail') as Blob | null;

    const image = mainFile ? (await uploadToCloudinary(mainFile, 'wallets/main')).secure_url : wallet.image;
    const thumbnail = thumbFile ? (await uploadToCloudinary(thumbFile, 'wallets/thumbnails')).secure_url : wallet.thumbnail;

    // 📌 **Cập nhật dữ liệu**
    const updatedWallet = await Wallet.findByIdAndUpdate(
      id,
      {
        wallet_catalog_id: formData.get('wallet_catalog_id') || wallet.wallet_catalog_id,
        name: formData.get('name') || wallet.name,
        color: formData.get('color') || wallet.color,
        size: formData.get('size') || wallet.size,
        quantity: formData.get('quantity') || wallet.quantity,
        status: formData.get('status') || wallet.status,
        note: formData.get('note') || wallet.note,
        des: formData.get('des') || wallet.des,
        price: Number(formData.get('price')) || wallet.price,
        image,
        thumbnail,
      },
      { new: true }
    );

    return NextResponse.json({ message: 'Cập nhật ví thành công', success: true, data: updatedWallet });
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json({ message: 'Lỗi khi cập nhật ví', success: false }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'ID truyền vào không hợp lệ!' }, { status: 400 });

    const deletedWallet = await Wallet.findByIdAndDelete(id);
    if (!deletedWallet) return NextResponse.json({ success: false, message: 'Sản phẩm không tìm thấy!' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Đã xóa sản phẩm thành công.' });
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa ví' }, { status: 500 });
  }
}
