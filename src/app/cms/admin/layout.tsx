import Sidebar from "@/components/adminLayout/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div>
    <Sidebar/>
    {children}</div>;
}
