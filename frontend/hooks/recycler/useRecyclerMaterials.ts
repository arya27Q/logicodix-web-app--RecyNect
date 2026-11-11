'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export interface RecyclerMaterial {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  pricePerUnit: number;
  unit: string;
  minQuantity: number;
  qualityRequirements: string;
  isAccepting: boolean;
  priceUpdatedAt?: string;
}

export interface WasteCategoryOption {
  id: string;
  name: string;
  unit: string;
}

const DEFAULT_FALLBACK_CATEGORIES: WasteCategoryOption[] = [
  { id: 'cat-kardus', name: 'Kardus / Karton Cokelat', unit: 'kg' },
  { id: 'cat-pet', name: 'Botol Plastik PET Bening', unit: 'kg' },
  { id: 'cat-minyak', name: 'Minyak Jelantah', unit: 'liter' },
  { id: 'cat-alum', name: 'Kaleng Aluminium / Soft Drink', unit: 'kg' },
  { id: 'cat-hvs', name: 'Kertas HVS / Buku Dokumen', unit: 'kg' },
  { id: 'cat-besi', name: 'Besi Tua / Logam Campur', unit: 'kg' },
];

const DEFAULT_MATERIALS: RecyclerMaterial[] = [
  {
    id: 'mat-1',
    name: 'Kardus / Karton Cokelat',
    category: 'Kardus / Karton Cokelat',
    categoryId: 'cat-kardus',
    pricePerUnit: 2200,
    unit: 'kg',
    minQuantity: 10,
    qualityRequirements: 'Kering, bersih dari staples tebal, diikat rapi',
    isAccepting: true,
  },
  {
    id: 'mat-2',
    name: 'Botol Plastik PET Bening',
    category: 'Botol Plastik PET Bening',
    categoryId: 'cat-pet',
    pricePerUnit: 4200,
    unit: 'kg',
    minQuantity: 5,
    qualityRequirements: 'Bersih, tanpa kotoran tanah, tutup botol dilepas',
    isAccepting: true,
  },
  {
    id: 'mat-3',
    name: 'Minyak Jelantah',
    category: 'Minyak Jelantah',
    categoryId: 'cat-minyak',
    pricePerUnit: 6500,
    unit: 'liter',
    minQuantity: 2,
    qualityRequirements: 'Disaring dari sisa remah makanan, jeriken tertutup rapat',
    isAccepting: true,
  },
  {
    id: 'mat-4',
    name: 'Kaleng Aluminium / Soft Drink',
    category: 'Kaleng Aluminium / Soft Drink',
    categoryId: 'cat-alum',
    pricePerUnit: 14000,
    unit: 'kg',
    minQuantity: 3,
    qualityRequirements: 'Dipipihkan, bebas dari sisa cairan manis',
    isAccepting: false,
  },
  {
    id: 'mat-5',
    name: 'Besi Tua / Logam Campur',
    category: 'Besi Tua / Logam Campur',
    categoryId: 'cat-besi',
    pricePerUnit: 5200,
    unit: 'kg',
    minQuantity: 20,
    qualityRequirements: 'Logam padat, bebas dari semen/kotoran batu berlebih',
    isAccepting: true,
  },
];

interface BackendMaterialRecord {
  id: string;
  recyclerId: string;
  categoryId: string;
  price: number;
  unit: string;
  minQuantity: number;
  qualityRequirements?: string;
  isAvailable?: boolean;
  priceUpdatedAt?: string;
  category?: {
    id: string;
    name: string;
    unit: string;
  };
}

function mapBackendToRecyclerMaterial(item: BackendMaterialRecord): RecyclerMaterial {
  return {
    id: item.id,
    name: item.category?.name || 'Material Daur Ulang',
    category: item.category?.name || 'Kategori Umum',
    categoryId: item.categoryId || item.category?.id,
    pricePerUnit: Number(item.price ?? 0),
    unit: item.unit || item.category?.unit || 'kg',
    minQuantity: Number(item.minQuantity ?? 1),
    qualityRequirements: item.qualityRequirements || '',
    isAccepting: item.isAvailable ?? true,
    priceUpdatedAt: item.priceUpdatedAt,
  };
}

export function useRecyclerMaterials(initialData: RecyclerMaterial[] = DEFAULT_MATERIALS) {
  const [materials, setMaterials] = useState<RecyclerMaterial[]>(initialData);
  const [categories, setCategories] = useState<WasteCategoryOption[]>(DEFAULT_FALLBACK_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingMaterial, setEditingMaterial] = useState<RecyclerMaterial | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. Fetch materials dari API backend real
  const fetchMaterials = useCallback(async () => {
    try {
      const data = await apiClient<BackendMaterialRecord[]>('/recyclers/materials/me');
      if (Array.isArray(data)) {
        setMaterials(data.map((item: BackendMaterialRecord) => mapBackendToRecyclerMaterial(item)));
      }
    } catch {
      // Gunakan default demo jika offline / belum login
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Fetch master kategori sampah untuk dropdown modal
  const fetchCategories = useCallback(async () => {
    try {
      const cats = await apiClient<Array<{ id: string; name: string; unit: string }>>('/waste/categories');
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(
          cats.map((c: { id: string; name: string; unit: string }) => ({
            id: c.id,
            name: c.name,
            unit: c.unit,
          }))
        );
      }
    } catch {
      // Gunakan fallback categories
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
    fetchCategories();
  }, [fetchMaterials, fetchCategories]);

  // Otomatis bersihkan status message setelah 4 detik
  useEffect(() => {
    if (!statusMessage) return;
    const timer = setTimeout(() => setStatusMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  // Toggle status penerimaan material
  const toggleAccepting = async (id: string) => {
    const target = materials.find((m: RecyclerMaterial) => m.id === id);
    if (!target) return;

    const nextStatus = !target.isAccepting;
    // Optimistic update
    setMaterials((prev: RecyclerMaterial[]) =>
      prev.map((m: RecyclerMaterial) => (m.id === id ? { ...m, isAccepting: nextStatus } : m))
    );

    try {
      await apiClient(`/recyclers/materials/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: nextStatus }),
      });
      setStatusMessage({
        type: 'success',
        text: `Status penerimaan "${target.name}" berhasil diubah menjadi ${nextStatus ? 'Dibuka' : 'Ditutup'}.`,
      });
    } catch (err: unknown) {
      // Rollback jika gagal
      setMaterials((prev: RecyclerMaterial[]) =>
        prev.map((m: RecyclerMaterial) => (m.id === id ? { ...m, isAccepting: !nextStatus } : m))
      );
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengubah status penerimaan material.';
      setStatusMessage({
        type: 'error',
        text: errorMessage,
      });
    }
  };

  // Simpan material (create baru atau update yang sedang diedit)
  const saveMaterial = async (data: Partial<RecyclerMaterial>) => {
    setIsSaving(true);
    try {
      if (editingMaterial) {
        const updated = await apiClient<BackendMaterialRecord>(`/recyclers/materials/${editingMaterial.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            price: data.pricePerUnit,
            unit: data.unit,
            minQuantity: data.minQuantity,
            qualityRequirements: data.qualityRequirements,
            isAvailable: data.isAccepting !== undefined ? data.isAccepting : editingMaterial.isAccepting,
          }),
        });

        const mapped = mapBackendToRecyclerMaterial(updated);
        setMaterials((prev: RecyclerMaterial[]) =>
          prev.map((m: RecyclerMaterial) => (m.id === editingMaterial.id ? mapped : m))
        );
        setStatusMessage({
          type: 'success',
          text: `Ketentuan material "${mapped.name}" berhasil diperbarui.`,
        });
      } else {
        const created = await apiClient<BackendMaterialRecord>('/recyclers/materials', {
          method: 'POST',
          body: JSON.stringify({
            categoryId: data.categoryId,
            price: data.pricePerUnit,
            unit: data.unit,
            minQuantity: data.minQuantity || 0,
            qualityRequirements: data.qualityRequirements || '',
            isAvailable: true,
          }),
        });

        const mapped = mapBackendToRecyclerMaterial(created);
        setMaterials((prev: RecyclerMaterial[]) => [
          mapped,
          ...prev.filter((m: RecyclerMaterial) => m.categoryId !== mapped.categoryId),
        ]);
        setStatusMessage({
          type: 'success',
          text: `Material "${mapped.name}" berhasil ditambahkan ke daftar penerimaan.`,
        });
      }

      setIsModalOpen(false);
      setEditingMaterial(null);
    } catch {
      // Fallback local state jika offline
      if (editingMaterial) {
        setMaterials((prev: RecyclerMaterial[]) =>
          prev.map((m: RecyclerMaterial) =>
            m.id === editingMaterial.id ? ({ ...m, ...data } as RecyclerMaterial) : m
          )
        );
      } else {
        const fallbackNew: RecyclerMaterial = {
          id: `mat-${Date.now().toString().slice(-6)}`,
          name: data.name || 'Material Baru',
          category: data.category || 'Lainnya',
          categoryId: data.categoryId,
          pricePerUnit: data.pricePerUnit || 1000,
          unit: data.unit || 'kg',
          minQuantity: data.minQuantity || 1,
          qualityRequirements: data.qualityRequirements || '',
          isAccepting: true,
        };
        setMaterials((prev: RecyclerMaterial[]) => [fallbackNew, ...prev]);
      }
      setIsModalOpen(false);
      setEditingMaterial(null);
      setStatusMessage({
        type: 'success',
        text: 'Ketentuan material berhasil disimpan (mode lokal).',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Hapus material
  const deleteMaterial = async (id: string) => {
    const target = materials.find((m: RecyclerMaterial) => m.id === id);
    if (!target) return;

    if (!confirm(`Hapus "${target.name}" dari ketentuan penerimaan gudang Anda?`)) {
      return;
    }

    try {
      await apiClient(`/recyclers/materials/${id}`, { method: 'DELETE' });
      setMaterials((prev: RecyclerMaterial[]) => prev.filter((m: RecyclerMaterial) => m.id !== id));
      setStatusMessage({
        type: 'success',
        text: `Material "${target.name}" berhasil dihapus.`,
      });
    } catch {
      // Fallback local deletion jika offline
      setMaterials((prev: RecyclerMaterial[]) => prev.filter((m: RecyclerMaterial) => m.id !== id));
      setStatusMessage({
        type: 'success',
        text: `Material "${target.name}" dihapus dari tampilan lokal.`,
      });
    }
  };

  const openCreate = () => {
    setEditingMaterial(null);
    setIsModalOpen(true);
  };

  const openEdit = (mat: RecyclerMaterial) => {
    setEditingMaterial(mat);
    setIsModalOpen(true);
  };

  const filteredMaterials = materials.filter(
    (m: RecyclerMaterial) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = materials.filter((m: RecyclerMaterial) => m.isAccepting).length;

  return {
    materials: filteredMaterials,
    allMaterials: materials,
    categories,
    activeCount,
    totalCount: materials.length,
    isLoading,
    isSaving,
    statusMessage,
    clearStatusMessage: () => setStatusMessage(null),
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    editingMaterial,
    openCreate,
    openEdit,
    saveMaterial,
    deleteMaterial,
    toggleAccepting,
    refetch: fetchMaterials,
  };
}
