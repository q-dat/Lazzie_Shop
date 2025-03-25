import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Wallet from '@/models/Wallet';
import cloudinary from '@/lib/cloudinary';

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

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();

    const mainFile = formData.get('image') as Blob | null;
    const thumbFile = formData.get('thumbnail') as Blob | null;

    if (!mainFile || !thumbFile) {
      return NextResponse.json({ success: false, message: 'Ảnh chính hoặc ảnh phụ không hợp lệ' }, { status: 400 });
    }

    // Convert file thành Base64
    const mainBuffer = Buffer.from(await mainFile.arrayBuffer());
    const thumbBuffer = Buffer.from(await thumbFile.arrayBuffer());

    const mainBase64 = `data:${mainFile.type};base64,${mainBuffer.toString('base64')}`;
    const thumbBase64 = `data:${thumbFile.type};base64,${thumbBuffer.toString('base64')}`;

    // 📌 **Upload ảnh chính với resize và WebP**
    const mainUpload = await cloudinary.uploader.upload(mainBase64, {
      folder: 'wallets/main',
      format: 'webp', // Chuyển sang định dạng WebP
      transformation: [
        { width: 300, height: 300, crop: 'fill' }, // Resize ảnh chính
      ],
    });

    // 📌 **Upload ảnh phụ với resize và WebP**
    const thumbUpload = await cloudinary.uploader.upload(thumbBase64, {
      folder: 'wallets/thumbnails',
      format: 'webp', // Chuyển sang định dạng WebP
      transformation: [
        { width: 300, height: 300, crop: 'thumb' }, // Resize ảnh thumbnail
      ],
    });

    // Lưu vào MongoDB
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
