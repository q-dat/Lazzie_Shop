import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Wallet, { IWalletDocument } from '@/models/Wallet';
import cloudinary from '@/lib/cloudinary';
import redis, { connectRedis } from '@/lib/redis';

export async function GET(req: Request) {
  try {
    await connectRedis();
    if (redis.status !== 'ready') {
      console.log('⏳ Đợi Redis kết nối lại...');
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      await redis.ping();
      console.log('Redis đã sẵn sàng!');
    } catch (err) {
      console.error('❌ Lỗi khi ping Redis:', err);
      return NextResponse.json({ message: 'Lỗi Redis', success: false }, { status: 500 });
    }

    await connectDB();
    console.log('Kết nối MongoDB thành công!');

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    try {
      const cachedWallets = await redis.get(`wallets_page_${page}`);
      if (cachedWallets) {
        return NextResponse.json({ message: 'Get all', success: true, data: JSON.parse(cachedWallets) });
      }
    } catch (err) {
      console.warn('⚠️ Redis error:', err);
    }

    // Nếu không có cache, truy vấn từ MongoDB
    let wallets: IWalletDocument[] = [];
    try {
      wallets = await Wallet.find()
        .select('wallet_catalog_id name price color size status note des image thumbnail')
        .skip(skip)
        .limit(limit)
        .lean<IWalletDocument[]>();

      // Lưu kết quả vào Redis với TTL
      await redis.set(`wallets_page_${page}`, JSON.stringify(wallets), 'EX', 60);
    } catch (err) {
      console.error('Lỗi MongoDB:', err);
      return NextResponse.json({ message: 'Lỗi khi lấy dữ liệu từ MongoDB', success: false }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Get all', success: true, data: wallets },
      { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=1800' } }
    );
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
    const thumbFiles = formData.getAll('thumbnail') as Blob[];

    if (!mainFile) {
      return NextResponse.json({ success: false, message: 'Ảnh chính không hợp lệ' }, { status: 400 });
    }

    // Convert ảnh chính sang Base64
    const mainBuffer = Buffer.from(await mainFile.arrayBuffer());
    const mainBase64 = `data:${mainFile.type};base64,${mainBuffer.toString('base64')}`;

    // 📌 **Upload ảnh chính với resize và WebP**
    const mainUpload = await cloudinary.uploader.upload(mainBase64, {
      folder: 'wallets/main',
      format: 'webp',
      transformation: [{ width: 300, height: 300, crop: 'fill' }],
    });

    let thumbnailUrls: string[] = [];

    if (thumbFiles.length > 0) {
      for (const thumbFile of thumbFiles) {
        if (thumbFile instanceof Blob) {
          const thumbBuffer = Buffer.from(await thumbFile.arrayBuffer());
          const thumbBase64 = `data:${thumbFile.type};base64,${thumbBuffer.toString('base64')}`;

          // 📌 **Upload ảnh phụ với resize và WebP**
          const thumbUpload = await cloudinary.uploader.upload(thumbBase64, {
            folder: 'wallets/thumbnails',
            format: 'webp',
            transformation: [{ width: 300, height: 300, crop: 'thumb' }],
          });

          thumbnailUrls.push(thumbUpload.secure_url);
        }
      }
    }

    // Lưu vào MongoDB
    const newWallet = new Wallet({
      wallet_catalog_id: formData.get('wallet_catalog_id'),
      name: formData.get('name'),
      color: formData.get('color'),
      size: formData.get('size'),
      quantity: formData.get('quantity'),
      price: Number(formData.get('price')),
      status: formData.get('status'),
      note: formData.get('note'),
      des: formData.get('des'),
      image: mainUpload.secure_url,
      thumbnail: thumbnailUrls,
    });

    await newWallet.save();

    return NextResponse.json({ message: 'Tạo ví thành công', success: true, data: newWallet });
  } catch (error) {
    console.error('Lỗi:', error);
    return NextResponse.json({ message: 'Lỗi khi tạo ví', success: false }, { status: 500 });
  }
}
