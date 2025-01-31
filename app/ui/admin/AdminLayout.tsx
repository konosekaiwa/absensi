// app/ui/admin/AdminLayout.tsx
import Sidebar from '../../ui/admin/Sidebar';
import Topbar from '../../ui/admin/Topbar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] bg-slate-100 text-slate-800">
      {/* Topbar spanning both columns */}
      <div className="row-start-1 row-end-2 col-span-2">
        <Topbar />
      </div>

      {/* Sidebar on the left side */}
      <div className="row-start-2 col-start-1 col-end-2 bg-gray-800">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="row-start-2 col-start-2 p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
