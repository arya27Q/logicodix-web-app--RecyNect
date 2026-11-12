'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { WasteCategory } from '@/types';

export interface AdminCategoryItem extends WasteCategory {
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  totalRecyclers: number;
  updatedAt: string;
}

function normalizeCategory(raw: WasteCategory): AdminCategoryItem {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    unit: raw.unit,
    description: raw.description || '',
    icon: raw.icon,
    isActive: Boolean(raw.isActive),
    minPrice: Number(raw.minPrice ?? 0),
    maxPrice: Number(raw.maxPrice ?? 0),
    averagePrice: Number(raw.averagePrice ?? 0),
    totalRecyclers: Number(raw.totalRecyclers ?? 0),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt ? raw.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export function useAdminCategories() {
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategoryItem | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<AdminCategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await apiClient<WasteCategory[]>('/waste/categories/manage');
      setCategories(Array.isArray(res) ? res.map(normalizeCategory) : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat master kategori sampah.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    apiClient<WasteCategory[]>('/waste/categories/manage')
      .then((res) => {
        if (!isMounted) return;
        setCategories(Array.isArray(res) ? res.map(normalizeCategory) : []);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat master kategori sampah.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const notifyAdminChanged = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('admin-data-changed'));
    }
  };

  const toggleActive = async (id: string) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;

    const nextState = !target.isActive;
    setActionError(null);
    setSuccessMessage(null);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: nextState } : c)),
    );

    try {
      const updated = await apiClient<WasteCategory>(`/waste/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: nextState }),
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? normalizeCategory(updated) : c)),
      );
      setSuccessMessage(
        `Kategori "${target.name}" berhasil ${nextState ? 'diaktifkan' : 'dinonaktifkan'}.`,
      );
      notifyAdminChanged();
    } catch (err) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !nextState } : c)),
      );
      setActionError(err instanceof Error ? err.message : 'Gagal memperbarui status kategori.');
    }
  };

  const saveCategory = async (catData: {
    name: string;
    unit: string;
    description?: string;
    isActive?: boolean;
  }) => {
    setIsSaving(true);
    setActionError(null);
    setSuccessMessage(null);

    try {
      if (editingCategory) {
        const updated = await apiClient<WasteCategory>(`/waste/categories/${editingCategory.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: catData.name,
            unit: catData.unit,
            description: catData.description ?? '',
            isActive: catData.isActive ?? editingCategory.isActive,
          }),
        });
        const normalized = normalizeCategory(updated);
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? normalized : c)),
        );
        setSuccessMessage(`Kategori "${normalized.name}" berhasil diperbarui.`);
      } else {
        const created = await apiClient<WasteCategory>('/waste/categories', {
          method: 'POST',
          body: JSON.stringify({
            name: catData.name,
            unit: catData.unit,
            description: catData.description ?? '',
            isActive: catData.isActive ?? true,
          }),
        });
        const normalized = normalizeCategory(created);
        setCategories((prev) => [normalized, ...prev]);
        setSuccessMessage(`Kategori "${normalized.name}" berhasil ditambahkan.`);
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      notifyAdminChanged();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Gagal menyimpan kategori master.');
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (cat: AdminCategoryItem) => {
    setActionError(null);
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setActionError(null);
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const requestDelete = (cat: AdminCategoryItem) => {
    setActionError(null);
    setDeletingCategory(cat);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeletingCategory(null);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    setActionError(null);
    setSuccessMessage(null);

    const target = deletingCategory;
    try {
      await apiClient(`/waste/categories/${target.id}`, { method: 'DELETE' });
      setCategories((prev) => prev.filter((c) => c.id !== target.id));
      setDeletingCategory(null);
      setSuccessMessage(`Kategori "${target.name}" berhasil dihapus.`);
      notifyAdminChanged();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Gagal menghapus kategori.');
      setDeletingCategory(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      c.unit.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q);
    if (filterActive === 'active') return matchesSearch && c.isActive;
    if (filterActive === 'inactive') return matchesSearch && !c.isActive;
    return matchesSearch;
  });

  return {
    categories: filteredCategories,
    allCategories: categories,
    activeCount: categories.filter((c) => c.isActive).length,
    totalCount: categories.length,
    isLoading,
    error,
    isSaving,
    actionError,
    setActionError,
    successMessage,
    setSuccessMessage,
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
    refresh: fetchCategories,
  };
}
