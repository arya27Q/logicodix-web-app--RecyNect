'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Package,
  Wine,
  Droplets,
  Box,
  FileText,
  Wrench,
  Layers,
  Search,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import type { WasteCategory } from '@/types';

function getCategoryVisual(category: WasteCategory) {
  const key = `${category.slug || ''} ${category.name} ${category.unit}`.toLowerCase();
  if (key.includes('kardus') || key.includes('karton')) {
    return {
      icon: <Package className="w-6 h-6 text-amber-800" aria-hidden="true" />,
      badgeBg: 'bg-amber-50 border-amber-200',
    };
  }
  if (key.includes('pet') || key.includes('botol') || key.includes('plastik')) {
    return {
      icon: <Wine className="w-6 h-6 text-emerald-800" aria-hidden="true" />,
      badgeBg: 'bg-emerald-50 border-emerald-200',
    };
  }
  if (key.includes('minyak') || key.includes('jelantah') || category.unit === 'liter') {
    return {
      icon: <Droplets className="w-6 h-6 text-sky-800" aria-hidden="true" />,
      badgeBg: 'bg-sky-50 border-sky-200',
    };
  }
  if (key.includes('kaleng') || key.includes('aluminium')) {
    return {
      icon: <Box className="w-6 h-6 text-indigo-800" aria-hidden="true" />,
      badgeBg: 'bg-indigo-50 border-indigo-200',
    };
  }
  if (key.includes('kertas') || key.includes('hvs') || key.includes('buku')) {
    return {
      icon: <FileText className="w-6 h-6 text-slate-800" aria-hidden="true" />,
      badgeBg: 'bg-slate-100 border-slate-200',
    };
  }
  if (key.includes('besi') || key.includes('logam')) {
    return {
      icon: <Wrench className="w-6 h-6 text-slate-800" aria-hidden="true" />,
      badgeBg: 'bg-slate-100 border-slate-200',
    };
  }

  return {
    icon: <Layers className="w-6 h-6 text-emerald-800" aria-hidden="true" />,
    badgeBg: 'bg-emerald-50 border-emerald-200',
  };
}

function formatPriceRange(cat: WasteCategory): string {
  const min = Number(cat.minPrice ?? 0);
  const max = Number(cat.maxPrice ?? 0);
  const count = Number(cat.totalRecyclers ?? 0);
  if (count === 0 || (min <= 0 && max <= 0)) {
    return 'Belum ada penawaran harga mitra aktif';
  }
  if (min === max) {
    return `Rp ${min.toLocaleString('id-ID')} / ${cat.unit}`;
  }
  return `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')} / ${cat.unit}`;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<WasteCategory[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient<WasteCategory[]>('/waste/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat daftar kategori sampah.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    apiClient<WasteCategory[]>('/waste/categories')
      .then((data) => {
        if (!isMounted) return;
        setCategories(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat daftar kategori sampah.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const availableUnits = Array.from(new Set(categories.map((c) => c.unit))).filter(Boolean);

  const filteredCategories = categories.filter((cat) => {
    const matchesUnit = selectedUnit === 'all' || cat.unit === selectedUnit;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      cat.name.toLowerCase().includes(q) ||
      (cat.description || '').toLowerCase().includes(q) ||
      cat.unit.toLowerCase().includes(q);
    return matchesUnit && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div className="border-b border-slate-200 pb-5 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Kategori Sampah Daur Ulang & Standar Mutu
        </h1>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          Pelajari satuan baku, kisaran harga indikatif dari mitra aktif, dan deskripsi pemilahan
          sebelum mencocokkan sampah Anda ke pengelola.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Filter satuan kategori"
          className="flex flex-wrap items-center gap-1.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedUnit === 'all'}
            onClick={() => setSelectedUnit('all')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedUnit === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            Semua Satuan
          </button>
          {availableUnits.map((unit) => (
            <button
              key={unit}
              type="button"
              role="tab"
              aria-selected={selectedUnit === unit}
              onClick={() => setSelectedUnit(unit)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase transition ${
                selectedUnit === unit
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {unit}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <label htmlFor="public-categories-search" className="sr-only">
            Cari kategori material sampah
          </label>
          <Search
            className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="public-categories-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari jenis material..."
            className="w-full h-11 pl-9 pr-3 rounded-lg border border-slate-300 text-xs text-slate-900 placeholder-slate-500 bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-xs font-semibold text-slate-600 bg-white rounded-2xl border border-slate-200">
          Memuat katalog kategori sampah resmi...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="p-6 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold text-rose-800"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchCategories}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-white border border-rose-200 font-bold hover:bg-rose-100 transition"
          >
            Muat Ulang
          </button>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-10 text-center text-xs text-slate-600 bg-white rounded-2xl border border-dashed border-slate-200 space-y-1">
          <p className="font-bold text-slate-800">Kategori material tidak ditemukan</p>
          <p>
            {categories.length === 0
              ? 'Belum ada kategori sampah aktif yang dipublikasikan administrator.'
              : 'Coba ubah filter satuan atau kata kunci pencarian.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => {
            const visual = getCategoryVisual(cat);
            const totalRecyclers = Number(cat.totalRecyclers ?? 0);

            return (
              <div
                key={cat.id}
                className="card-surface rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className={`p-3 rounded-2xl border flex items-center justify-center ${visual.badgeBg}`}>
                      {visual.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                      Satuan: {cat.unit}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{cat.name}</h2>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {cat.description || 'Belum ada deskripsi panduan khusus untuk kategori ini.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-0.5">
                    <span className="text-[11px] font-semibold text-amber-900 block">
                      Kisaran Harga Mitra ({totalRecyclers} pengelola):
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 tabular-nums block">
                      {formatPriceRange(cat)}
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100">
                  <Link
                    href={`/match?category=${cat.id}`}
                    className="min-h-[44px] w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl transition"
                  >
                    <span>Cocokkan Material Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
