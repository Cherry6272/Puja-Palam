'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartCustomizedKit, SamagriProduct } from '@/types';

export interface CartProductItem {
  product: SamagriProduct;
  quantity: number;
}

interface CartContextType {
  cartKits: CartCustomizedKit[];
  cartProducts: CartProductItem[];
  addCustomizedKit: (kit: CartCustomizedKit) => void;
  removeKit: (id: string) => void;
  addProduct: (product: SamagriProduct, qty?: number) => void;
  removeProduct: (productId: string) => void;
  updateProductQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  totalAmount: number;
  totalItemsCount: number;
  totalSavings: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartKits, setCartKits] = useState<CartCustomizedKit[]>([]);
  const [cartProducts, setCartProducts] = useState<CartProductItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('karnataka-smartha');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  // Load initial cart from local storage if available
  useEffect(() => {
    try {
      const savedKits = localStorage.getItem('pk_cart_kits');
      const savedProducts = localStorage.getItem('pk_cart_products');
      if (savedKits) setCartKits(JSON.parse(savedKits));
      if (savedProducts) setCartProducts(JSON.parse(savedProducts));
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('pk_cart_kits', JSON.stringify(cartKits));
      localStorage.setItem('pk_cart_products', JSON.stringify(cartProducts));
    } catch (e) {
      console.warn('Could not persist cart', e);
    }
  }, [cartKits, cartProducts]);

  const addCustomizedKit = (kit: CartCustomizedKit) => {
    setCartKits((prev) => [kit, ...prev]);
    setIsCartOpen(true);
  };

  const removeKit = (id: string) => {
    setCartKits((prev) => prev.filter((k) => k.id !== id));
  };

  const addProduct = (product: SamagriProduct, qty = 1) => {
    setCartProducts((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeProduct = (productId: string) => {
    setCartProducts((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateProductQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    setCartProducts((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartKits([]);
    setCartProducts([]);
  };

  const totalKitsPrice = cartKits.reduce((sum, kit) => sum + kit.finalPrice, 0);
  const totalProductsPrice = cartProducts.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalAmount = totalKitsPrice + totalProductsPrice;

  const totalKitsSavings = cartKits.reduce((sum, kit) => sum + kit.savedAmount, 0);
  const totalProductSavings = cartProducts.reduce((sum, item) => {
    if (item.product.originalPrice) {
      return sum + (item.product.originalPrice - item.product.price) * item.quantity;
    }
    return sum;
  }, 0);
  const totalSavings = totalKitsSavings + totalProductSavings;

  const totalKitsItemsCount = cartKits.reduce((sum, kit) => sum + kit.procuredItemsCount, 0);
  const totalProductsCount = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
  const totalItemsCount = totalKitsItemsCount + totalProductsCount;

  return (
    <CartContext.Provider
      value={{
        cartKits,
        cartProducts,
        addCustomizedKit,
        removeKit,
        addProduct,
        removeProduct,
        updateProductQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        selectedRegion,
        setSelectedRegion,
        selectedLanguage,
        setSelectedLanguage,
        totalAmount,
        totalItemsCount,
        totalSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
