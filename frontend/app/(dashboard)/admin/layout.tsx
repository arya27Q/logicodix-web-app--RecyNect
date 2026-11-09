export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-slate-900 text-white p-6 space-y-4">
        <h2 className="text-lg font-bold text-amber-400">Admin RecyNect</h2>
        <nav className="flex flex-col space-y-2 text-sm text-slate-300">
          <a href="/admin" className="hover:text-white">Overview</a>
          <a href="/admin/verifications" className="hover:text-white">Verifikasi Pengelola</a>
          <a href="/admin/categories" className="hover:text-white">Kategori Sampah</a>
          <a href="/admin/price-audit" className="hover:text-white">Audit Harga</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-slate-50">{children}</main>
    </div>
  );
}

