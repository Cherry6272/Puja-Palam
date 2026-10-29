import { SamagriProduct, Ritual, Festival, PlacedOrder } from '@/types';
import { SAMAGRI_PRODUCTS } from '@/data/products';
import { RITUALS_DATA } from '@/data/rituals';
import { FESTIVALS_DATA } from '@/data/festivals';

export interface CustomerSummary {
  name: string;
  phone: string;
  email: string;
  city: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface OperationalStats {
  totalOrders: number;
  totalRevenue: number;
  kitsCreated: number;
  productsSold: number;
  activeProductsCount: number;
  activeRitualsCount: number;
  activeFestivalsCount: number;
  lowStockCount: number;
  lowStockProducts: SamagriProduct[];
  outOfStockCount: number;
  outOfStockProducts: SamagriProduct[];
  dbStatus?: any;
}

const isClient = typeof window !== 'undefined';

// In-memory cache
let cachedProducts: SamagriProduct[] = SAMAGRI_PRODUCTS;
let cachedRituals: Ritual[] = RITUALS_DATA;
let cachedFestivals: Festival[] = FESTIVALS_DATA;
let cachedOrders: PlacedOrder[] = [];
let cachedStats: OperationalStats | null = null;
let cachedDbStatus: any = null;

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in dataStore listener:', e);
    }
  });
}

export const dataStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  async fetchLatest(): Promise<{
    products: SamagriProduct[];
    rituals: Ritual[];
    festivals: Festival[];
    orders: PlacedOrder[];
    customers: CustomerSummary[];
    stats: OperationalStats;
    dbStatus: any;
  }> {
    if (!isClient) {
      return {
        products: cachedProducts,
        rituals: cachedRituals,
        festivals: cachedFestivals,
        orders: cachedOrders,
        customers: this.getCustomers(),
        stats: this.getOperationalStats(),
        dbStatus: cachedDbStatus,
      };
    }

    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Data fetch failed with status ${res.status}`);
      }
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Server reported failure loading data');
      }

      if (Array.isArray(data.products) && data.products.length > 0) {
        cachedProducts = data.products;
      }
      if (Array.isArray(data.rituals) && data.rituals.length > 0) {
        cachedRituals = data.rituals;
      }
      if (Array.isArray(data.festivals) && data.festivals.length > 0) {
        cachedFestivals = data.festivals;
      }
      if (Array.isArray(data.orders)) {
        cachedOrders = data.orders;
      }
      if (data.stats) {
        cachedStats = data.stats;
      }
      if (data.dbStatus) {
        cachedDbStatus = data.dbStatus;
      }

      notifyListeners();

      return {
        products: cachedProducts,
        rituals: cachedRituals,
        festivals: cachedFestivals,
        orders: cachedOrders,
        customers: this.getCustomers(),
        stats: this.getOperationalStats(),
        dbStatus: cachedDbStatus,
      };
    } catch (err) {
      console.warn('dataStore.fetchLatest network warning, using cached memory state:', err);
      return {
        products: cachedProducts,
        rituals: cachedRituals,
        festivals: cachedFestivals,
        orders: cachedOrders,
        customers: this.getCustomers(),
        stats: this.getOperationalStats(),
        dbStatus: cachedDbStatus,
      };
    }
  },

  // PRODUCTS
  getProducts(): SamagriProduct[] {
    return cachedProducts;
  },

  getProductBySlug(slug: string): SamagriProduct | undefined {
    return cachedProducts.find((p) => p.slug === slug || p.id === slug);
  },

  async updateProduct(updated: SamagriProduct): Promise<void> {
    const index = cachedProducts.findIndex((p) => p.id === updated.id);
    if (index !== -1) {
      cachedProducts[index] = updated;
    } else {
      cachedProducts.unshift(updated);
    }
    notifyListeners();

    if (isClient) {
      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.error('Failed to sync product update to server:', err);
      }
    }
  },

  async addProduct(newProduct: SamagriProduct): Promise<void> {
    cachedProducts.unshift(newProduct);
    notifyListeners();

    if (isClient) {
      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        });
      } catch (err) {
        console.error('Failed to sync new product to server:', err);
      }
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    cachedProducts = cachedProducts.filter((p) => p.id !== productId);
    notifyListeners();

    if (isClient) {
      try {
        await fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to sync delete product to server:', err);
      }
    }
  },

  async updateProductStock(productId: string, hub: 'blr' | 'maa' | 'hyd', delta: number): Promise<void> {
    const item = cachedProducts.find((p) => p.id === productId);
    if (item) {
      item.inventoryByHub[hub] = Math.max(0, (item.inventoryByHub[hub] || 0) + delta);
      item.inStock = item.inventoryByHub.blr + item.inventoryByHub.maa + item.inventoryByHub.hyd > 0;
      notifyListeners();
    }

    if (isClient) {
      try {
        await fetch('/api/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: productId, hub, delta }),
        });
      } catch (err) {
        console.error('Failed to sync stock update to server:', err);
      }
    }
  },

  // RITUALS
  getRituals(): Ritual[] {
    return cachedRituals;
  },

  getRitualBySlug(slug: string): Ritual | undefined {
    return cachedRituals.find((r) => r.slug === slug || r.id === slug);
  },

  async updateRitual(updated: Ritual): Promise<void> {
    const index = cachedRituals.findIndex((r) => r.id === updated.id);
    if (index !== -1) {
      cachedRituals[index] = updated;
    } else {
      cachedRituals.unshift(updated);
    }
    notifyListeners();

    if (isClient) {
      try {
        await fetch('/api/rituals', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.error('Failed to sync ritual update to server:', err);
      }
    }
  },

  // FESTIVALS
  getFestivals(): Festival[] {
    return cachedFestivals;
  },

  getFestivalBySlug(slug: string): Festival | undefined {
    return cachedFestivals.find((f) => f.slug === slug || f.id === slug);
  },

  async updateFestival(updated: Festival): Promise<void> {
    const index = cachedFestivals.findIndex((f) => f.id === updated.id);
    if (index !== -1) {
      cachedFestivals[index] = updated;
    } else {
      cachedFestivals.unshift(updated);
    }
    notifyListeners();

    if (isClient) {
      try {
        await fetch('/api/festivals', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.error('Failed to sync festival update to server:', err);
      }
    }
  },

  // ORDERS
  getOrders(): PlacedOrder[] {
    return cachedOrders;
  },

  getOrderById(orderId: string): PlacedOrder | undefined {
    return cachedOrders.find((o) => o.orderId === orderId);
  },

  async addOrder(order: PlacedOrder): Promise<{ success: boolean; error?: string }> {
    if (!order || !order.orderId) {
      return { success: false, error: 'Invalid order structure' };
    }

    if (!isClient) {
      cachedOrders.unshift(order);
      return { success: true };
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Order persistence failed with status ${res.status}`);
      }

      const resData = await res.json();
      if (!resData.success) {
        throw new Error(resData.error || 'Server rejected order persistence');
      }

      // Add to local cache
      if (!cachedOrders.some((o) => o.orderId === order.orderId)) {
        cachedOrders.unshift(order);
      }

      // Deduct inventory optimistically
      if (Array.isArray(order.products)) {
        for (const item of order.products) {
          if (item?.product?.id) {
            const city = (order.customer.city || '').toLowerCase();
            const hub: 'blr' | 'maa' | 'hyd' = city.includes('chennai')
              ? 'maa'
              : city.includes('hyderabad')
              ? 'hyd'
              : 'blr';
            const prod = cachedProducts.find((p) => p.id === item.product.id);
            if (prod) {
              prod.inventoryByHub[hub] = Math.max(0, (prod.inventoryByHub[hub] || 0) - item.quantity);
              prod.inStock = prod.inventoryByHub.blr + prod.inventoryByHub.maa + prod.inventoryByHub.hyd > 0;
            }
          }
        }
      }

      notifyListeners();
      return { success: true };
    } catch (err: any) {
      console.error('Failed to persist order to server:', err);
      return { success: false, error: err?.message || 'Server database write failed' };
    }
  },

  async updateOrderBoxStatus(
    orderId: string,
    boxKey: 'box1' | 'box2' | 'box3' | 'box4',
    newStatus: string
  ): Promise<void> {
    const order = cachedOrders.find((o) => o.orderId === orderId);
    if (order && order.boxSequenceStatus) {
      order.boxSequenceStatus[boxKey] = newStatus;
      notifyListeners();
    }

    if (isClient) {
      try {
        await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, boxKey, newStatus }),
        });
      } catch (err) {
        console.error('Failed to sync order box status to server:', err);
      }
    }
  },

  // CUSTOMERS
  getCustomers(): CustomerSummary[] {
    const customerMap = new Map<string, CustomerSummary>();

    cachedOrders.forEach((o) => {
      if (!o || !o.customer) return;
      const email = o.customer.email || '';
      const phone = o.customer.phone || '';
      const key = email.toLowerCase() || phone;
      if (!key) return;

      const existing = customerMap.get(key);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += o.total || 0;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
        }
      } else {
        customerMap.set(key, {
          name: o.customer.name || 'Customer',
          phone,
          email,
          city: o.customer.city || 'Unknown',
          orderCount: 1,
          totalSpent: o.total || 0,
          lastOrderDate: o.createdAt,
        });
      }
    });

    return Array.from(customerMap.values());
  },

  // OPERATIONAL STATS
  getOperationalStats(): OperationalStats {
    const orders = cachedOrders;
    const products = cachedProducts;
    const rituals = cachedRituals;
    const festivals = cachedFestivals;

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const kitsCount = orders.reduce((sum, o) => sum + (o.kits ? o.kits.length : 0), 0);
    const productsCount = orders.reduce(
      (sum, o) => sum + (o.products ? o.products.reduce((acc, p) => acc + (p.quantity || 1), 0) : 0),
      0
    );

    const lowStockProducts = products.filter((p) => {
      const totalUnits = (p.inventoryByHub?.blr || 0) + (p.inventoryByHub?.maa || 0) + (p.inventoryByHub?.hyd || 0);
      return totalUnits > 0 && totalUnits < 400;
    });

    const outOfStockProducts = products.filter((p) => {
      const totalUnits = (p.inventoryByHub?.blr || 0) + (p.inventoryByHub?.maa || 0) + (p.inventoryByHub?.hyd || 0);
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
      dbStatus: cachedDbStatus,
    };
  },
};
