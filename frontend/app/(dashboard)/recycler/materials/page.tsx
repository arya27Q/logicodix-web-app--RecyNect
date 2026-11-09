'use client';

import React from 'react';
import { useRecyclerMaterials } from '@/hooks/recycler/useRecyclerMaterials';
import { MaterialPriceTable } from '@/components/recycler/MaterialPriceTable';
import { RecyclerStatsCard } from '@/components/recycler/RecyclerStatsCard';

export default function RecyclerMaterialsPage() {
  const {
    materials,
    allMaterials,
    activeCount,
    totalCount,
    searchQuery,
    setSearchQuery,
    toggleAccepting,
    updatePrice,
  } = useRecyclerMaterials();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
          Material & Harga Beli
        </h1>
        <p className="text-sm text-slate-500">
          Atur harga per satuan, minimum kuantitas, syarat mutu, dan ketersediaan penerimaan material untuk warga.
        </p>
      </div>

      <RecyclerStatsCard
        activeMaterials={activeCount}
        totalMaterials={totalCount}
        completedPickups={142}
        rating={4.9}
      />

      <MaterialPriceTable
        materials={materials}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleAccepting={toggleAccepting}
        onUpdatePrice={updatePrice}
      />
    </div>
  );
}
