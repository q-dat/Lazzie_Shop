'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { IWallet } from '@/models/Wallet';

export default function ProductDetail() {
  const { id } = useParams();
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/wallet/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWallet(data.data);
          setSelectedImage(data.data.image);
        }
      })
      .catch((err) => console.error('Lỗi khi lấy dữ liệu:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="mt-10 text-center">Đang tải...</p>;
  if (!wallet) return <p className="mt-10 text-center">Không tìm thấy sản phẩm</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Hình ảnh sản phẩm */}
        <div className=''>
          <div className="relative aspect-square w-full border rounded-lg shadow-md">
            <Image src={selectedImage || wallet.image} alt={wallet.name} fill className="rounded-lg object-cover" />
          </div>
          {/* Thumbnail hình ảnh */}
          <div className="mt-4 flex space-x-2">
            {[wallet.image, ...(wallet.thumbnail || [])].map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`h-16 w-16 border ${selectedImage === img ? 'border-blue-500' : 'border-gray-300'} rounded-md overflow-hidden`}
              >
                <Image src={img} alt={`Thumbnail ${index + 1}`} width={64} height={64} className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-2xl font-bold">{wallet.name}</h1>
          <p className="text-lg font-semibold text-red-500">{(wallet.price * 1000).toLocaleString('vi-VN')}đ</p>
          <p className="mt-2 text-gray-700">{wallet.des}</p>

          {/* Lựa chọn màu sắc */}
          {wallet.color && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold">Màu sắc:</h3>
              <div className="mt-2 flex space-x-2">
                <div className="h-6 w-6 rounded-full border border-gray-300" style={{ backgroundColor: wallet.color.toLowerCase() }}></div>
              </div>
            </div>
          )}

          <button className="mt-6 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 flex items-center gap-2">
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
