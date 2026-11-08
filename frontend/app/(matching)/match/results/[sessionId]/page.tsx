export default async function MatchResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Hasil Rekomendasi Pencocokan</h1>
      <p className="text-sm text-slate-500 mb-6">Sesi ID: {sessionId}</p>
      {/* TODO: Tampilan kartu alternatif hasil pencocokan & rincian tempat singgah */}
    </div>
  );
}
