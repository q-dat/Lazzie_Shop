'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IWallet } from '@/models/Wallet';

// Định nghĩa kiểu dữ liệu cho Context
interface FavoriteContextType {
  favorites: IWallet[];
  favoriteCount: number;
  toggleFavorite: (wallet: IWallet) => void;
}

// Tạo Context
const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

// Provider để bao bọc toàn bộ ứng dụng
export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<IWallet[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Lấy dữ liệu từ localStorage khi component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favorites');
      const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      setFavorites(parsedFavorites);
      setFavoriteCount(parsedFavorites.length);
    }
  }, []);

  // Cập nhật localStorage mỗi khi favorites thay đổi
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setFavoriteCount(favorites.length);
  }, [favorites]);

  // Hàm thêm/xóa ví khỏi danh sách yêu thích
  const toggleFavorite = useCallback((wallet: IWallet) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav._id === wallet._id);
      return isFavorite
        ? prevFavorites.filter((fav) => fav._id !== wallet._id)
        : [...prevFavorites, wallet];
    });
  }, []);

  return (
    <FavoriteContext.Provider value={{ favorites, favoriteCount, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

// Custom hook để sử dụng Context
export function useFavorite() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
}
