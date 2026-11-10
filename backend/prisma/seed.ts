import 'dotenv/config';
import { PrismaClient, ManagementType, VerificationStatus, UserRole } from '@prisma/client';
import { hashPassword } from '../src/security/password.js';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Seed demo hanya boleh dijalankan pada NODE_ENV=development.');
  }
  let databaseHost = '';
  try {
    databaseHost = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : '';
  } catch {
    throw new Error('DATABASE_URL tidak valid.');
  }
  if (!['localhost', '127.0.0.1', '::1'].includes(databaseHost)) {
    throw new Error('Seed demo hanya boleh dijalankan terhadap database lokal.');
  }
  if (process.env.RESET_DATABASE !== 'true') {
    throw new Error('Seed ini menghapus data; set RESET_DATABASE=true hanya pada database development yang aman.');
  }

  const userPassword = process.env.SEED_USER_PASSWORD;
  const recyclerPassword = process.env.SEED_RECYCLER_PASSWORD;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if ([userPassword, recyclerPassword, adminPassword].some((password) => !password || password.length < 12 || password.length > 128)) {
    throw new Error('SEED_USER_PASSWORD, SEED_RECYCLER_PASSWORD, dan SEED_ADMIN_PASSWORD wajib diisi 12-128 karakter.');
  }

  const [userPasswordHash, recyclerPasswordHash, adminPasswordHash] = await Promise.all([
    hashPassword(userPassword!),
    hashPassword(recyclerPassword!),
    hashPassword(adminPassword!),
  ]);

  console.log('🌱 Memulai seeding database RecyNect...');

  // 1. Bersihkan data lama (opsional jika tabel sudah ada)
  await prisma.priceHistory.deleteMany();
  await prisma.matchingAssignment.deleteMany();
  await prisma.matchingResult.deleteMany();
  await prisma.matchingItem.deleteMany();
  await prisma.matchingSession.deleteMany();
  await prisma.recyclerMaterial.deleteMany();
  await prisma.wasteCategory.deleteMany();
  await prisma.recycler.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Master Waste Categories
  console.log('📦 Menambahkan Kategori Sampah...');
  const catKardus = await prisma.wasteCategory.create({
    data: {
      name: 'Kardus / Karton Cokelat',
      slug: 'kardus-karton',
      unit: 'kg',
      description: 'Kardus cokelat tebal kemasan barang, boks paket, atau kotak mie instan.',
      isActive: true,
    },
  });

  const catPet = await prisma.wasteCategory.create({
    data: {
      name: 'Botol Plastik PET Bening',
      slug: 'botol-plastik-pet',
      unit: 'kg',
      description: 'Botol air mineral transparan, botol minuman soda bersih tanpa label & tutup.',
      isActive: true,
    },
  });

  const catHvs = await prisma.wasteCategory.create({
    data: {
      name: 'Kertas HVS / Buku',
      slug: 'kertas-hvs-buku',
      unit: 'kg',
      description: 'Kertas dokumen HVS bekas, kertas lembaran putih, buku tulis tanpa sampul plastik.',
      isActive: true,
    },
  });

  const catAlum = await prisma.wasteCategory.create({
    data: {
      name: 'Kaleng Aluminium / Soft Drink',
      slug: 'kaleng-aluminium',
      unit: 'kg',
      description: 'Kaleng minuman soda, kaleng susu kental manis atau aerosol berbahan aluminium.',
      isActive: true,
    },
  });

  const catMinyak = await prisma.wasteCategory.create({
    data: {
      name: 'Minyak Jelantah',
      slug: 'minyak-jelantah',
      unit: 'liter',
      description: 'Minyak goreng bekas pakai rumah tangga yang sudah disaring dari kotoran.',
      isActive: true,
    },
  });

  // 3. Seed Users & Admins
  console.log('👤 Menambahkan Akun Pengguna & Admin...');
  const userWarga = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'warga@recynect.id',
      password: userPasswordHash,
      phone: '081234567890',
      role: UserRole.user,
    },
  });

  const userMitra = await prisma.user.create({
    data: {
      name: 'Pengelola Bank Sampah Berkah',
      email: 'mitra@recynect.id',
      password: recyclerPasswordHash,
      phone: '081298765432',
      role: UserRole.recycler,
    },
  });

  await prisma.admin.create({
    data: {
      name: 'Super Administrator',
      email: 'admin@recynect.id',
      password: adminPasswordHash,
      role: 'superadmin',
    },
  });

  // 4. Seed Profil Recyclers (Mitra Pengelola)
  console.log('🏬 Menambahkan Profil Mitra Pengelola...');
  const recBankSampah = await prisma.recycler.create({
    data: {
      name: 'Bank Sampah Berkah Mandiri',
      userId: userMitra.id,
      managementType: ManagementType.bank_sampah,
      description: 'Bank sampah tingkat RW menerima sampah daur ulang warga sekitar dengan sistem tabungan/tunai.',
      address: 'Jl. Merdeka No. 12, Kelurahan Sukajaya, Bandung',
      latitude: -6.914744,
      longitude: 107.60981,
      contact: '081298765432',
      operatingHours: 'Senin - Sabtu (08:00 - 15:00)',
      verificationStatus: VerificationStatus.verified,
      isDemo: true,
      isActive: true,
    },
  });

  const recPengepul = await prisma.recycler.create({
    data: {
      name: 'Pengepul Logam & Plastik Jaya Abadi',
      managementType: ManagementType.pengepul,
      description: 'Pengepul skala menengah menerima kapasitas besar dan partai kecil dengan pembayaran tunai langsung.',
      address: 'Jl. Raya Kopo No. 88, Bandung',
      latitude: -6.932451,
      longitude: 107.592143,
      contact: '085712348899',
      operatingHours: 'Setiap Hari (07:30 - 17:00)',
      verificationStatus: VerificationStatus.verified,
      isDemo: true,
      isActive: true,
    },
  });

  const recTps3r = await prisma.recycler.create({
    data: {
      name: 'TPS3R Resik Barokah',
      managementType: ManagementType.tps3r,
      description: 'Fasilitas Tempat Pengolahan Sampah Reuse-Reduce-Recycle binaan Dinas Lingkungan Hidup.',
      address: 'Jl. Terusan Buah Batu No. 45, Bandung',
      latitude: -6.960124,
      longitude: 107.632115,
      contact: '082155443322',
      operatingHours: 'Senin - Jumat (08:00 - 14:00)',
      verificationStatus: VerificationStatus.verified,
      isDemo: true,
      isActive: true,
    },
  });

  const recIndustri = await prisma.recycler.create({
    data: {
      name: 'PT Daur Ulang Nusantara (Pabrik)',
      managementType: ManagementType.recycler_industry,
      description: 'Pabrik peleburan dan penggilingan plastik daur ulang skala industri.',
      address: 'Kawasan Industri Cimareme Blok C No. 5, Bandung Barat',
      latitude: -6.878901,
      longitude: 107.512345,
      contact: '022-6868990',
      operatingHours: 'Senin - Jumat (08:00 - 17:00)',
      verificationStatus: VerificationStatus.verified,
      isDemo: true,
      isActive: true,
    },
  });

  // 5. Seed Recycler Materials (Harga, Minimum Setoran, Syarat Mutu)
  console.log('💰 Menambahkan Ketentuan Harga & Material Pengelola...');
  
  // Bank Sampah Berkah
  await prisma.recyclerMaterial.create({
    data: {
      recyclerId: recBankSampah.id,
      categoryId: catKardus.id,
      price: 2000,
      unit: 'kg',
      minQuantity: 1.0,
      qualityRequirements: 'Kering, bersih dari lakban tebal atau staples besar, diikat rapi.',
      isAvailable: true,
    },
  });

  await prisma.recyclerMaterial.create({
    data: {
      recyclerId: recBankSampah.id,
      categoryId: catPet.id,
      price: 3500,
      unit: 'kg',
      minQuantity: 0.5,
      qualityRequirements: 'Sudah dipipihkan, tutup botol dilepas, bersih dari sisa cairan manis.',
      isAvailable: true,
    },
  });

  await prisma.recyclerMaterial.create({
    data: {
      recyclerId: recBankSampah.id,
      categoryId: catMinyak.id,
      price: 6500,
      unit: 'liter',
      minQuantity: 1.0,
      qualityRequirements: 'Disaring dari sisa remah makanan, ditampung dalam jeriken/botol plastik tertutup.',
      isAvailable: true,
    },
  });

  // Pengepul Jaya Abadi (Harga lebih tinggi tapi min quantity lebih besar)
  await prisma.recyclerMaterial.create({
    data: {
      recyclerId: recPengepul.id,
      categoryId: catKardus.id,
      price: 2500,
      unit: 'kg',
      minQuantity: 5.0,
      qualityRequirements: 'Kering dan tidak berjamur.',
      isAvailable: true,
    },
  });

  await prisma.recyclerMaterial.create({
    data: {
      recyclerId: recPengepul.id,
      categoryId: catPet.id,
      price: 4200,
      unit: 'kg',
      minQuantity: 3.0,
      qualityRequirements: 'Botol plastik PET bening bersih, tanpa kotoran tanah/lumpur.',
      isAvailable: true,
    },
  });

  await prisma.recyclerMaterial.create({
    data: {
      recyclerId: recPengepul.id,
      categoryId: catAlum.id,
      price: 14000,
      unit: 'kg',
      minQuantity: 1.0,
      qualityRequirements: 'Kaleng dipipihkan / diinjak gepeng.',
      isAvailable: true,
    },
  });

  await prisma.recyclerMaterial.create({
    data: {
      recyclerId: recPengepul.id,
      categoryId: catHvs.id,
      price: 2800,
      unit: 'kg',
      minQuantity: 5.0,
      qualityRequirements: 'Kertas putih tidak bercampur koran atau plastik.',
      isAvailable: true,
    },
  });

  // Industri Daur Ulang (Khusus kapasitas besar / harga tertinggi)
  await prisma.recyclerMaterial.create({
    data: {
      recyclerId: recIndustri.id,
      categoryId: catPet.id,
      price: 5500,
      unit: 'kg',
      minQuantity: 50.0,
      qualityRequirements: 'Sudah dipilah per warna, dipress atau dicacah rapi.',
      isAvailable: true,
    },
  });

  await prisma.recyclerMaterial.create({
    data: {
      recyclerId: recIndustri.id,
      categoryId: catAlum.id,
      price: 17000,
      unit: 'kg',
      minQuantity: 20.0,
      qualityRequirements: 'Aluminium murni tanpa campuran besi magnetik.',
      isAvailable: true,
    },
  });

  console.log('✅ Seeding database RecyNect selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

