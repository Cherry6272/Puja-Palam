import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { SamagriProduct, Ritual, Festival, PlacedOrder } from '@/types';
import { SAMAGRI_PRODUCTS } from '@/data/products';
import { RITUALS_DATA } from '@/data/rituals';
import { FESTIVALS_DATA } from '@/data/festivals';

export interface DbStatus {
  isPostgres: boolean;
  isConfigured: boolean;
  connected: boolean;
  storageType: 'postgresql' | 'file';
  message: string;
}

// Persistent file path for local development
const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE_PATH = path.join(DATA_DIR, 'db.json');

interface FileDbStructure {
  products: SamagriProduct[];
  rituals: Ritual[];
  festivals: Festival[];
  orders: PlacedOrder[];
}

let pgPool: Pool | null = null;
let pgInitPromise: Promise<boolean> | null = null;

function getPgPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || !connectionString.trim()) {
    return null;
  }

  if (!pgPool) {
    pgPool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pgPool;
}

async function initPostgres(pool: Pool): Promise<boolean> {
  try {
    // 1. Create tables if not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(150) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS rituals (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(150) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS festivals (
        id VARCHAR(100) PRIMARY KEY,
        slug VARCHAR(150) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS orders (
        order_id VARCHAR(100) PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        data JSONB NOT NULL
      );
    `);

    // 2. Seed products if empty
    const { rows: prodRows } = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(prodRows[0].count, 10) === 0) {
      for (const p of SAMAGRI_PRODUCTS) {
        await pool.query(
          'INSERT INTO products (id, slug, name, data) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
          [p.id, p.slug, p.name, JSON.stringify(p)]
        );
      }
    }

    // 3. Seed rituals if empty
    const { rows: ritualRows } = await pool.query('SELECT COUNT(*) FROM rituals');
    if (parseInt(ritualRows[0].count, 10) === 0) {
      for (const r of RITUALS_DATA) {
        await pool.query(
          'INSERT INTO rituals (id, slug, name, data) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
          [r.id, r.slug, r.name, JSON.stringify(r)]
        );
      }
    }

    // 4. Seed festivals if empty
    const { rows: festRows } = await pool.query('SELECT COUNT(*) FROM festivals');
    if (parseInt(festRows[0].count, 10) === 0) {
      for (const f of FESTIVALS_DATA) {
        await pool.query(
          'INSERT INTO festivals (id, slug, name, data) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
          [f.id, f.slug, f.name, JSON.stringify(f)]
        );
      }
    }

    return true;
  } catch (err) {
    console.error('Failed to initialize PostgreSQL:', err);
    return false;
  }
}

async function ensurePostgresReady(): Promise<boolean> {
  const pool = getPgPool();
  if (!pool) return false;
  if (!pgInitPromise) {
    pgInitPromise = initPostgres(pool);
  }
  return pgInitPromise;
}

// Fallback server file database methods
function ensureFileDb(): FileDbStructure {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE_PATH)) {
      const initial: FileDbStructure = {
        products: SAMAGRI_PRODUCTS,
        rituals: RITUALS_DATA,
        festivals: FESTIVALS_DATA,
        orders: [],
      };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : SAMAGRI_PRODUCTS,
      rituals: Array.isArray(parsed.rituals) && parsed.rituals.length > 0 ? parsed.rituals : RITUALS_DATA,
      festivals: Array.isArray(parsed.festivals) && parsed.festivals.length > 0 ? parsed.festivals : FESTIVALS_DATA,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch {
    return {
      products: SAMAGRI_PRODUCTS,
      rituals: RITUALS_DATA,
      festivals: FESTIVALS_DATA,
      orders: [],
    };
  }
}

function writeFileDb(data: FileDbStructure): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write local database file:', e);
  }
}

export const serverRepository = {
  async getDbStatus(): Promise<DbStatus> {
    const pool = getPgPool();
    if (pool) {
      const ready = await ensurePostgresReady();
      if (ready) {
        return {
          isPostgres: true,
          isConfigured: true,
          connected: true,
          storageType: 'postgresql',
          message: 'PostgreSQL Database Connected (Production multi-client persistence active).',
        };
      }
      return {
        isPostgres: true,
        isConfigured: true,
        connected: false,
        storageType: 'postgresql',
        message: 'DATABASE_URL is configured but connection failed. Falling back to local file storage.',
      };
    }

    return {
      isPostgres: false,
      isConfigured: false,
      connected: true,
      storageType: 'file',
      message: 'Local server file persistence active (.data/db.json). For production multi-client persistence, configure DATABASE_URL in environment variables.',
    };
  },

  // PRODUCTS
  async getProducts(): Promise<SamagriProduct[]> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      const { rows } = await pool.query('SELECT data FROM products ORDER BY (data->>\'boxSequence\')::int ASC, name ASC');
      return rows.map((r) => r.data as SamagriProduct);
    }
    return ensureFileDb().products;
  },

  async getProductBySlug(slug: string): Promise<SamagriProduct | null> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      const { rows } = await pool.query('SELECT data FROM products WHERE slug = $1 OR id = $1 LIMIT 1', [slug]);
      return rows.length > 0 ? (rows[0].data as SamagriProduct) : null;
    }
    const db = ensureFileDb();
    return db.products.find((p) => p.slug === slug || p.id === slug) || null;
  },

  async saveProduct(product: SamagriProduct): Promise<void> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      await pool.query(
        `INSERT INTO products (id, slug, name, data, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (id) DO UPDATE SET slug = $2, name = $3, data = $4, updated_at = NOW()`,
        [product.id, product.slug, product.name, JSON.stringify(product)]
      );
      return;
    }
    const db = ensureFileDb();
    const idx = db.products.findIndex((p) => p.id === product.id);
    if (idx !== -1) {
      db.products[idx] = product;
    } else {
      db.products.unshift(product);
    }
    writeFileDb(db);
  },

  async deleteProduct(id: string): Promise<void> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      await pool.query('DELETE FROM products WHERE id = $1', [id]);
      return;
    }
    const db = ensureFileDb();
    db.products = db.products.filter((p) => p.id !== id);
    writeFileDb(db);
  },

  async updateProductStock(id: string, hub: 'blr' | 'maa' | 'hyd', delta: number): Promise<SamagriProduct | null> {
    const product = await this.getProductBySlug(id);
    if (!product) return null;

    product.inventoryByHub[hub] = Math.max(0, (product.inventoryByHub[hub] || 0) + delta);
    product.inStock = product.inventoryByHub.blr + product.inventoryByHub.maa + product.inventoryByHub.hyd > 0;
    await this.saveProduct(product);
    return product;
  },

  // RITUALS
  async getRituals(): Promise<Ritual[]> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      const { rows } = await pool.query('SELECT data FROM rituals ORDER BY name ASC');
      return rows.map((r) => r.data as Ritual);
    }
    return ensureFileDb().rituals;
  },

  async getRitualBySlug(slug: string): Promise<Ritual | null> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      const { rows } = await pool.query('SELECT data FROM rituals WHERE slug = $1 OR id = $1 LIMIT 1', [slug]);
      return rows.length > 0 ? (rows[0].data as Ritual) : null;
    }
    const db = ensureFileDb();
    return db.rituals.find((r) => r.slug === slug || r.id === slug) || null;
  },

  async saveRitual(ritual: Ritual): Promise<void> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      await pool.query(
        `INSERT INTO rituals (id, slug, name, data, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (id) DO UPDATE SET slug = $2, name = $3, data = $4, updated_at = NOW()`,
        [ritual.id, ritual.slug, ritual.name, JSON.stringify(ritual)]
      );
      return;
    }
    const db = ensureFileDb();
    const idx = db.rituals.findIndex((r) => r.id === ritual.id);
    if (idx !== -1) {
      db.rituals[idx] = ritual;
    } else {
      db.rituals.unshift(ritual);
    }
    writeFileDb(db);
  },

  // FESTIVALS
  async getFestivals(): Promise<Festival[]> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      const { rows } = await pool.query('SELECT data FROM festivals ORDER BY upcoming_date ASC');
      return rows.map((r) => r.data as Festival);
    }
    return ensureFileDb().festivals;
  },

  async getFestivalBySlug(slug: string): Promise<Festival | null> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      const { rows } = await pool.query('SELECT data FROM festivals WHERE slug = $1 OR id = $1 LIMIT 1', [slug]);
      return rows.length > 0 ? (rows[0].data as Festival) : null;
    }
    const db = ensureFileDb();
    return db.festivals.find((f) => f.slug === slug || f.id === slug) || null;
  },

  async saveFestival(festival: Festival): Promise<void> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      await pool.query(
        `INSERT INTO festivals (id, slug, name, data, updated_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (id) DO UPDATE SET slug = $2, name = $3, data = $4, updated_at = NOW()`,
        [festival.id, festival.slug, festival.name, JSON.stringify(festival)]
      );
      return;
    }
    const db = ensureFileDb();
    const idx = db.festivals.findIndex((f) => f.id === festival.id);
    if (idx !== -1) {
      db.festivals[idx] = festival;
    } else {
      db.festivals.unshift(festival);
    }
    writeFileDb(db);
  },

  // ORDERS
  async getOrders(): Promise<PlacedOrder[]> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      const { rows } = await pool.query('SELECT data FROM orders ORDER BY created_at DESC');
      return rows.map((r) => r.data as PlacedOrder);
    }
    return ensureFileDb().orders;
  },

  async getOrderById(orderId: string): Promise<PlacedOrder | null> {
    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      const { rows } = await pool.query('SELECT data FROM orders WHERE order_id = $1 LIMIT 1', [orderId]);
      return rows.length > 0 ? (rows[0].data as PlacedOrder) : null;
    }
    const db = ensureFileDb();
    return db.orders.find((o) => o.orderId === orderId) || null;
  },

  async createOrder(order: PlacedOrder): Promise<{ success: boolean; error?: string }> {
    if (!order || !order.orderId || !order.customer || !order.customer.name || !order.customer.phone) {
      return { success: false, error: 'Incomplete order payload' };
    }

    try {
      const pool = getPgPool();
      if (pool && (await ensurePostgresReady())) {
        await pool.query(
          `INSERT INTO orders (order_id, created_at, data)
           VALUES ($1, $2, $3)
           ON CONFLICT (order_id) DO NOTHING`,
          [order.orderId, order.createdAt, JSON.stringify(order)]
        );
      } else {
        const db = ensureFileDb();
        if (!db.orders.some((o) => o.orderId === order.orderId)) {
          db.orders.unshift(order);
          writeFileDb(db);
        }
      }

      // Automatically deduct product stock for standalone products in order
      if (Array.isArray(order.products)) {
        for (const item of order.products) {
          if (item?.product?.id && item.quantity > 0) {
            // Determine hub from city
            const city = (order.customer.city || '').toLowerCase();
            const hub: 'blr' | 'maa' | 'hyd' = city.includes('chennai')
              ? 'maa'
              : city.includes('hyderabad')
              ? 'hyd'
              : 'blr';
            await this.updateProductStock(item.product.id, hub, -item.quantity);
          }
        }
      }

      return { success: true };
    } catch (err: any) {
      console.error('Failed to create order:', err);
      return { success: false, error: err?.message || 'Database error persisting order' };
    }
  },

  async updateOrderBoxStatus(
    orderId: string,
    boxKey: 'box1' | 'box2' | 'box3' | 'box4',
    newStatus: string
  ): Promise<void> {
    const order = await this.getOrderById(orderId);
    if (!order) return;

    if (!order.boxSequenceStatus) {
      order.boxSequenceStatus = {
        box1: 'Scheduled for Assembly',
        box2: 'Scheduled for Assembly',
        box3: 'Fresh Flowers Available Where Supported',
        box4: 'Queued for Aarti Packing',
      };
    }
    order.boxSequenceStatus[boxKey] = newStatus;

    const pool = getPgPool();
    if (pool && (await ensurePostgresReady())) {
      await pool.query('UPDATE orders SET data = $1 WHERE order_id = $2', [JSON.stringify(order), orderId]);
      return;
    }
    const db = ensureFileDb();
    const idx = db.orders.findIndex((o) => o.orderId === orderId);
    if (idx !== -1) {
      db.orders[idx] = order;
      writeFileDb(db);
    }
  },

  // CUSTOMERS (derived from persisted real orders)
  async getCustomers(): Promise<Array<{
    name: string;
    phone: string;
    email: string;
    city: string;
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string;
  }>> {
    const orders = await this.getOrders();
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
      if (!o || !o.customer) return;
      const email = o.customer.email || '';
      const phone = o.customer.phone || '';
      const key = email.toLowerCase() || phone;
      if (!key) return;

      const existing = customerMap.get(key);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += o.total;
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
          totalSpent: o.total,
          lastOrderDate: o.createdAt,
        });
      }
    });

    return Array.from(customerMap.values());
  },

  // OPERATIONAL STATS
  async getOperationalStats() {
    const orders = await this.getOrders();
    const products = await this.getProducts();
    const rituals = await this.getRituals();
    const festivals = await this.getFestivals();

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

    const dbStatus = await this.getDbStatus();

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
      dbStatus,
    };
  },
};
