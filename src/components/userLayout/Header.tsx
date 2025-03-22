"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Thay useLocation của React Router
import menuItems from "../utils/menuItems";
import { images } from "@/assets/images";
import { HiLocationMarker, HiShoppingCart } from "react-icons/hi";
import { IoMdHeart } from "react-icons/io";

export default function Header() {
  const pathname = usePathname(); // Lấy route hiện tại
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Cập nhật activeItem dựa trên URL
  useEffect(() => {
    const foundItem = menuItems.find(
      (item) =>
        item.link === pathname ||
        item.submenu?.some((sub) => sub.link === pathname)
    );
    if (foundItem) {
      setActiveItem(foundItem.name);
    }
  }, [pathname]);

  return (
    <header className="xl:px-20 bg-primary text-secondary h-[140px] flex flex-col items-center justify-between w-full gap-1">
      <section className="flex flex-row items-center justify-between w-full text-sm font-black">
        <Link href="/cua-hang" className="flex items-center gap-1">
          <HiLocationMarker className="text-xl" />
          Stores
        </Link>
        <Link href="/">
          <Image
            src={images.Logo}
            alt="Logo"
            className="w-auto h-[80px]"
            priority
          />
        </Link>
        <div className="flex items-center text-xl justify-center gap-2">
          <Link href="/yeu-thich">
            <IoMdHeart />
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
              className={`flex items-center justify-center p-2 rounded-md gap-1 transition-all ${
                activeItem === item.name
                  ? "bg-secondary text-primary"
                  : "hover:bg-white"
              }`}
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              <span>{item.name}</span>
            </Link>

            {item.submenu && openSubmenu === item.name && (
              <div className="absolute left-0 w-48 bg-white text-black shadow-md rounded-md">
                {item.submenu.map((sub, subIndex) => (
                  <Link
                    key={subIndex}
                    href={sub.link}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
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
