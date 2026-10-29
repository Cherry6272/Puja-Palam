-- ====================================================================
-- Samptrapthi Production Schema for PostgreSQL
-- Compatible with Neon (free tier), Supabase, Vercel Postgres, AWS RDS
-- ====================================================================

-- 1. Samagri Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sanskrit_name VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    original_price INTEGER,
    unit VARCHAR(50) NOT NULL,
    tagline TEXT,
    description TEXT,
    ritual_relevance TEXT,
    purity_grade VARCHAR(100),
    source_origin VARCHAR(100),
    shelf_life VARCHAR(100),
    storage TEXT,
    used_in_rituals JSONB DEFAULT '[]'::jsonb,
    image TEXT NOT NULL,
    box_sequence INTEGER NOT NULL DEFAULT 1,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    inventory_by_hub JSONB NOT NULL DEFAULT '{"blr": 500, "maa": 350, "hyd": 250}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Rituals Table
CREATE TABLE IF NOT EXISTS rituals (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sanskrit_name VARCHAR(255),
    deity VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tagline TEXT,
    hero_description TEXT,
    typical_duration VARCHAR(100),
    ideal_time VARCHAR(150),
    auspicious_tithi VARCHAR(150),
    image TEXT NOT NULL,
    accent_color VARCHAR(50),
    mantra_audio_snippet JSONB,
    prep_timeline JSONB DEFAULT '[]'::jsonb,
    tiers JSONB NOT NULL,
    traditions JSONB NOT NULL DEFAULT '[]'::jsonb,
    base_required_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Festivals Table
CREATE TABLE IF NOT EXISTS festivals (
    id VARCHAR(100) PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    sanskrit_name VARCHAR(255),
    upcoming_date VARCHAR(100) NOT NULL,
    season VARCHAR(100) NOT NULL,
    tagline TEXT,
    description TEXT,
    spiritual_significance TEXT,
    hero_image TEXT NOT NULL,
    cultural_tradition_notes JSONB NOT NULL DEFAULT '[]'::jsonb,
    essential_products JSONB NOT NULL DEFAULT '[]'::jsonb,
    featured_rituals JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Orders Table (Retains historical snapshots of products & kits)
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(100) PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    customer JSONB NOT NULL,
    kits JSONB NOT NULL DEFAULT '[]'::jsonb,
    products JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal INTEGER NOT NULL,
    savings INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL,
    assigned_hub VARCHAR(150) NOT NULL,
    box_sequence_status JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Indexes for frequent lookups
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_instock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_rituals_category ON rituals(category);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
