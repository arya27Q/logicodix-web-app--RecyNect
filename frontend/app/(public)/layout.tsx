export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="font-bold text-lg text-emerald-600">SampahHub</span>
          <nav className="flex gap-4 text-sm text-slate-600">
            <a href="/" className="hover:text-emerald-600">Beranda</a>
            <a href="/match" className="hover:text-emerald-600">Pencocokan</a>
            <a href="/recyclers" className="hover:text-emerald-600">Direktori</a>
            <a href="/categories" className="hover:text-emerald-600">Kategori</a>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full p-4">{children}</main>
    </div>
  );
}

