'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Image from 'next/image';
import { IWallet, WalletFormData } from '@/models/Wallet';

export default function WalletManager() {
  const { register, handleSubmit, reset, setValue, watch } = useForm<WalletFormData>();
  const [wallets, setWallets] = useState<IWallet[]>([]);
  const [catalogs, setCatalogs] = useState<{ _id: string; name: string }[]>([]);
  const [editingWallet, setEditingWallet] = useState<IWallet | null>(null);

  // Lấy ảnh xem trước từ FileList
  const watchImage = watch('image');
  const watchThumbnail = watch('thumbnail');

  const previewImage = watchImage && watchImage.length > 0 ? URL.createObjectURL(watchImage[0]) : editingWallet?.image || null;
  const previewThumbnail = watchThumbnail && watchThumbnail.length > 0 ? URL.createObjectURL(watchThumbnail[0]) : editingWallet?.thumbnail || null;

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
      const formData = new FormData();
      formData.append('wallet_catalog_id', data.wallet_catalog_id);
      formData.append('name', data.name);
      formData.append('color', data.color);
      formData.append('size', data.size);
      formData.append('price', data.price.toString());

      if (data.image.length > 0) formData.append('image', data.image[0]);
      if (data.thumbnail.length > 0) formData.append('thumbnail', data.thumbnail[0]);

      let res: { data: { data: IWallet } };

      if (editingWallet) {
        res = await axios.put(`/api/wallet/${editingWallet._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setWallets(wallets.map((w) => (w._id === editingWallet._id ? res.data.data : w)));
        setEditingWallet(null);
      } else {
        res = await axios.post('/api/wallet', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setWallets([...wallets, res.data.data]);
      }

      reset();
    } catch (err) {
      console.error('Lỗi khi lưu ví:', err);
    }
  };

  const handleEdit = (wallet: IWallet) => {
    setEditingWallet(wallet);
    setValue('wallet_catalog_id', wallet.wallet_catalog_id);
    setValue('name', wallet.name);
    setValue('color', wallet.color);
    setValue('size', wallet.size);
    setValue('price', wallet.price);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/wallet/${id}`);
      setWallets(wallets.filter((w) => w._id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa ví:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{editingWallet ? 'Chỉnh sửa ví' : 'Tạo ví mới'}</h2>
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
        <input {...register('image')} type="file" accept="image/*" className="border p-2 w-full" />
        {previewImage && (
          <div className="relative w-32 h-32 mt-2">
            <Image src={previewImage} alt="Xem trước ảnh chính" layout="fill" objectFit="cover" className="border rounded-md" />
          </div>
        )}

        {/* Ảnh phụ */}
        <input {...register('thumbnail')} type="file" accept="image/*" className="border p-2 w-full" />
        {previewThumbnail && (
          <div className="relative w-32 h-32 mt-2">
            <Image src={previewThumbnail} alt="Xem trước ảnh phụ" layout="fill" objectFit="cover" className="border rounded-md" />
          </div>
        )}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          {editingWallet ? 'Cập nhật ví' : 'Tạo ví'}
        </button>

        {editingWallet && (
          <button
            type="button"
            className="ml-2 bg-gray-500 text-white px-4 py-2"
            onClick={() => {
              reset();
              setEditingWallet(null);
            }}
          >
            Hủy
          </button>
        )}
      </form>

      <h3 className="text-lg font-bold mt-6">Danh sách ví</h3>
      <ul className="mt-2">
        {wallets.map((wallet) => (
          <li key={wallet._id} className="border p-2 mt-2 flex flex-col space-y-2">
            <strong>{wallet.name}</strong> - {wallet.color} - {wallet.size} - {wallet.price} VND
            <div className="flex space-x-4">
              <Image src={wallet.image} alt="Ảnh chính" width={128} height={128} objectFit="cover" className="border rounded-md" />
              <Image src={wallet.thumbnail} alt="Ảnh phụ" width={128} height={128} objectFit="cover" className="border rounded-md" />
            </div>
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(wallet)} className="bg-yellow-500 text-white px-3 py-1">
                Sửa
              </button>
              <button onClick={() => handleDelete(wallet._id)} className="bg-red-500 text-white px-3 py-1">
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
