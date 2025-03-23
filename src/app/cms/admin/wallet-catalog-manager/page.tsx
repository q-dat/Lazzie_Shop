'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
interface WalletCatalogFormData {
  _id: string;
  name: string;
}

export default function WalletCatalogManager() {
  const { register, handleSubmit, reset } = useForm<WalletCatalogFormData>();
  const [walletCatalogs, setWalletCatalogs] = useState<WalletCatalogFormData[]>([]);
  useEffect(() => {
    axios
      .get('/api/wallet-catalog')
      .then((res) => setWalletCatalogs(res.data.data))
      .catch((err) => console.error('Looii lấy danh sách danh mục:', err));
  }, []);
  const onSubmit = async (data: WalletCatalogFormData) => {
    try {
      const res = await axios.post('/api/wallet-catalog', data);
      setWalletCatalogs([...walletCatalogs, res.data.data]);
      reset();
    } catch (err) {
      console.error('Lỗi tạo danh mục:', err);
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Danh mục Wallet Manager</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('name')} placeholder="Tên danh mục" className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Tạo danh mục
        </button>
      </form>
      <h3 className="text-lg font-bold mt-6">Danh sách danh mục</h3>
      <div>
        {walletCatalogs.map((cat) => (
          <div key={cat._id} className="border p-2 mt-2">
            <strong>{cat.name}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
