import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout({ title, breadcrumb, children }) {
  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans min-h-screen flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen">
        <DashboardHeader title={title} breadcrumb={breadcrumb} />
        <div className="p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}