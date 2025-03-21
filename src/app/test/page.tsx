"use client";
import { useState } from "react";

interface Variant {
  id: string;
  productId: string;
  color: string;
  size: string;
  price: number;
  image: string;
  thumbnail: string;
}

const products = [
  {
    id: "coach-wallet-men",
    name: "Ví Nam Coach Cao Cấp",
  },
];

const variants: Variant[] = [
  {
    id: "coach-black-small",
    productId: "coach-wallet-men",
    color: "Black",
    size: "Small",
    price: 150,
    image: "/images/coach-black-small.jpg",
    thumbnail: "/images/coach-black-small-thumb.jpg",
  },
  {
    id: "coach-black-medium",
    productId: "coach-wallet-men",
    color: "Black",
    size: "Medium",
    price: 180,
    image: "/images/coach-black-medium.jpg",
    thumbnail: "/images/coach-black-medium-thumb.jpg",
  },
  {
    id: "coach-brown-small",
    productId: "coach-wallet-men",
    color: "Brown",
    size: "Small",
    price: 160,
    image: "/images/coach-brown-small.jpg",
    thumbnail: "/images/coach-brown-small-thumb.jpg",
  },
  {
    id: "coach-brown-medium",
    productId: "coach-wallet-men",
    color: "Brown",
    size: "Medium",
    price: 190,
    image: "/images/coach-brown-medium.jpg",
    thumbnail: "/images/coach-brown-medium-thumb.jpg",
  },
];

const getUniqueValues = <T extends keyof Variant>(key: T): string[] => {
  return [...new Set(variants.map((v) => String(v[key])))];
};

export default function ProductPage() {
  const product = products.find((p) => p.id === "coach-wallet-men");
  
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [selectedSize, setSelectedSize] = useState<string>("Small");
  const [hovered, setHovered] = useState<boolean>(false);

  const colors = getUniqueValues("color");
  const sizes = getUniqueValues("size");

  const selectedVariant = variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  return (
    <div>
      <h1>{product?.name}</h1>

      <div>
        {selectedVariant && (
          <img
            src={hovered ? selectedVariant.thumbnail : selectedVariant.image}
            alt={product?.name}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ width: 200, height: 200, objectFit: "cover" }}
          />
        )}
      </div>

      <p>Chọn màu:</p>
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => setSelectedColor(color)}
          style={{
            margin: 5,
            padding: "5px 10px",
            backgroundColor: selectedColor === color ? "lightblue" : "white",
          }}
        >
          {color}
        </button>
      ))}

      <p>Chọn kích thước:</p>
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => setSelectedSize(size)}
          style={{
            margin: 5,
            padding: "5px 10px",
            backgroundColor: selectedSize === size ? "lightblue" : "white",
          }}
        >
          {size}
        </button>
      ))}

      {selectedVariant ? (
        <div>
          <p>Giá: ${selectedVariant.price}</p>
        </div>
      ) : (
        <p>Không tìm thấy phiên bản phù hợp</p>
      )}
    </div>
  );
}
