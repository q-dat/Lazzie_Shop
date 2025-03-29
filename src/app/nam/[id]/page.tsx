'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { IWallet } from '@/models/Wallet';

export default function ProductDetail() {
  const { id } = useParams();
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/wallet/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setWallet(data.data);
      })
      .catch((err) => console.error('Lỗi khi lấy dữ liệu:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="mt-10 text-center">Đang tải...</p>;
  if (!wallet) return <p className="mt-10 text-center">Không tìm thấy sản phẩm</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative aspect-square w-full">
          <Image src={wallet.image} alt={wallet.name} fill className="rounded-lg object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{wallet.name}</h1>
          <p className="text-lg font-semibold text-red-500">{(wallet.price * 1000).toLocaleString('vi-VN')}đ</p>
          <p className="mt-2 text-gray-700">{wallet.des}</p>
          <button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white" onClick={() => alert('Thêm vào giỏ hàng')}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
