'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IWallet } from '@/models/Wallet';
import { FaRegHeart } from 'react-icons/fa';
import { useFavorite } from '../context/FavoriteContext/FavoriteProvider';
import { FaHeart } from 'react-icons/fa6';

export default function ProductPage() {
  const { favorites, toggleFavorite } = useFavorite();
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/wallet')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWallets(data.data);
        }
      })
      .catch((error) => console.error('Lỗi khi lấy danh sách ví:', error));
  }, []);

  // Nhóm sản phẩm theo tên
  const groupedProducts = wallets.reduce((acc: { [key: string]: IWallet[] }, wallet) => {
    if (!acc[wallet.name]) acc[wallet.name] = [];
    acc[wallet.name].push(wallet);
    return acc;
  }, {});

  const renderImage = (selectedVariant: IWallet) => (
    <div
      className="relative aspect-square cursor-pointer"
      onMouseEnter={() => setHoveredId(selectedVariant?._id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <Link href={`/nam/${selectedVariant._id}`}>
        <Image
          src={
            hoveredId === selectedVariant?._id
              ? Array.isArray(selectedVariant?.thumbnail) && selectedVariant.thumbnail.length > 0
                ? selectedVariant.thumbnail[0]
                : selectedVariant?.image
              : selectedVariant?.image
          }
          alt={selectedVariant?.name || 'Hình Ảnh'}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover"
        />

        {hoveredId === selectedVariant._id && (
          <button className="absolute bottom-0 w-full border border-black bg-white p-1 text-center text-xs font-semibold uppercase">Xem ngay</button>
        )}
      </Link>
      {/*  */}
      <button className="absolute right-1 top-1 cursor-pointer text-lg" onClick={() => toggleFavorite(selectedVariant)}>
        {favorites.some((fav) => fav._id === selectedVariant?._id) ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-black hover:text-primary" />
        )}
      </button>
      {/*  */}
    </div>
  );

  return (
    <div className="grid grid-flow-row items-start justify-between xl:grid-flow-col xl:grid-cols-4">
      <div className="col-span-1">
        <h1 className="font-semibold">Lọc sản phẩm</h1>
      </div>
      <div className="col-span-3">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {Object.keys(groupedProducts).length > 0 ? (
            Object.entries(groupedProducts).map(([productName, variants]) => {
              const selectedColor = selectedColors[productName] || variants[0].color;
              const selectedVariant = variants.find((v) => v.color === selectedColor) || variants[0];
              return (
                <div key={productName} className="grid grid-cols-1 justify-center gap-2 border p-1">
                  <div>{renderImage(selectedVariant)}</div>
                  <div className="space-y-3 px-2 pb-2 pt-0">
                    <div>
                      <h3 className="text-[16px] font-semibold uppercase">{selectedVariant?.name}</h3>
                      <p className="text-sm font-semibold text-del">{(selectedVariant?.price * 1000).toLocaleString('vi-VN')}đ</p>
                      {selectedVariant?.quantity && <p className="text-sm font-light text-gray-600">{selectedVariant?.quantity}</p>}
                    </div>
                    {/*  */}
                    <div className="flex flex-row gap-4">
                      {variants.map((variant) => (
                        <button
                          key={variant._id}
                          onClick={() => setSelectedColors({ ...selectedColors, [productName]: variant.color })}
                          className={`h-4 w-4 cursor-pointer rounded-full hover:scale-90 hover:outline hover:outline-1 hover:outline-offset-2 ${
                            selectedColor === variant.color ? 'scale-90 outline outline-1 outline-offset-2' : 'border border-[#eeeeee]'
                          }`}
                          style={{ backgroundColor: variant.color.toLowerCase() }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Không có sản phẩm nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}
