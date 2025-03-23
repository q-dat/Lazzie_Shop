'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Wallet {
  _id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image: string;
  thumbnail: string;
}

export default function ProductPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: string }>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Fetch toàn bộ danh sách ví
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

  // Nhóm sản phẩm theo tên để lấy các biến thể
  const groupedProducts = wallets.reduce((acc: { [key: string]: Wallet[] }, wallet) => {
    if (!acc[wallet.name]) acc[wallet.name] = [];
    acc[wallet.name].push(wallet);
    return acc;
  }, {});

  return (
    <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.keys(groupedProducts).length > 0 ? (
        Object.keys(groupedProducts).map((productName) => {
          const variants = groupedProducts[productName];
          const selectedColor = selectedColors[productName] || variants[0].color;
          const selectedVariant = variants.find((v) => v.color === selectedColor) || variants[0];

          console.log("selectedVariant:", selectedVariant); // Kiểm tra dữ liệu

          return (
            <div key={productName} className="border p-2 rounded-md shadow-md">
              {/* Hình ảnh sản phẩm */}
              <div
                className="relative w-full h-48"
                onMouseEnter={() => setHoveredId(selectedVariant._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Image
                  src={
                    hoveredId === selectedVariant._id
                      ? selectedVariant?.thumbnail?.startsWith("http")
                        ? selectedVariant.thumbnail
                        : "/default-image.jpg"
                      : selectedVariant?.image?.startsWith("http")
                      ? selectedVariant.image
                      : "/default-image.jpg"
                  }
                  alt={selectedVariant.name || "No image"}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>

              {/* Thông tin sản phẩm */}
              <h3 className="text-lg font-semibold mt-2">{selectedVariant.name}</h3>
              <p className="text-gray-600">Màu: {selectedVariant.color}</p>
              <p className="text-gray-600">Kích thước: {selectedVariant.size}</p>
              <p className="text-red-500 font-bold">Giá: ${selectedVariant.price}</p>

              {/* Chọn màu */}
              <div className="mt-2 flex space-x-2">
                {variants.map((variant) => (
                  <button
                    key={variant.color}
                    onClick={() => setSelectedColors({ ...selectedColors, [productName]: variant.color })}
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedColor === variant.color ? 'border-blue-500' : 'border-gray-300'
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
