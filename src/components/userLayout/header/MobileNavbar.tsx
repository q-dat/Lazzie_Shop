'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiShoppingCart, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { images } from '@/assets/images';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import menuItems from '@/components/utils/menuItems';
import { useFavorite } from '@/app/context/FavoriteContext/FavoriteProvider';
import { FaRegHeart } from 'react-icons/fa';

export default function MobileNavbar() {
  const { favoriteCount } = useFavorite();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const foundItem = menuItems.find((item) => item.link === pathname || item.submenu?.some((sub) => sub.link === pathname));
    setActiveItem(foundItem ? foundItem.name : null);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pathname, isOpen]);

  return (
    <header className="fixed left-0 top-0 z-50 flex h-[60px] w-full flex-row items-center justify-between bg-white px-2 text-black shadow-md">
      <div className="flex w-1/3 justify-start gap-3 text-2xl">
        <Link href="/yeu-thich" className="relative">
          <FaRegHeart />
          {favoriteCount > 0 && (
            <span className="absolute -right-2 -top-1 flex h-4 items-center justify-center rounded-full bg-red-700 px-1 text-[10px] font-semibold text-white">
              {favoriteCount}
            </span>
          )}
        </Link>
        <Link href="/gio-hang">
          <FiShoppingCart />
        </Link>
      </div>
      <div className="flex w-1/3 justify-center text-xl font-bold">Lazzie</div>
      <div className="flex w-1/3 justify-end">
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {/* Slide-in Menu */}
      <nav
        ref={menuRef}
        className={`fixed left-0 top-0 h-full w-3/4 transform bg-white p-2 shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-full w-full flex-col items-start gap-2 text-lg">
          <div className="mb-5 flex w-full items-center justify-center">
            <Link href="/">
              <Image src={images.Logo} alt="Logo" className="h-[120px] w-auto rounded-full" priority />
            </Link>
          </div>
          {menuItems.map((item, index) => (
            <button
              className={`w-full rounded-sm bg-primary p-4 text-start font-semibold shadow-inner ${activeItem === item.name ? 'bg-secondary text-primary' : 'text-black'}`}
              key={index}
            >
              <Link href={item.link} className="block" onClick={() => setIsOpen(false)}>
                {item.name}
              </Link>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
