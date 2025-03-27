'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
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
    <div className="relative aspect-square" onMouseEnter={() => setHoveredId(selectedVariant._id)} onMouseLeave={() => setHoveredId(null)}>
      <Image
        src={hoveredId === selectedVariant._id ? selectedVariant.thumbnail : selectedVariant.image}
        alt={selectedVariant.name || 'Hình Ảnh'}
        fill
        priority
        className="h-full w-full object-cover"
      />
      <button className="absolute right-1 top-1 cursor-pointer text-lg" onClick={() => toggleFavorite(selectedVariant)}>
        {favorites.some((fav) => fav._id === selectedVariant._id) ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-black" />}
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 px-2 md:grid-cols-3 lg:grid-cols-4 xl:px-desktop-padding 2xl:grid-cols-6">
      {Object.keys(groupedProducts).length > 0 ? (
        Object.entries(groupedProducts).map(([productName, variants]) => {
          const selectedColor = selectedColors[productName] || variants[0].color;
          const selectedVariant = variants.find((v) => v.color === selectedColor) || variants[0];
          return (
            <div key={productName} className="grid grid-cols-1 justify-center gap-1 p-2 shadow">
              <div>{renderImage(selectedVariant)}</div>
              <div>
                <h3 className="text-lg font-[600] uppercase">{selectedVariant.name}</h3>
                <p className="text-lg font-[600] text-red-500">{(selectedVariant.price * 1000).toLocaleString('vi-VN')}đ</p>
                <p className="text-sm font-light text-gray-600">{selectedVariant.quantity}</p>
              </div>
              {/*  */}
              <div className="flex space-x-4">
                {variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => setSelectedColors({ ...selectedColors, [productName]: variant.color })}
                    className={`h-6 w-6 cursor-pointer rounded-full hover:scale-90 hover:outline hover:outline-offset-2 ${
                      selectedColor === variant.color ? 'scale-90 outline outline-offset-2' : 'border border-[#eeeeee]'
                    }`}
                    style={{ backgroundColor: variant.color.toLowerCase() }}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p>Không có sản phẩm nào.</p>
      )}
    </div>
  );
}
