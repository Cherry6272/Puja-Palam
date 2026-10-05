'use client';
import { useState, useEffect } from 'react';
import { dataStore } from '@/lib/dataStore';
import { SAMAGRI_PRODUCTS } from '@/data/products';
import { RITUALS_DATA } from '@/data/rituals';
import { FESTIVALS_DATA } from '@/data/festivals';

export function useDataStore() {
  const [products, setProducts] = useState<typeof SAMAGRI_PRODUCTS>([]);
  const [rituals, setRituals] = useState<typeof RITUALS_DATA>([]);
  const [festivals, setFestivals] = useState<typeof FESTIVALS_DATA>([]);
  const [orders, setOrders] = useState<ReturnType<typeof dataStore.getOrders>>([]);
  const [customers, setCustomers] = useState<ReturnType<typeof dataStore.getCustomers>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setProducts(dataStore.getProducts());
      setRituals(dataStore.getRituals());
      setFestivals(dataStore.getFestivals());
      setOrders(dataStore.getOrders());
      setCustomers(dataStore.getCustomers());
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { products, rituals, festivals, orders, customers, isLoading };
}
