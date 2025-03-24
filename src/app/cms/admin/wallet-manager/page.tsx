'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Image from 'next/image';

interface WalletFormData {
  _id?: string;
  wallet_catalog_id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image: FileList; // Ảnh chính (file upload)
  thumbnail: FileList; // Ảnh phụ (file upload)
}

interface Wallet {
  _id: string;
  wallet_catalog_id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image: string; // URL ảnh chính
  thumbnail: string; // URL ảnh phụ
}

export default function WalletManager() {
  const { register, handleSubmit, reset, watch } = useForm<WalletFormData>();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [catalogs, setCatalogs] = useState<{ _id: string; name: string }[]>([]);
  
  // Lấy ảnh xem trước từ FileList
  const watchImage = watch('image');
  const watchThumbnail = watch('thumbnail');

  const previewImage = watchImage && watchImage.length > 0 ? URL.createObjectURL(watchImage[0]) : null;
  const previewThumbnail = watchThumbnail && watchThumbnail.length > 0 ? URL.createObjectURL(watchThumbnail[0]) : null;

  useEffect(() => {
    axios.get('/api/wallet')
      .then((res) => setWallets(res.data.data))
      .catch((err) => console.error('Lỗi lấy danh sách ví:', err));

    axios.get('/api/wallet-catalog')
      .then((res) => setCatalogs(res.data.data))
      .catch((err) => console.error('Lỗi lấy danh sách danh mục:', err));
  }, []);

  const onSubmit = async (data: WalletFormData) => {
    try {
      const formData = new FormData();
      formData.append('wallet_catalog_id', data.wallet_catalog_id);
      formData.append('name', data.name);
      formData.append('color', data.color);
      formData.append('size', data.size);
      formData.append('price', data.price.toString());
      formData.append('image', data.image[0]); // Ảnh chính
      formData.append('thumbnail', data.thumbnail[0]); // Ảnh phụ

      const res = await axios.post('/api/wallet', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setWallets([...wallets, res.data.data]);
      reset();
    } catch (err) {
      console.error('Lỗi tạo ví mới:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Wallet Manager</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select {...register('wallet_catalog_id')} className="border p-2 w-full" required>
          <option value="">Chọn danh mục</option>
          {catalogs.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input {...register('name')} placeholder="Tên ví" className="border p-2 w-full" required />
        <input {...register('color')} placeholder="Màu sắc" className="border p-2 w-full" required />
        <input {...register('size')} placeholder="Kích thước" className="border p-2 w-full" required />
        <input {...register('price')} type="number" placeholder="Giá" className="border p-2 w-full" required />

        {/* Ảnh chính */}
        <input {...register('image')} type="file" accept="image/*" className="border p-2 w-full" required />
        {previewImage && (
          <div className="relative w-32 h-32 mt-2">
            <Image src={previewImage} alt="Xem trước ảnh chính" layout="fill" objectFit="cover" className="border rounded-md" />
          </div>
        )}

        {/* Ảnh phụ */}
        <input {...register('thumbnail')} type="file" accept="image/*" className="border p-2 w-full" required />
        {previewThumbnail && (
          <div className="relative w-32 h-32 mt-2">
            <Image src={previewThumbnail} alt="Xem trước ảnh phụ" layout="fill" objectFit="cover" className="border rounded-md" />
          </div>
        )}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Tạo ví
        </button>
      </form>

      <h3 className="text-lg font-bold mt-6">Danh sách ví</h3>
      <ul className="mt-2">
        {wallets.map((wallet) => (
          <li key={wallet._id} className="border p-2 mt-2">
            <strong>{wallet.name}</strong> - {wallet.color} - {wallet.size} - {wallet.price} VND
            <div className="mt-2 flex space-x-4">
              <div className="relative w-32 h-32">
                <Image src={wallet.image} alt="Ảnh chính" width={128} height={128} objectFit="cover" className="border rounded-md" />
              </div>
              <div className="relative w-32 h-32">
                <Image src={wallet.thumbnail} alt="Ảnh phụ" width={128} height={128} objectFit="cover" className="border rounded-md" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
