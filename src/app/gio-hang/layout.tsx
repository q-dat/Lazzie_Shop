import Header from '@/components/userLayout/Header';

export const metadata = {
  title: 'Ví da nam cao cấp - Lazzie Shop',
  description: 'Quản lý ví tiền và giao dịch của bạn.',
  keywords: ['wallet', 'finance', 'transactions'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
