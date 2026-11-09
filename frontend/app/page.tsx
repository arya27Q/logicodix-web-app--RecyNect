import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">RecyNect</h1>
      <p className="text-gray-600 mb-6">
        Platform Pencocokan Multi-Material dengan Pengelola Sampah Daur Ulang.
      </p>
      <div className="flex gap-4">
        <Link href="/match" className="text-emerald-600 underline">
          Menuju Form Pencocokan (Matching) →
        </Link>
        <Link href="/recyclers" className="text-emerald-600 underline">
          Direktori Pengelola →
        </Link>
      </div>
    </main>
  );
}
