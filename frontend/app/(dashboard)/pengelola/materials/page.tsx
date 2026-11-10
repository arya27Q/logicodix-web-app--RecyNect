'use client';

import React from 'react';
import { useRecyclerMaterials } from '@/hooks/recycler/useRecyclerMaterials';
import { MaterialPriceTable } from '@/components/recycler/MaterialPriceTable';
import { RecyclerStatsCard } from '@/components/recycler/RecyclerStatsCard';
import { RecyclerMaterialModal } from '@/components/recycler/RecyclerMaterialModal';
import { MaterialMarginDiagram } from '@/components/recycler/MaterialMarginDiagram';

export default function RecyclerMaterialsPage() {
  const {
    materials,
    allMaterials,
    activeCount,
    totalCount,
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
        completedPickups={142}
        rating={4.9}
      />

      {/* Visual Margin & Market Benchmark Spread Diagram */}
      <MaterialMarginDiagram />

      <MaterialPriceTable
        materials={materials}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleAccepting={toggleAccepting}
        onOpenCreate={openCreate}
        onOpenEdit={openEdit}
        onDelete={deleteMaterial}
      />

      {/* Create / Edit Material Modal */}
      <RecyclerMaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        material={editingMaterial}
        onSave={saveMaterial}
      />
    </div>
  );
}
