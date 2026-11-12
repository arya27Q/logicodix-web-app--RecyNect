'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import type { ManagementType } from '@/types';

export interface AdminPriceAuditRecord {
  id: string;
  recyclerId: string;
  recyclerName: string;
  recyclerType: ManagementType;
  recyclerIsActive: boolean;
  isDemo: boolean;
  contact: string;
  ownerEmail: string | null;
  categoryId: string;
  categoryName: string;
  unit: string;
  currentPrice: number;
  marketAverage: number;
  deviationPercent: number;
  daysSinceUpdate: number;
  isStale: boolean;
  isAnomaly: boolean;
  auditStatus: 'stale_and_anomaly' | 'anomaly' | 'stale' | 'normal';
  lastUpdated: string;
  priceUpdatedAt: string;
}

export interface AdminPriceAuditSummary {
  totalMaterials: number;
  compliantCount: number;
  complianceRate: number;
  anomalyCount: number;
  staleCount: number;
  flaggedCount: number;
  averageAbsoluteDeviationPercent: number;
  staleDaysThreshold: number;
  deviationThresholdPercent: number;
}

export interface AdminPriceHistoryRecord {
  id: string;
  categoryName: string;
  recyclerName: string;
  recyclerType: ManagementType;
  unit: string;
  oldPrice: number;
  newPrice: number;
  changedAt: string;
}

interface PriceAuditResponse {
  items: AdminPriceAuditRecord[];
  summary: AdminPriceAuditSummary;
  priceHistories: AdminPriceHistoryRecord[];
}

const EMPTY_SUMMARY: AdminPriceAuditSummary = {
  totalMaterials: 0,
  compliantCount: 0,
  complianceRate: 100,
  anomalyCount: 0,
  staleCount: 0,
  flaggedCount: 0,
  averageAbsoluteDeviationPercent: 0,
  staleDaysThreshold: 30,
  deviationThresholdPercent: 20,
};

export function useAdminPriceAudit(staleDays = 30, deviationThreshold = 20) {
  const [items, setItems] = useState<AdminPriceAuditRecord[]>([]);
  const [summary, setSummary] = useState<AdminPriceAuditSummary>(EMPTY_SUMMARY);
  const [priceHistories, setPriceHistories] = useState<AdminPriceHistoryRecord[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'flagged' | 'anomaly' | 'stale'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudit = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await apiClient<PriceAuditResponse>(
        `/admin/price-audit?staleDays=${staleDays}&deviationThreshold=${deviationThreshold}`,
      );
      setItems(Array.isArray(data?.items) ? data.items : []);
      setSummary(data?.summary || EMPTY_SUMMARY);
      setPriceHistories(Array.isArray(data?.priceHistories) ? data.priceHistories : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat laporan audit harga.');
    } finally {
      setIsLoading(false);
    }
  }, [staleDays, deviationThreshold]);

  useEffect(() => {
    let isMounted = true;
    apiClient<PriceAuditResponse>(
      `/admin/price-audit?staleDays=${staleDays}&deviationThreshold=${deviationThreshold}`,
    )
      .then((data) => {
        if (!isMounted) return;
        setItems(Array.isArray(data?.items) ? data.items : []);
        setSummary(data?.summary || EMPTY_SUMMARY);
        setPriceHistories(Array.isArray(data?.priceHistories) ? data.priceHistories : []);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat laporan audit harga.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [staleDays, deviationThreshold]);

  const filteredItems = items.filter((item) => {
    if (filterMode === 'flagged' && !item.isAnomaly && !item.isStale) return false;
    if (filterMode === 'anomaly' && !item.isAnomaly) return false;
    if (filterMode === 'stale' && !item.isStale) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.categoryName.toLowerCase().includes(q) ||
        item.recyclerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return {
    items: filteredItems,
    allItems: items,
    summary,
    priceHistories,
    filterMode,
    setFilterMode,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    refresh: fetchAudit,
  };
}
