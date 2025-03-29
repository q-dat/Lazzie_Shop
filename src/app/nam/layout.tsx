import Header from "@/components/userLayout/header";

export const metadata = {
  title: 'Ví da nam cao cấp - Lazzie Shop',
  description: 'Quản lý ví tiền và giao dịch của bạn.',
  keywords: ['wallet', 'finance', 'transactions'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div className="mt-[80px] xl:mt-[150px] px-2 xl:px-desktop-padding">{children}</div>
    </div>
  );
}
