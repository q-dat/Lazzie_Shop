'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { images } from '@/assets/images';
import { HiLocationMarker } from 'react-icons/hi';
import { FaRegHeart } from 'react-icons/fa';
import { IoLogoFacebook } from 'react-icons/io5';
import { useFavorite } from '@/app/context/FavoriteContext/FavoriteProvider';
import { FiShoppingCart } from 'react-icons/fi';
import menuItems from '@/components/utils/menuItems';

export default function DesktopNavbar() {
  const pathname = usePathname();
  const { favoriteCount } = useFavorite();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const foundItem = menuItems.find((item) => item.link === pathname || item.submenu?.some((sub) => sub.link === pathname));
    setActiveItem(foundItem ? foundItem.name : null);
  }, [pathname]);

  return (
    <header className="fixed top-0 z-[99999] h-[140px] w-full flex-col items-center justify-between gap-1 bg-primary text-secondary xl:px-20">
      <section className="flex w-full flex-row items-center justify-between">
        <div className="flex w-1/3 items-center justify-start gap-2 text-sm font-semibold">
          <Link href="https://www.facebook.com/lazzie.shop" target="__blank" className="flex items-center">
            <IoLogoFacebook className="text-xl" />
          </Link>
          <Link href="/cua-hang" className="flex items-center">
            <HiLocationMarker className="text-xl" />
            Store
          </Link>
        </div>
        <div className="flex w-1/3 justify-center">
          <Link href="/">
            <Image src={images.Logo} alt="Logo" className="h-[80px] w-auto" priority />
          </Link>
        </div>
        <div className="flex w-1/3 items-center justify-end gap-3 text-xl">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-[100px] border-b border-black bg-primary text-sm font-semibold placeholder:text-secondary focus:outline-none"
          />
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
      </section>
      {/* Navigation */}
      <nav className="flex h-[60px] flex-row items-center justify-center gap-2">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="group relative"
            onMouseEnter={() => item.submenu && setOpenSubmenu(item.name)}
            onMouseLeave={() => setOpenSubmenu(null)}
          >
            <Link
              href={item.link}
              className={`flex items-center justify-center gap-1 rounded-md p-2 transition-all ${activeItem === item.name ? 'bg-secondary text-primary' : 'hover:bg-white'}`}
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              <span>{item.name}</span>
            </Link>
            {item.submenu && openSubmenu === item.name && (
              <div className="absolute left-0 w-48 rounded-md bg-white text-black shadow-md">
                {item.submenu.map((sub, subIndex) => (
                  <Link key={subIndex} href={sub.link} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                    {sub.icon && <sub.icon className="h-4 w-4" />}
                    <span>{sub.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </header>
  );
}
