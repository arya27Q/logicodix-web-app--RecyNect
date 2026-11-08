export default async function RecyclerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Profil Detail Pengelola</h1>
      <p className="text-sm text-slate-500">ID Pengelola: {id}</p>
      {/* TODO: Tampilan profil, lokasi koordinat, kontak, dan daftar harga material */}
    </div>
  );
}

