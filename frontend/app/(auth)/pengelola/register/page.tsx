import Link from 'next/link';

export default function RecyclerRegisterPage() {
  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Pendaftaran mitra belum tersedia</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Akun mitra hanya dapat digunakan setelah dibuat dan diverifikasi oleh administrator RecyNect.
      </p>
      <Link href="/pengelola/login" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800">
        Kembali ke portal pengelola
      </Link>
    </section>
  );
}
