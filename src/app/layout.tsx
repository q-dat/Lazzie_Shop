import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { FavoriteProvider } from './context/FavoriteContext/FavoriteProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  icons: '/favicon.png',
  title: 'Trang chủ - Ví da cao cấp - Lazzie Shop',
  description: 'Lazzie Shop - Ví name giá rẻ, chính hãng 100%',
  keywords: 'lazzie, ví nam chính hãng, lazzie shop',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="mytheme">
      <FavoriteProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
      </FavoriteProvider>
    </html>
  );
}
