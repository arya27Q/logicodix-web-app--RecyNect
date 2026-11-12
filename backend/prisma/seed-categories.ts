import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  {
    id: 'cat-kardus',
    name: 'Kardus / Karton Cokelat',
    slug: 'kardus-karton',
    unit: 'kg',
    description: 'Kardus cokelat tebal kemasan barang, boks paket ekspedisi, atau kotak mie instan.',
    isActive: true,
  },
  {
    id: 'cat-pet',
    name: 'Botol Plastik PET Bening',
    slug: 'botol-plastik-pet',
    unit: 'kg',
    description: 'Botol air mineral transparan, botol minuman soda bersih tanpa label & tutup.',
    isActive: true,
  },
  {
    id: 'cat-hvs',
    name: 'Kertas HVS / Buku',
    slug: 'kertas-hvs-buku',
    unit: 'kg',
    description: 'Kertas dokumen HVS bekas, kertas lembaran putih, buku tulis tanpa sampul plastik.',
    isActive: true,
  },
  {
    id: 'cat-alum',
    name: 'Kaleng Aluminium / Soft Drink',
    slug: 'kaleng-aluminium',
    unit: 'kg',
    description: 'Kaleng minuman soda, kaleng susu kental manis atau aerosol berbahan aluminium.',
    isActive: true,
  },
  {
    id: 'cat-minyak',
    name: 'Minyak Jelantah',
    slug: 'minyak-jelantah',
    unit: 'liter',
    description: 'Minyak goreng bekas pakai rumah tangga yang sudah disaring dari remah kotoran.',
    isActive: true,
  },
  {
    id: 'cat-besi',
    name: 'Besi Tua & Scrap Baja',
    slug: 'besi-tua-logam',
    unit: 'kg',
    description: 'Besi plat bekas, rangka besi tua, paku, pipa dan potongan seng.',
    isActive: true,
  },
  {
    id: 'cat-kaca',
    name: 'Botol Kaca & Beling',
    slug: 'botol-kaca-beling',
    unit: 'kg',
    description: 'Botol sirup beling, botol kecap, toples kaca utuh dan pecahan kaca bersih.',
    isActive: true,
  },
  {
    id: 'cat-elektronik',
    name: 'Elektronik & E-Waste',
    slug: 'elektronik-ewaste',
    unit: 'kg',
    description: 'Komponen elektronik bekas, PCB, kabel tembaga, charger, dan gadget rusak.',
    isActive: true,
  },
];

async function main() {
  console.log('🌱 Menyemai Kategori Sampah Master ke Supabase...');

  for (const cat of CATEGORIES) {
    const record = await prisma.wasteCategory.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        slug: cat.slug,
        unit: cat.unit,
        description: cat.description,
        isActive: cat.isActive,
      },
      create: cat,
    });
    console.log(`✅ Kategori: ${record.name} (${record.unit}) [${record.id}]`);
  }

  console.log('\n🎉 Berhasil menyemai 8 Kategori Sampah Master ke database Supabase!');
}

main()
  .catch((err) => {
    console.error('❌ Gagal menyemai kategori:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

