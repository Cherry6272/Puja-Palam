'use client';

import { useState, useEffect, useCallback } from 'react';
import { dataStore, CustomerSummary, OperationalStats } from '@/lib/dataStore';
import { SamagriProduct, Ritual, Festival, PlacedOrder } from '@/types';

export function useDataStore() {
  const [products, setProducts] = useState<SamagriProduct[]>(() => dataStore.getProducts());
  const [rituals, setRituals] = useState<Ritual[]>(() => dataStore.getRituals());
  const [festivals, setFestivals] = useState<Festival[]>(() => dataStore.getFestivals());
  const [orders, setOrders] = useState<PlacedOrder[]>(() => dataStore.getOrders());
  const [customers, setCustomers] = useState<CustomerSummary[]>(() => dataStore.getCustomers());
  const [stats, setStats] = useState<OperationalStats>(() => dataStore.getOperationalStats());
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(() => dataStore.getProducts().length === 0);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    // Only set loading if data is not already populated
    if (dataStore.getProducts().length === 0) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const res = await dataStore.fetchLatest();
      setProducts(res.products);
      setRituals(res.rituals);
      setFestivals(res.festivals);
      setOrders(res.orders);
      setCustomers(res.customers);
      setStats(res.stats);
      setDbStatus(res.dbStatus);
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to data service.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Subscribe to synchronous store changes (optimistic updates, local mutations)
    const unsubscribe = dataStore.subscribe(() => {
      setProducts([...dataStore.getProducts()]);
      setRituals([...dataStore.getRituals()]);
      setFestivals([...dataStore.getFestivals()]);
      setOrders([...dataStore.getOrders()]);
      setCustomers([...dataStore.getCustomers()]);
      setStats({ ...dataStore.getOperationalStats() });
    });

    return unsubscribe;
  }, [loadData]);

  return {
    products,
    rituals,
    festivals,
    orders,
    customers,
    stats,
    dbStatus,
    isLoading,
    error,
    refetch: loadData,
  };
}
