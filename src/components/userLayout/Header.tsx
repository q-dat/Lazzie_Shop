'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import menuItems from '../utils/menuItems';
import { images } from '@/assets/images';
import { HiLocationMarker, HiShoppingCart } from 'react-icons/hi';
import { FaRegHeart } from 'react-icons/fa';
import { IoLogoFacebook } from 'react-icons/io5';
export default function Header() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const foundItem = menuItems.find((item) => item.link === pathname || item.submenu?.some((sub) => sub.link === pathname));
    if (foundItem) {
      setActiveItem(foundItem.name);
    }
  }, [pathname]);

  return (
    <header className="xl:px-20 bg-primary text-secondary h-[140px] flex flex-col items-center justify-between w-full gap-1">
      <section className="flex flex-row items-center justify-between w-full text-sm font-light">
        <div className="flex items-center justify-start gap-2 w-1/3">
          <Link href="https://www.facebook.com/lazzie.shop" target="__blank" className="flex items-center gap-1">
            <IoLogoFacebook className="text-lg" />
            Lazzie Shop
          </Link>
          <Link href="/cua-hang" className="flex items-center gap-1">
            <HiLocationMarker className="text-xl" />
            Cửa Hàng
          </Link>
        </div>
        <div className="w-1/3 flex justify-center">
          <Link href="/">
            <Image src={images.Logo} alt="Logo" className="w-auto h-[80px]" priority />
          </Link>
        </div>
        <div className="flex items-center text-xl justify-end gap-2 w-1/3">
          <input type="text" placeholder="Tìm kiếm" className=" placeholder:text-black focus:outline-none  text-sm font-light border-b w-[100px]" />
          <Link href="/yeu-thich">
            <FaRegHeart />
          </Link>
          <Link href="/gio-hang">
            <HiShoppingCart />
          </Link>
        </div>
      </section>
      <nav className="flex flex-row h-[60px] items-center gap-2">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="relative group"
            onMouseEnter={() => item.submenu && setOpenSubmenu(item.name)}
            onMouseLeave={() => setOpenSubmenu(null)}
          >
            <Link
              href={item.link}
              className={`flex items-center justify-center p-2 rounded-md gap-1 transition-all ${activeItem === item.name ? 'bg-secondary text-primary' : 'hover:bg-white'}`}
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              <span>{item.name}</span>
            </Link>

            {item.submenu && openSubmenu === item.name && (
              <div className="absolute left-0 w-48 bg-white text-black shadow-md rounded-md">
                {item.submenu.map((sub, subIndex) => (
                  <Link key={subIndex} href={sub.link} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                    {sub.icon && <sub.icon className="w-4 h-4" />}
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
