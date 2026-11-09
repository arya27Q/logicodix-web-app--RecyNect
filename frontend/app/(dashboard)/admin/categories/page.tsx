'use client';

import React from 'react';
import { useAdminCategories } from '@/hooks/admin/useAdminCategories';
import { CategoryTable } from '@/components/admin/CategoryTable';
import { CategoryModal } from '@/components/admin/CategoryModal';
import { Boxes, ShieldCheck } from 'lucide-react';

export default function AdminCategoriesPage() {
  const {
    categories,
    activeCount,
    totalCount,
    searchQuery,
    setSearchQuery,
    filterActive,
    setFilterActive,
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    openEdit,
    openCreate,
    saveCategory,
    deleteCategory,
    toggleActive,
  } = useAdminCategories();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Katalog Master Kategori Sampah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standardisasi jenis material daur ulang, satuan baku sistem, serta rentang harga acuan pasar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{activeCount} Kategori Aktif</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <CategoryTable
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterActive={filterActive}
        onFilterChange={setFilterActive}
        onOpenCreate={openCreate}
        onOpenEdit={openEdit}
        onToggleActive={toggleActive}
        onDelete={deleteCategory}
      />

      {/* Create / Edit Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        onSave={saveCategory}
      />
    </div>
  );
}
