'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MatchingItemInput, MatchingPriority, WasteCategory } from '@/types';
import { apiClient } from '@/lib/api-client';
import { useGeolocation } from '@/hooks/shared/useGeolocation';

// Fallback master categories jika backend belum dijalankan
export const FALLBACK_CATEGORIES: WasteCategory[] = [
  { id: 'cat-kardus', name: 'Kardus / Karton Cokelat', unit: 'kg', isActive: true },
  { id: 'cat-pet', name: 'Botol Plastik PET Bening', unit: 'kg', isActive: true },
  { id: 'cat-minyak', name: 'Minyak Jelantah', unit: 'liter', isActive: true },
  { id: 'cat-alum', name: 'Kaleng Aluminium / Soft Drink', unit: 'kg', isActive: true },
  { id: 'cat-hvs', name: 'Kertas HVS / Buku Dokumen', unit: 'kg', isActive: true },
  { id: 'cat-besi', name: 'Besi Tua / Logam Campur', unit: 'kg', isActive: true },
];

export function useMatchingForm() {
  const router = useRouter();

  // State Categories & Items
  const [categories, setCategories] = useState<WasteCategory[]>(FALLBACK_CATEGORIES);
  const [items, setItems] = useState<MatchingItemInput[]>([
    { categoryId: 'cat-kardus', quantity: 10, unit: 'kg', condition: 'Kering dan diikat' },
    { categoryId: 'cat-pet', quantity: 5, unit: 'kg', condition: 'Bersih tanpa tutup botol' },
  ]);

  // Geolocation Composable
  const geo = useGeolocation(
    -6.914744,
    107.60981,
    'Pusat Kota Bandung (Default Simulasi)'
  );

  // Matching options
  const [priority, setPriority] = useState<MatchingPriority>('balanced');
  const [radiusKm, setRadiusKm] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load real categories from backend on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await apiClient<WasteCategory[]>('/waste');
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        // Fallback default categories tetap digunakan
      }
    }
    loadCategories();
  }, []);

  // Quick Add Material Tag
  const handleQuickAdd = (catId: string) => {
    if (items.length >= 5) {
      alert('Maksimal 5 jenis sampah dalam 1 sesi pencocokan.');
      return;
    }
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;

    const existing = items.find((i) => i.categoryId === catId);
    if (existing) {
      alert(`Material "${cat.name}" sudah ada dalam daftar input Anda.`);
      return;
    }

    setItems([...items, { categoryId: cat.id, quantity: 5, unit: cat.unit, condition: '' }]);
  };

  // Row Item Change
  const handleItemChange = (index: number, updated: MatchingItemInput) => {
    const newItems = [...items];
    newItems[index] = updated;
    setItems(newItems);
  };

  // Remove Item
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      alert('Minimal masukkan 1 jenis sampah untuk dicocokkan.');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  // Add Empty Item
  const handleAddItem = () => {
    if (items.length >= 5) {
      alert('Maksimal 5 jenis sampah dalam 1 sesi pencocokan.');
      return;
    }
    setItems([...items, { categoryId: '', quantity: 1, unit: 'kg', condition: '' }]);
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const invalidItem = items.find((i) => !i.categoryId || i.quantity <= 0);
    if (invalidItem) {
      alert('Mohon pilih jenis sampah dan masukkan kuantitas yang valid (lebih dari 0).');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await apiClient<{ sessionId: string }>('/matching', {
        method: 'POST',
        body: JSON.stringify({
          latitude: geo.latitude,
          longitude: geo.longitude,
          priority,
          searchRadiusKm: radiusKm,
          items,
        }),
      });

      router.push(`/match/results/${result.sessionId}`);
    } catch (err) {
      const demoSessionId = 'demo-session-' + Date.now().toString().slice(-6);
      router.push(`/match/results/${demoSessionId}?priority=${priority}&radius=${radiusKm}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculations
  const totalWeight = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const formattedWeight = totalWeight % 1 === 0 ? totalWeight.toString() : totalWeight.toFixed(1);
  const distinctUnits = Array.from(new Set(items.map((i) => i.unit || 'kg')));
  const unitLabel = distinctUnits.length === 1 ? distinctUnits[0] : 'kg/L';

  return {
    categories,
    items,
    priority,
    setPriority,
    radiusKm,
    setRadiusKm,
    isSubmitting,
    geo,
    totalWeight,
    formattedWeight,
    unitLabel,
    handleQuickAdd,
    handleItemChange,
    handleRemoveItem,
    handleAddItem,
    handleSubmit,
  };
}

