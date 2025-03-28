'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IWallet } from '@/models/Wallet';
import { useFavorite } from '../context/FavoriteContext/FavoriteProvider';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorite();
  const [localFavorites, setLocalFavorites] = useState<IWallet[]>([]);

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const handleRemove = (id: string) => {
    toggleFavorite(localFavorites.find((item) => item._id === id)!);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Sản phẩm yêu thích</h1>
      {localFavorites.length === 0 ? (
        <p className="text-gray-500">Danh sách sản phẩm yêu thích của bạn đang trống!</p>
      ) : (
        <div className="overflow-x-auto border border-primary">
          <table className="w-full bg-white">
            <thead className="bg-primary text-center text-black">
              <tr>
                <th className="border p-3">Hình ảnh</th>
                <th className="border p-3">Sản phẩm</th>
                <th className="border p-3">Màu sắc</th>
                <th className="border p-3">Size</th>
                <th className="border p-3">Giá</th>
                <th className="border p-3">Trạng thái</th>
                <th className="border p-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {localFavorites.map((item) => (
                <tr key={item._id} className="border-b text-center">
                  <td className="p-3">
                    <div className="relative mx-auto h-16 w-16">
                      <Image src={item.image || '/fallback-image.jpg'} alt={item.name} layout="fill" objectFit="cover" className="rounded-md" />
                    </div>
                  </td>
                  <td className="p-3 font-semibold">{item.name}</td>
                  <td className="p-3">
                    <div
                      className="mx-auto h-6 w-6 rounded-full border border-secondary shadow-sm"
                      style={{ backgroundColor: item.color.toLowerCase() }}
                    />
                  </td>
                  <td className="p-3 font-semibold">{item.size}</td>
                  <td className="p-3 font-bold text-red-600">{(item.price * 1000).toLocaleString('vi-VN')}đ</td>
                  <td className="p-3 font-semibold">{item.status || 'Còn hàng'}</td>
                  <td className="p-3">
                    <button onClick={() => handleRemove(item._id)} className="rounded-md bg-red-500 px-3 py-1 text-white transition hover:bg-red-600">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
