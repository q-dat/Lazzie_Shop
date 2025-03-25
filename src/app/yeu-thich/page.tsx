'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IWallet } from '@/models/Wallet';
import { useFavorite } from '../context/FavoriteContext/FavoriteProvider';

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorite();
  const [localFavorites, setLocalFavorites] = useState<IWallet[]>([]);

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const handleRemove = (id: string) => {
    toggleFavorite(localFavorites.find((item) => item._id === id)!);
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Favorites</h1>
      {localFavorites.length === 0 ? (
        <p className="text-gray-500">No favorite items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white shadow-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Color</th>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {localFavorites.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="relative h-20 w-20">
                      <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" className="rounded-md" />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{item.name}</td>
                  <td className="px-4 py-3">{item.color}</td>
                  <td className="px-4 py-3">{item.size}</td>
                  <td className="px-4 py-3 font-bold text-gray-800">${item.price}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleRemove(item._id)} className="rounded-md bg-red-500 px-3 py-1 text-white transition hover:bg-red-700">
                      Remove
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
