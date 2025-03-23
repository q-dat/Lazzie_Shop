'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface WalletFormData {
  _id: string;
  wallet_catalog_id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image: string;
  thumbnail: string;
}

export default function WalletManager() {
  const { register, handleSubmit, reset } = useForm<WalletFormData>();
  const [wallets, setWallets] = useState<WalletFormData[]>([]);
  const [catalogs, setCatalogs] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    axios
      .get('/api/wallet')
      .then((res) => setWallets(res.data.data))
      .catch((err) => console.error('Lỗi lấy danh sách ví:', err));

    axios
      .get('/api/wallet-catalog')
      .then((res) => setCatalogs(res.data.data))
      .catch((err) => console.error('Lỗi lấy danh sách danh mục:', err));
  }, []);

  const onSubmit = async (data: WalletFormData) => {
    try {
      const res = await axios.post('/api/wallet', data);
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
        <input {...register('image')} placeholder="URL Ảnh" className="border p-2 w-full" required />
        <input {...register('thumbnail')} placeholder="URL Thumbnail" className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Tạo ví
        </button>
      </form>

      <h3 className="text-lg font-bold mt-6">Danh sách ví</h3>
      <ul className="mt-2">
        {wallets.map((wallet) => (
          <li key={wallet._id} className="border p-2 mt-2">
            <strong>{wallet.name}</strong> - {wallet.color} - {wallet.size} - {wallet.price} VND
          </li>
        ))}
      </ul>
    </div>
  );
}
