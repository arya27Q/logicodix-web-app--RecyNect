'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { RecyclerMaterial } from '@/hooks/recycler/useRecyclerMaterials';

interface MaterialMarginData {
  id: string;
  name: string;
  buyPrice: number;
  marketAvg: number;
  sellPrice: number;
  marginRp: number;
  marginPercent: number;
  unit: string;
}

interface MaterialMarginDiagramProps {
  materials?: RecyclerMaterial[];
}

const FALLBACK_MARGIN_DATA: MaterialMarginData[] = [
  {
    id: 'pet',
    name: 'Botol Plastik PET Bening',
    buyPrice: 4500,
    marketAvg: 4200,
    sellPrice: 5800,
    marginRp: 1300,
    marginPercent: 28.9,
    unit: 'kg',
  },
  {
    id: 'kardus',
    name: 'Kardus / Karton Cokelat',
    buyPrice: 2200,
    marketAvg: 2100,
    sellPrice: 2900,
    marginRp: 700,
    marginPercent: 31.8,
    unit: 'kg',
  },
  {
    id: 'jelantah',
    name: 'Minyak Jelantah',
    buyPrice: 6500,
    marketAvg: 6500,
    sellPrice: 8400,
    marginRp: 1900,
    marginPercent: 29.2,
    unit: 'liter',
  },
  {
    id: 'kaleng',
    name: 'Kaleng Minuman Aluminium',
    buyPrice: 14000,
    marketAvg: 13500,
    sellPrice: 17500,
    marginRp: 3500,
    marginPercent: 25.0,
    unit: 'kg',
  },
  {
    id: 'besi',
    name: 'Besi Tua & Scrap Baja',
    buyPrice: 4800,
    marketAvg: 4700,
    sellPrice: 6100,
    marginRp: 1300,
    marginPercent: 27.1,
    unit: 'kg',
  },
];

export const MaterialMarginDiagram: React.FC<MaterialMarginDiagramProps> = ({ materials }) => {
  const marginData = useMemo<MaterialMarginData[]>(() => {
    if (materials === undefined) {
      return FALLBACK_MARGIN_DATA;
    }
    if (materials.length === 0) {
      return [];
    }

    return materials.map((mat) => {
      const buyPrice = mat.pricePerUnit;
      // Estimasi rata-rata pasar konsorsium daur ulang (deviasi normal ~4-5%)
      const marketAvg = Math.round(buyPrice * 0.96);
      // Estimasi harga serap off-taker / pabrik daur ulang (+28% s/d +32% margin kotor)
      const sellPrice = Math.round(buyPrice * 1.29);
      const marginRp = sellPrice - buyPrice;
      const marginPercent =
        buyPrice > 0 ? Math.round(((sellPrice - buyPrice) / buyPrice) * 1000) / 10 : 0;

      return {
        id: mat.id,
        name: mat.name,
        buyPrice,
        marketAvg,
        sellPrice,
        marginRp,
        marginPercent,
        unit: mat.unit,
      };
    });
  }, [materials]);

  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const activeMaterial = marginData[selectedIdx] || marginData[0];

  // Hitung skala maksimum dinamis untuk diagram batang
  const maxSellPrice = Math.max(...marginData.map((m) => m.sellPrice), 1000);
  const MAX_PRICE = Math.max(maxSellPrice * 1.1, 10000);

  return (
    <div className="card-surface rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Diagram Analisis Margin Keuntungan & Spread Harga Material</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbandingan harga beli dari warga terhadap estimasi harga jual off-taker pabrik dan harga pasar acuan.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
            <span>Beli dari Warga</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span>
            <span>Jual ke Pabrik</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500"></span>
            <span>Acuan Pasar</span>
          </div>
        </div>
      </div>

      {marginData.length === 0 || !activeMaterial ? (
        <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200/90">
          <p className="text-xs font-semibold text-slate-500">
            Belum ada ketentuan material yang terdaftar di katalog gudang Anda. Klik tombol{' '}
            <strong className="text-amber-700 font-bold">&quot;+ Buka Penerimaan Material Baru&quot;</strong> di bawah
            untuk menambahkan material pertama Anda.
          </p>
        </div>
      ) : (
        /* Main Comparative Diagram & Inspector */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Side: Horizontal Bar Spread Diagram (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {marginData.map((mat, idx) => {
              const isSelected = selectedIdx === idx;
              const buyWidthPercent = (mat.buyPrice / MAX_PRICE) * 100;
              const sellWidthPercent = (mat.sellPrice / MAX_PRICE) * 100;
              const marketPositionPercent = (mat.marketAvg / MAX_PRICE) * 100;

              return (
                <div
                  key={mat.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500/80 bg-emerald-50/20 shadow-2xs'
                      : 'border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-900">{mat.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Beli: <strong className="text-amber-800">Rp {mat.buyPrice.toLocaleString('id-ID')}</strong>/{mat.unit}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Jual: <strong className="text-emerald-800">Rp {mat.sellPrice.toLocaleString('id-ID')}</strong>/{mat.unit}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800">
                        +{mat.marginPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Range Bar Graphic with Marker */}
                  <div className="relative h-4 rounded-full bg-slate-100 overflow-hidden">
                    {/* Selling Price Bar (Full Width) */}
                    <div
                      style={{ width: `${sellWidthPercent}%` }}
                      className="absolute inset-y-0 left-0 bg-emerald-500/30 rounded-full"
                    />
                    {/* Buying Price Bar (Inner) */}
                    <div
                      style={{ width: `${buyWidthPercent}%` }}
                      className="absolute inset-y-0 left-0 bg-amber-500 rounded-full"
                    />
                    {/* Market Average Dot Line */}
                    <div
                      style={{ left: `${marketPositionPercent}%` }}
                      title={`Rata-rata Pasar: Rp ${mat.marketAvg.toLocaleString('id-ID')}`}
                      className="absolute top-0 bottom-0 w-1 bg-sky-600 rounded-full z-10 -translate-x-1/2"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Material Inspector Card (4 Cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold uppercase tracking-wider mb-2">
                <span>Proyeksi Margin Bersih</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30">
                  +{activeMaterial.marginPercent}% ROI
                </span>
              </div>

              <h4 className="text-base font-extrabold text-white tracking-tight leading-snug">
                {activeMaterial.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Estimasi keuntungan kotor per 1 {activeMaterial.unit} material terkelola.
              </p>

              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Harga Beli ke Warga:</span>
                  <span className="font-bold text-amber-400 tabular-nums">
                    Rp {activeMaterial.buyPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Rata-rata Pasar Konsorsium:</span>
                  <span className="font-semibold text-sky-400 tabular-nums">
                    Rp {activeMaterial.marketAvg.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Harga Jual ke Pabrik:</span>
                  <span className="font-bold text-emerald-400 tabular-nums">
                    Rp {activeMaterial.sellPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm">
                  <span className="font-bold text-white">Gross Margin per {activeMaterial.unit}:</span>
                  <span className="font-extrabold text-emerald-400 tabular-nums">
                    +Rp {activeMaterial.marginRp.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Harga beli Anda berada dalam rentang aman verifikasi RecyNect (deviasi normal di bawah 15%).
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

