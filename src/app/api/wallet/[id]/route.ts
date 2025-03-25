import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
import cloudinary from '@/lib/cloudinary';
import mongoose from 'mongoose';

// 📌 **Hàm lấy ID từ URL**
const getIdFromUrl = (req: NextRequest): string | null => {
  const paths = req.nextUrl.pathname.split('/');
  const id = paths[paths.length - 1];
  return mongoose.Types.ObjectId.isValid(id) ? id : null;
};

// 📌 **GET: Lấy danh sách tất cả ví**
export async function GET() {
  try {
    await connectDB();
    const wallets = await Wallet.find();
    return NextResponse.json({ message: 'Get all', success: true, data: wallets });
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json({ message: 'Lỗi khi lấy danh sách ví', success: false }, { status: 500 });
  }
}

// 📌 **POST: Tạo ví mới**
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();

    const mainFile = formData.get('image') as Blob | null;
    const thumbFile = formData.get('thumbnail') as Blob | null;

    if (!mainFile || !thumbFile) {
      return NextResponse.json({ success: false, message: 'Ảnh chính hoặc ảnh phụ không hợp lệ' }, { status: 400 });
    }

    // 📌 **Xử lý upload ảnh**
    const mainUpload = await uploadToCloudinary(mainFile, 'wallets/main');
    const thumbUpload = await uploadToCloudinary(thumbFile, 'wallets/thumbnails');

    // 📌 **Lưu vào MongoDB**
    const newWallet = new Wallet({
      wallet_catalog_id: formData.get('wallet_catalog_id'),
      name: formData.get('name'),
      color: formData.get('color'),
      quantity: formData.get('quantity'),
      price: Number(formData.get('price')),
      image: mainUpload.secure_url, // Ảnh chính (WebP)
      thumbnail: thumbUpload.secure_url, // Ảnh phụ (WebP)
    });

    await newWallet.save();

    return NextResponse.json({ message: 'Tạo ví thành công', success: true, data: newWallet });
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json({ message: 'Lỗi khi tạo ví', success: false }, { status: 500 });
  }
}

// 📌 **PUT: Cập nhật thông tin ví (bao gồm cả ảnh)**
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'Invalid wallet ID' }, { status: 400 });

    const formData = await req.formData();
    const wallet = await Wallet.findById(id);
    if (!wallet) return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 });

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
        quantity: formData.get('quantity') || wallet.quantity,
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

// 📌 **DELETE: Xóa ví**
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'Invalid wallet ID' }, { status: 400 });

    const deletedWallet = await Wallet.findByIdAndDelete(id);
    if (!deletedWallet) return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Wallet deleted' });
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json({ success: false, message: 'Lỗi khi xóa ví' }, { status: 500 });
  }
}

// 📌 **Hàm upload ảnh lên Cloudinary**
async function uploadToCloudinary(file: Blob, folder: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

  return await cloudinary.uploader.upload(base64, {
    folder,
    format: 'webp',
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  });
}
