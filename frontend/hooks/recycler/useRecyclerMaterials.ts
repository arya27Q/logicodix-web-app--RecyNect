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

export interface WasteCategoryMaster {
  id: string;
  name: string;
  unit: string;
  description?: string;
}

export type WasteCategoryOption = WasteCategoryMaster;

export function useRecyclerMaterials(initialData: RecyclerMaterial[] = []) {
  const [materials, setMaterials] = useState<RecyclerMaterial[]>(initialData);
  const [categories, setCategories] = useState<WasteCategoryMaster[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RecyclerMaterial | null>(null);
  const [deletingMaterial, setDeletingMaterial] = useState<RecyclerMaterial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshMaterials = useCallback(async () => {
    try {
      const res = await apiClient<RecyclerMaterial[]>('/recyclers/materials/me');
      if (Array.isArray(res)) {
        setMaterials(res);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      apiClient<RecyclerMaterial[]>('/recyclers/materials/me').catch(() => null),
      apiClient<WasteCategoryMaster[]>('/waste/categories').catch(() => null),
    ]).then(([mats, cats]) => {
      if (!isMounted) return;
      if (Array.isArray(mats)) {
        setMaterials(mats);
      }
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
      setIsLoading(false);
    });

    const handleSync = () => {
      apiClient<RecyclerMaterial[]>('/recyclers/materials/me')
        .then((mats) => {
          if (!isMounted) return;
          if (Array.isArray(mats)) {
            setMaterials(mats);
          }
        })
        .catch(() => {});
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('recycler-materials-changed', handleSync);
    }

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('recycler-materials-changed', handleSync);
      }
    };
  }, []);

  const toggleAccepting = async (id: string) => {
    const target = materials.find((m) => m.id === id);
    if (!target) return;

    const nextState = !target.isAccepting;
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isAccepting: nextState } : m))
    );

    try {
      await apiClient(`/recyclers/materials/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: nextState }),
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('recycler-materials-changed'));
      }
    } catch (err) {
      setMaterials((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isAccepting: !nextState } : m))
      );
      setActionError(err instanceof Error ? err.message : 'Gagal memperbarui status material.');
    }
  };

  const updatePrice = async (id: string, newPrice: number) => {
    const prevPrice = materials.find((m) => m.id === id)?.pricePerUnit;
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pricePerUnit: newPrice } : m))
    );

    try {
      await apiClient(`/recyclers/materials/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ price: newPrice }),
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('recycler-materials-changed'));
      }
    } catch (err) {
      if (prevPrice !== undefined) {
        setMaterials((prev) =>
          prev.map((m) => (m.id === id ? { ...m, pricePerUnit: prevPrice } : m))
        );
      }
      setActionError(err instanceof Error ? err.message : 'Gagal memperbarui harga.');
    }
  };

  const updateMinQuantity = async (id: string, minQty: number) => {
    const prevQty = materials.find((m) => m.id === id)?.minQuantity;
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, minQuantity: minQty } : m))
    );

    try {
      await apiClient(`/recyclers/materials/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ minQuantity: minQty }),
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('recycler-materials-changed'));
      }
    } catch (err) {
      if (prevQty !== undefined) {
        setMaterials((prev) =>
          prev.map((m) => (m.id === id ? { ...m, minQuantity: prevQty } : m))
        );
      }
      setActionError(err instanceof Error ? err.message : 'Gagal memperbarui minimum kuantitas.');
    }
  };

  const saveMaterial = async (data: Partial<RecyclerMaterial>) => {
    setIsSaving(true);
    setActionError(null);
    setSuccessMessage(null);

    try {
      if (editingMaterial) {
        const payload: Record<string, unknown> = {
          name: data.name,
          category: data.category,
          price: data.pricePerUnit,
          unit: data.unit,
          minQuantity: data.minQuantity,
          qualityRequirements: data.qualityRequirements,
        };

        const res = await apiClient<RecyclerMaterial>(`/recyclers/materials/${editingMaterial.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });

        setMaterials((prev) =>
          prev.map((m) =>
            m.id === editingMaterial.id
              ? {
                  ...m,
                  ...data,
                  name: res?.name || data.name || m.name,
                  category: res?.category || data.category || m.category,
                  pricePerUnit: res?.pricePerUnit ?? data.pricePerUnit ?? m.pricePerUnit,
                  unit: res?.unit ?? data.unit ?? m.unit,
                  minQuantity: res?.minQuantity ?? data.minQuantity ?? m.minQuantity,
                  qualityRequirements: res?.qualityRequirements ?? data.qualityRequirements ?? m.qualityRequirements,
                }
              : m
          )
        );
        setSuccessMessage(`Ketentuan material "${data.name || editingMaterial.name}" berhasil diperbarui.`);
      } else {
        let targetCategoryId = data.categoryId;
        if (!targetCategoryId && categories.length > 0) {
          const matched = categories.find((c) => c.name.toLowerCase() === (data.category || '').toLowerCase());
          targetCategoryId = matched?.id;
        }

        const payload = {
          categoryId: targetCategoryId,
          name: data.name,
          category: data.category,
          price: data.pricePerUnit || 1000,
          unit: data.unit || 'kg',
          minQuantity: data.minQuantity || 1,
          qualityRequirements: data.qualityRequirements || '',
          isAvailable: true,
        };

        const res = await apiClient<RecyclerMaterial>('/recyclers/materials', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (res && res.id) {
          setMaterials((prev) => {
            const exists = prev.some((m) => m.id === res.id);
            if (exists) {
              return prev.map((m) => (m.id === res.id ? res : m));
            }
            return [res, ...prev];
          });
        } else {
          const newMat: RecyclerMaterial = {
            id: `mat-${Date.now().toString().slice(-6)}`,
            name: data.name || 'Material Baru',
            category: data.category || 'Lainnya',
            pricePerUnit: data.pricePerUnit || 1000,
            unit: data.unit || 'kg',
            minQuantity: data.minQuantity || 1,
            qualityRequirements: data.qualityRequirements || '',
            isAccepting: true,
          };
          setMaterials((prev) => [newMat, ...prev]);
        }
        setSuccessMessage(`Material "${data.name || 'Baru'}" berhasil ditambahkan ke katalog gudang Anda.`);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('recycler-materials-changed'));
      }

      setIsModalOpen(false);
      setEditingMaterial(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Gagal menyimpan ketentuan material.');
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = (mat: RecyclerMaterial) => {
    setDeletingMaterial(mat);
    setActionError(null);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setDeletingMaterial(null);
  };

  const confirmDelete = async () => {
    if (!deletingMaterial) return;
    const target = deletingMaterial;
    const targetName = target.name || 'Material';

    setIsDeleting(true);
    setActionError(null);
    setSuccessMessage(null);

    const prevMaterials = [...materials];
    setMaterials((prev) => prev.filter((m) => m.id !== target.id));

    try {
      await apiClient(`/recyclers/materials/${target.id}`, {
        method: 'DELETE',
      });
      setSuccessMessage(`Material "${targetName}" berhasil dihapus dari ketentuan penerimaan gudang.`);
      setDeletingMaterial(null);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('recycler-materials-changed'));
      }
    } catch (err) {
      setMaterials(prevMaterials);
      setActionError(err instanceof Error ? err.message : 'Gagal menghapus material.');
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteMaterial = async (idOrMat: string | RecyclerMaterial) => {
    if (typeof idOrMat === 'string') {
      const target = materials.find((m) => m.id === idOrMat);
      if (target) requestDelete(target);
    } else {
      requestDelete(idOrMat);
    }
  };

  const openCreate = () => {
    setEditingMaterial(null);
    setIsModalOpen(true);
    setActionError(null);
  };

  const openEdit = (material: RecyclerMaterial) => {
    setEditingMaterial(material);
    setIsModalOpen(true);
    setActionError(null);
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = materials.filter((m) => m.isAccepting).length;

  return {
    materials: filteredMaterials,
    allMaterials: materials,
    categories,
    activeCount,
    totalCount: materials.length,
    isLoading,
    isSaving,
    searchQuery,
    setSearchQuery,
    actionError,
    setActionError,
    successMessage,
    setSuccessMessage,
    isModalOpen,
    setIsModalOpen,
    editingMaterial,
    deletingMaterial,
    isDeleting,
    openCreate,
    openEdit,
    saveMaterial,
    requestDelete,
    cancelDelete,
    confirmDelete,
    deleteMaterial,
    toggleAccepting,
    updatePrice,
    updateMinQuantity,
    refreshMaterials,
    refetch: refreshMaterials,
  };
}
