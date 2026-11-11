'use client';

import React, { useEffect } from 'react';
import { useRecyclerMaterials } from '@/hooks/recycler/useRecyclerMaterials';
import { useRecyclerIncoming } from '@/hooks/recycler/useRecyclerIncoming';
import { MaterialPriceTable } from '@/components/recycler/MaterialPriceTable';
import { RecyclerStatsCard } from '@/components/recycler/RecyclerStatsCard';
import { RecyclerMaterialModal } from '@/components/recycler/RecyclerMaterialModal';
import { DeleteConfirmModal } from '@/components/recycler/DeleteConfirmModal';
import { MaterialMarginDiagram } from '@/components/recycler/MaterialMarginDiagram';
import { AlertCircle, CheckCircle2, X, Loader2 } from 'lucide-react';

export default function RecyclerMaterialsPage() {
  const {
    materials,
    categories,
    activeCount,
    totalCount,
    searchQuery,
    setSearchQuery,
    toggleAccepting,
    saveMaterial,
    openCreate,
    openEdit,
    isModalOpen,
    setIsModalOpen,
    editingMaterial,
    deletingMaterial,
    isDeleting,
    isSaving,
    isLoading,
    requestDelete,
    cancelDelete,
    confirmDelete,
    actionError,
    setActionError,
    successMessage,
    setSuccessMessage,
  } = useRecyclerMaterials();

  const { completedCount } = useRecyclerIncoming();

  // Auto-dismiss notifikasi setelah beberapa detik
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, setSuccessMessage]);

  useEffect(() => {
    if (actionError) {
      const timer = setTimeout(() => {
        setActionError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [actionError, setActionError]);

  return (
    <div className="space-y-6">
      {/* Notifikasi Pop-up Kustom (Bawaan Next.js di Tengah Layar) */}
      {(successMessage || actionError) && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] sm:w-auto animate-in fade-in slide-in-from-top-4 duration-200">
          {successMessage && (
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-500/30 text-slate-800 shadow-2xl shadow-emerald-950/15 ring-1 ring-emerald-500/20">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900">Operasi Berhasil</span>
                <span className="text-xs text-slate-600 font-medium">{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="p-1.5 ml-3 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {actionError && (
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-500/30 text-slate-800 shadow-2xl shadow-rose-950/15 ring-1 ring-rose-500/20">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-rose-900">Perhatian</span>
                <span className="text-xs text-slate-600 font-medium">{actionError}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionError(null)}
                className="p-1.5 ml-3 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Katalog Material & Ketentuan Harga Beli
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Atur harga per satuan, minimum kuantitas, syarat mutu fisik, dan ketersediaan penerimaan material untuk warga.
          </p>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span>{activeCount} Material Dibuka</span>
        </div>
      </div>

      <RecyclerStatsCard
        activeMaterials={activeCount}
        totalMaterials={totalCount}
        completedPickups={140 + completedCount}
        rating={4.9}
      />

      {/* Visual Margin & Market Benchmark Spread Diagram */}
      <MaterialMarginDiagram materials={materials} />

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
          onDelete={requestDelete}
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

      {/* Custom Confirmation Dialog for Delete (Posisi di Tengah Layar) */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingMaterial)}
        material={deletingMaterial}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
