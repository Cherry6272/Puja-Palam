# Puja Karyam Codebase Audit

## WHAT EXISTS

### 1. Routes & Pages
- **Customer Pages:** `/`, `/plan-your-puja`, `/rituals`, `/rituals/[slug]`, `/samagri`, `/samagri/[slug]`, `/puja-kits`, `/festivals`, `/festivals/[slug]`, `/build-your-kit`, `/cart`, `/checkout`, `/order-success`, `/about`, `/contact`, `/search` (component exists `IntentSearchBar` but maybe route doesn't, wait need to check `/search`), `/how-it-works`, `/catalog`, `/guide`, `/planner`.
- **Admin Pages:** `/admin`, `/admin/login`, `/admin/orders`, `/admin/products`, `/admin/rituals`, `/admin/kits`, `/admin/festivals`, `/admin/customers`, `/admin/settings`.

### 2. Data Models (in `src/data`)
- `products.ts`: Contains 8 samagri products.
- `rituals.ts`: Contains 4 rituals (Satyanarayana, Ganapati, Griha Pravesh, Varalakshmi).
- `festivals.ts`: Contains 10 festivals.

### 3. Components
- **Layout:** `Navbar`, `Footer`, `CartDrawer`
- **Store:** `ProductCard`, `RitualCard`, `IntentSearchBar`
- **3D:** `RitualTableCanvas` (WebGL interactive component)
- **AI:** `AskPujaKaryamModal`
- **Guide:** `RitualBoxPackagingView`

### 4. Admin Authentication
- Client-side mock authentication via `adminAuth` (password: `pujakaryam2026`).

---

## WHAT WORKS
- Basic layout and navigation framework is present.
- Data structures for rituals, products, and festivals are robust and well-typed.
- Regional context is partially implemented in the data layer (Karnataka, Tamil Nadu, etc.).
- 3D Ritual Table foundation.
- Basic mock AI modal.

---

## WHAT IS BROKEN / WEAK
- **Information Architecture:** The primary navigation in `Navbar.tsx` is bloated and missing the `Search` route. Secondary routes are mixed in.
- **Admin Auth:** Currently a client-side fake implementation. Needs a secure MVP architecture.
- **Data Completeness:** The requirement asks for 8-12 rituals (only 4 exist) and 15-30 products (only 8 exist).
- **Kits Data:** The kits are currently nested within `rituals.ts` as "tiers" instead of being a first-class entity linking regions and products directly.
- **Cart State & Checkout:** Needs verification if the global cart properly persists and handles "I Already Have This" deduplication seamlessly.
- **Regional Filtering:** The region selector in the header is present, but it's unclear if it fully drives the downstream data correctly yet.

---

## WHAT IS DUPLICATED / BLOATED
- Routes like `/catalog` (duplicate of `/samagri`), `/guide`, `/planner` (might overlap with `/plan-your-puja` or `/build-your-kit`).

---

## WHAT IS FAKE/PLACEHOLDER
- Hardcoded claims like "Next-Day Consecrated Delivery across Bengaluru, Chennai & Hyderabad" in the Navbar.
- "100% Shastra Compliant" and "Fresh Florals 5:30 AM JIT" on the homepage.
- Admin dashboard metrics are likely mock data.

---

## WHAT IS MISSING
- **First-Class Kits Data:** A dedicated data model for `kits.ts`.
- **Search Page:** The route `src/app/search/page.tsx` needs to be confirmed/built to handle the "Search the entire product graph" requirement.
- **Robust Admin CRUD:** Admin pages likely just display static views right now and need functional CRUD tied to the JSON data or a local state.
- **Complete Rituals & Products:** Need to add 4-8 more rituals and 7-22 more products to meet the MVP targets.
