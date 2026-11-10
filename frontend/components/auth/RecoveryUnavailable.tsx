import Link from 'next/link';

export function RecoveryUnavailable({ loginHref }: { loginHref: string }) {
  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Pemulihan kata sandi belum tersedia</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        RecyNect belum mengaktifkan pengiriman tautan reset. Hubungi administrator untuk bantuan akun.
      </p>
      <Link href={loginHref} className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800">
        Kembali ke halaman masuk
      </Link>
    </section>
  );
}
