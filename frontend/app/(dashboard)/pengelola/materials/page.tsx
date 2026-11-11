'use client';

import React from 'react';
import { useRecyclerMaterials } from '@/hooks/recycler/useRecyclerMaterials';
import { MaterialPriceTable } from '@/components/recycler/MaterialPriceTable';
import { RecyclerStatsCard } from '@/components/recycler/RecyclerStatsCard';
import { RecyclerMaterialModal } from '@/components/recycler/RecyclerMaterialModal';
import { MaterialMarginDiagram } from '@/components/recycler/MaterialMarginDiagram';
import { CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

export default function RecyclerMaterialsPage() {
  const {
    materials,
    categories,
    activeCount,
    totalCount,
    isLoading,
    isSaving,
    statusMessage,
    clearStatusMessage,
    searchQuery,
    setSearchQuery,
    toggleAccepting,
    saveMaterial,
    deleteMaterial,
    openCreate,
    openEdit,
    isModalOpen,
    setIsModalOpen,
    editingMaterial,
  } = useRecyclerMaterials();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Katalog Material & Ketentuan Harga Beli
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Atur harga beli per satuan unit, batas minimal setoran, syarat mutu fisik, dan status penerimaan material untuk warga.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{activeCount} dari {totalCount} Material Aktif</span>
        </div>
      </div>

      {/* Alert Status Banner (Sukses / Error) */}
      {statusMessage && (
        <div
          role="alert"
          className={`flex items-center justify-between p-4 rounded-2xl border text-xs font-semibold shadow-2xs animate-in fade-in slide-in-from-top-2 duration-150 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={clearStatusMessage}
            className="p-1 rounded-lg hover:bg-black/5 transition"
            aria-label="Tutup notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <RecyclerStatsCard
        activeMaterials={activeCount}
        totalMaterials={totalCount}
        completedPickups={142}
        rating={4.9}
      />

      {/* Visual Margin & Benchmark Diagram */}
      <MaterialMarginDiagram />

      {/* Loading Skeleton vs Table */}
      {isLoading ? (
        <div className="card-surface rounded-2xl p-12 border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-sm font-bold text-slate-800">Memuat Ketentuan Material Gudang...</p>
          <p className="text-xs text-slate-400">Menghubungkan ke database MySQL & katalog kategori sampah</p>
        </div>
      ) : (
        <MaterialPriceTable
          materials={materials}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleAccepting={toggleAccepting}
          onOpenCreate={openCreate}
          onOpenEdit={openEdit}
          onDelete={deleteMaterial}
        />
      )}

      {/* Modal Tambah / Edit Material */}
      <RecyclerMaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        material={editingMaterial}
        onSave={saveMaterial}
        categories={categories}
        isSaving={isSaving}
      />
    </div>
  );
}
