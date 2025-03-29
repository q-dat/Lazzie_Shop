'use client';
import React from 'react';
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';

export default function Header() {
  return (
    <>
      <div className="hidden xl:block">
        <DesktopNavbar />
      </div>
      <div className="block xl:hidden">
        <MobileNavbar />
      </div>
    </>
  );
}
