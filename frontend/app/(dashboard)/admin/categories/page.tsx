'use client';

import React from 'react';
import { useAdminCategories } from '@/hooks/admin/useAdminCategories';
import { CategoryTable, CategoryDeleteDialog } from '@/components/admin/CategoryTable';
import { CategoryModal } from '@/components/admin/CategoryModal';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const {
    categories,
    activeCount,
    totalCount,
    isLoading,
    error,
    isSaving,
    actionError,
    successMessage,
    searchQuery,
    setSearchQuery,
    filterActive,
    setFilterActive,
    isModalOpen,
    setIsModalOpen,
    editingCategory,
    deletingCategory,
    isDeleting,
    openEdit,
    openCreate,
    saveCategory,
    requestDelete,
    cancelDelete,
    confirmDelete,
    toggleActive,
    refresh,
  } = useAdminCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Katalog Master Kategori Sampah
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Kelola daftar resmi jenis material daur ulang, satuan baku sistem, serta status publikasinya.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 tabular-nums">
            <span>
              {activeCount} / {totalCount} Kategori Aktif
            </span>
          </div>
        </div>
      </div>

      {actionError && !isModalOpen && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" aria-hidden="true" />
          <span>{actionError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        error={error}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterActive={filterActive}
        onFilterChange={setFilterActive}
        onOpenCreate={openCreate}
        onOpenEdit={openEdit}
        onToggleActive={toggleActive}
        onRequestDelete={requestDelete}
        onRetry={refresh}
      />

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={editingCategory}
        isSaving={isSaving}
        serverError={actionError}
        onSave={saveCategory}
      />

      <CategoryDeleteDialog
        category={deletingCategory}
        isDeleting={isDeleting}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
