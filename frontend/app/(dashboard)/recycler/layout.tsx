export default function RecyclerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar Pengelola */}
      <aside className="w-64 bg-slate-900 text-white p-6 space-y-4">
        <h2 className="text-lg font-bold text-emerald-400">Panel Pengelola</h2>
        <nav className="flex flex-col space-y-2 text-sm text-slate-300">
          <a href="/recycler" className="hover:text-white">Dashboard</a>
          <a href="/recycler/profile" className="hover:text-white">Profil & Lokasi</a>
          <a href="/recycler/materials" className="hover:text-white">Ketentuan Material</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-slate-50">{children}</main>
    </div>
  );
}

