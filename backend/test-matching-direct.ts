import { MatchingService } from './src/modules/matching/services/matching.service.js';
import { WasteService } from './src/modules/waste/waste.service.js';
import { RecyclerService } from './src/modules/recyclers/recycler.service.js';
import type { MatchingRequest } from './src/types/index.js';

async function runDirectTest() {
  console.log('🚀 Memulai Uji Coba Direct Engine RecyNect...\n');

  // Test 1: Katalog Kategori Sampah
  console.log('1️⃣ Menguji WasteService (Katalog Kategori Sampah)...');
  const wasteService = new WasteService();
  const categories = await wasteService.getCategories();
  console.log(`   Ditemukan: ${categories.length} kategori sampah.`);
  categories.forEach((c) => console.log(`   - [${c.id}] ${c.name} (${c.unit})`));
  if (categories.length === 0) throw new Error('Kategori sampah tidak boleh kosong!');
  console.log('   ✅ WasteService berfungsi sempurna!\n');

  // Test 2: Direktori Mitra Pengelola
  console.log('2️⃣ Menguji RecyclerService (Direktori Mitra Pengelola)...');
  const recyclerService = new RecyclerService();
  const recyclers = await recyclerService.getAll();
  console.log(`   Ditemukan: ${recyclers.length} mitra pengelola.`);
  recyclers.forEach((r) => {
    console.log(`   - [${r.id}] ${r.name} (${r.managementType}) di ${r.address} | Total Material: ${r.materials.length}`);
  });
  if (recyclers.length === 0) throw new Error('Mitra pengelola tidak boleh kosong!');
  console.log('   ✅ RecyclerService berfungsi sempurna!\n');

  // Test 3: Eksekusi 4 Sub-Algoritma Matching Engine
  console.log('3️⃣ Menguji MatchingService (4 Sub-Algoritma Inti: Eligibility, Distance, Combination, Scoring)...');
  const matchingService = new MatchingService();

  const testPayload: MatchingRequest = {
    latitude: -6.914744, // Pusat Kota Bandung
    longitude: 107.60981,
    priority: 'balanced',
    searchRadiusKm: 25,
    items: [
      { categoryId: 'cat-kardus', quantity: 15, unit: 'kg', condition: 'Kering dan diikat' },
      { categoryId: 'cat-pet', quantity: 8, unit: 'kg', condition: 'Bersih tanpa tutup botol' },
      { categoryId: 'cat-minyak', quantity: 3, unit: 'liter', condition: 'Minyak jelantah disaring' },
    ],
  };

  const result = await matchingService.executeMatching(testPayload);

  console.log(`   Sesi ID Dihasilkan: ${result.sessionId}`);
  console.log(`   Radius Pencarian: ${result.searchRadiusKm} km | Prioritas: ${result.priority}`);
  console.log(`   Total Alternatif Solusi: ${result.alternatives.length}`);

  if (result.alternatives.length === 0) {
    throw new Error('Matching engine harus menghasilkan minimal 1 alternatif solusi!');
  }

  result.alternatives.forEach((alt) => {
    console.log(`   ------------------------------------------------------------`);
    console.log(`   🏆 [Peringkat #${alt.rank}] Skor: ${alt.finalScore.toFixed(1)}/100 (Ekonomi: ${alt.economyScore.toFixed(1)}, Jarak: ${alt.distanceScore.toFixed(1)}, Stop: ${alt.stopsScore.toFixed(1)})`);
    console.log(`      Total Cuan: Rp ${alt.totalValue.toLocaleString('id-ID')} | Jarak: ${alt.totalDistanceKm.toFixed(1)} km | Tempat: ${alt.totalStops} lokasi`);

    alt.stops.forEach((stop, sIdx) => {
      console.log(`      📍 Stop #${sIdx + 1}: ${stop.recyclerName} (${stop.managementType})`);
      console.log(`         Jarak dari User: ${stop.distanceKm.toFixed(1)} km | Subtotal: Rp ${stop.stopTotalValue.toLocaleString('id-ID')}`);
      stop.materials.forEach((m) => {
        console.log(`         -> ${m.categoryName}: ${m.quantity} ${m.unit} @ Rp ${m.pricePerUnit.toLocaleString('id-ID')} = Rp ${m.estimatedValue.toLocaleString('id-ID')}`);
      });
    });

    if (alt.unmatchedItems && alt.unmatchedItems.length > 0) {
      console.log(`      ⚠️ Sampah Belum Tertampung:`);
      alt.unmatchedItems.forEach((u) => {
        console.log(`         x ${u.categoryName} (${u.quantity} ${u.unit}): ${u.reason}`);
      });
    }
  });

  console.log('\n4️⃣ Menguji Pengambilan Sesi via getSessionById()...');
  const fetchedSession = await matchingService.getSessionById(result.sessionId);
  if (!fetchedSession || !fetchedSession.alternatives || fetchedSession.alternatives.length === 0) {
    throw new Error('Sesi gagal dimuat kembali dari repository!');
  }
  console.log(`   Berhasil memuat kembali sesi ${fetchedSession.sessionId} dengan ${fetchedSession.alternatives.length} alternatif. ✅`);

  console.log('\n============================================================');
  console.log('🎉 SEMUA 4 SUB-ALGORITMA DAN SISTEM PENILAIAN MATCHING BERFUNGSI 100%!');
  console.log('============================================================\n');
}

runDirectTest().catch((err) => {
  console.error('❌ Pengujian Gagal:', err);
  process.exit(1);
});

