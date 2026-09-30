'use client';
import { useState, useEffect } from 'react';
import { dataStore } from '@/lib/dataStore';
import { SAMAGRI_PRODUCTS } from '@/data/products';
import { RITUALS_DATA } from '@/data/rituals';
import { FESTIVALS_DATA } from '@/data/festivals';

export function useDataStore() {
  const [products, setProducts] = useState(SAMAGRI_PRODUCTS);
  const [rituals, setRituals] = useState(RITUALS_DATA);
  const [festivals, setFestivals] = useState(FESTIVALS_DATA);

  useEffect(() => {
    setProducts(dataStore.getProducts());
    setRituals(dataStore.getRituals());
    setFestivals(dataStore.getFestivals());
  }, []);

  return { products, rituals, festivals };
}
