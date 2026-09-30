import { SamagriProduct, Ritual, Festival, PlacedOrder } from '@/types';
import { SAMAGRI_PRODUCTS } from '@/data/products';
import { RITUALS_DATA } from '@/data/rituals';
import { FESTIVALS_DATA } from '@/data/festivals';

// Helper for safe client-side localStorage access
const isClient = typeof window !== 'undefined';

const STORAGE_KEYS = {
  PRODUCTS: 'pk_products_data_v2',
  RITUALS: 'pk_rituals_data_v2',
  FESTIVALS: 'pk_festivals_data_v2',
  ORDERS: 'pk_orders_data_v2',
};

export const dataStore = {
  // PRODUCTS
  getProducts(): SamagriProduct[] {
    if (!isClient) return SAMAGRI_PRODUCTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) return JSON.parse(stored);
      // Initialize with default
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SAMAGRI_PRODUCTS));
      return SAMAGRI_PRODUCTS;
    } catch {
      return SAMAGRI_PRODUCTS;
    }
  },

  getProductBySlug(slug: string): SamagriProduct | undefined {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug || p.id === slug);
  },

  updateProduct(updated: SamagriProduct): void {
    if (!isClient) return;
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === updated.id);
    if (index !== -1) {
      products[index] = updated;
    } else {
      products.unshift(updated);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  addProduct(newProduct: SamagriProduct): void {
    if (!isClient) return;
    const products = this.getProducts();
    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  deleteProduct(productId: string): void {
    if (!isClient) return;
    const products = this.getProducts().filter((p) => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  updateProductStock(productId: string, hub: 'blr' | 'maa' | 'hyd', delta: number): void {
    if (!isClient) return;
    const products = this.getProducts();
    const item = products.find((p) => p.id === productId);
    if (item) {
      item.inventoryByHub[hub] = Math.max(0, (item.inventoryByHub[hub] || 0) + delta);
      item.inStock = item.inventoryByHub.blr + item.inventoryByHub.maa + item.inventoryByHub.hyd > 0;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  },

  // RITUALS
  getRituals(): Ritual[] {
    if (!isClient) return RITUALS_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RITUALS);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.RITUALS, JSON.stringify(RITUALS_DATA));
      return RITUALS_DATA;
    } catch {
      return RITUALS_DATA;
    }
  },

  getRitualBySlug(slug: string): Ritual | undefined {
    const rituals = this.getRituals();
    return rituals.find((r) => r.slug === slug || r.id === slug);
  },

  updateRitual(updated: Ritual): void {
    if (!isClient) return;
    const rituals = this.getRituals();
    const index = rituals.findIndex((r) => r.id === updated.id);
    if (index !== -1) {
      rituals[index] = updated;
    } else {
      rituals.unshift(updated);
    }
    localStorage.setItem(STORAGE_KEYS.RITUALS, JSON.stringify(rituals));
  },



  // FESTIVALS
  getFestivals(): Festival[] {
    if (!isClient) return FESTIVALS_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FESTIVALS);
      if (stored) return JSON.parse(stored);
      localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(FESTIVALS_DATA));
      return FESTIVALS_DATA;
    } catch {
      return FESTIVALS_DATA;
    }
  },

  getFestivalBySlug(slug: string): Festival | undefined {
    const festivals = this.getFestivals();
    return festivals.find((f) => f.slug === slug || f.id === slug);
  },

  updateFestival(updated: Festival): void {
    if (!isClient) return;
    const festivals = this.getFestivals();
    const index = festivals.findIndex((f) => f.id === updated.id);
    if (index !== -1) {
      festivals[index] = updated;
    } else {
      festivals.unshift(updated);
    }
    localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(festivals));
  },

  // ORDERS
  getOrders(): PlacedOrder[] {
    if (!isClient) return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) return JSON.parse(stored);
      // Check legacy single order key
      const legacyOrder = localStorage.getItem('pk_last_placed_order');
      if (legacyOrder) {
        const parsed = [JSON.parse(legacyOrder)];
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(parsed));
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  },

  getOrderById(orderId: string): PlacedOrder | undefined {
    const orders = this.getOrders();
    return orders.find((o) => o.orderId === orderId);
  },

  addOrder(order: PlacedOrder): void {
    if (!isClient) return;
    const orders = this.getOrders();
    // Prevent duplicate
    if (!orders.some((o) => o.orderId === order.orderId)) {
      orders.unshift(order);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem('pk_last_placed_order', JSON.stringify(order));
    }
  },

  updateOrderBoxStatus(
    orderId: string,
    boxKey: 'box1' | 'box2' | 'box3' | 'box4',
    newStatus: string
  ): void {
    if (!isClient) return;
    const orders = this.getOrders();
    const order = orders.find((o) => o.orderId === orderId);
    if (order && order.boxSequenceStatus) {
      order.boxSequenceStatus[boxKey] = newStatus;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  },

  // CUSTOMERS (Derived from real orders)
  getCustomers(): Array<{
    name: string;
    phone: string;
    email: string;
    city: string;
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string;
  }> {
    const orders = this.getOrders();
    const customerMap = new Map<string, {
      name: string;
      phone: string;
      email: string;
      city: string;
      orderCount: number;
      totalSpent: number;
      lastOrderDate: string;
    }>();

    orders.forEach((o) => {
      const key = o.customer.email.toLowerCase() || o.customer.phone;
      const existing = customerMap.get(key);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += o.total;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
        }
      } else {
        customerMap.set(key, {
          name: o.customer.name,
          phone: o.customer.phone,
          email: o.customer.email,
          city: o.customer.city,
          orderCount: 1,
          totalSpent: o.total,
          lastOrderDate: o.createdAt,
        });
      }
    });

    return Array.from(customerMap.values());
  },

  // OPERATIONAL STATS
  getOperationalStats() {
    const orders = this.getOrders();
    const products = this.getProducts();
    const rituals = this.getRituals();
    const festivals = this.getFestivals();

    // Calculate real revenue
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    // Calculate kits created in orders
    const kitsCount = orders.reduce((sum, o) => sum + (o.kits ? o.kits.length : 0), 0);

    // Calculate individual products sold
    const productsCount = orders.reduce(
      (sum, o) => sum + (o.products ? o.products.reduce((acc, p) => acc + p.quantity, 0) : 0),
      0
    );

    // Inventory alerts
    const lowStockProducts = products.filter((p) => {
      const totalUnits = p.inventoryByHub.blr + p.inventoryByHub.maa + p.inventoryByHub.hyd;
      return totalUnits > 0 && totalUnits < 400;
    });

    const outOfStockProducts = products.filter((p) => {
      const totalUnits = p.inventoryByHub.blr + p.inventoryByHub.maa + p.inventoryByHub.hyd;
      return totalUnits === 0 || !p.inStock;
    });

    return {
      totalOrders: orders.length,
      totalRevenue,
      kitsCreated: kitsCount,
      productsSold: productsCount,
      activeProductsCount: products.length,
      activeRitualsCount: rituals.length,
      activeFestivalsCount: festivals.length,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      outOfStockCount: outOfStockProducts.length,
      outOfStockProducts,
    };
  },
};
