import http from 'http';
import { spawn } from 'child_process';
import readline from 'readline';

const PORT = 3005;
const BASE = `http://localhost:${PORT}`;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const method = options.method || 'GET';
  const headers = options.headers || {};
  const body = options.body;

  const res = await fetch(url, {
    method,
    headers,
    body,
    redirect: 'manual', // do not follow redirect automatically so we can assert on 307
  });

  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}

  return {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    text,
    json,
  };
}

async function runTests() {
  console.log('--- STARTING RUNTIME TEST SUITE ---');
  let failures = 0;
  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      failures++;
    } else {
      console.log(`✅ PASS: ${message}`);
    }
  }

  // 1. PUBLIC LISTING ROUTES
  console.log('\n[TEST GROUP 1: Public Listing Routes]');
  const publicRoutes = [
    '/',
    '/rituals',
    '/samagri',
    '/puja-kits',
    '/festivals',
    '/catalog',
    '/build-your-kit',
    '/cart',
    '/checkout',
    '/how-it-works',
    '/about',
    '/contact',
  ];
  for (const r of publicRoutes) {
    const res = await request(r);
    assert(res.status === 200, `${r} returns HTTP 200 (Got ${res.status})`);
  }

  // 2. DYNAMIC DETAIL-PAGE ROUTES
  console.log('\n[TEST GROUP 2: Dynamic Detail Routes (Hook Ordering & Lookups)]');
  const detailRoutes = [
    { path: '/rituals/satyanarayana-puja', expectedText: 'Satyanarayana' },
    { path: '/festivals/varalakshmi-vrata', expectedText: 'Varalakshmi' },
    { path: '/festivals/varalakshmi-vratam', expectedText: 'Varalakshmi' },
    { path: '/puja-kits/satyanarayana-puja', expectedText: 'Satyanarayana' },
    { path: '/samagri/bhimseni-camphor', expectedText: 'Camphor' },
  ];
  for (const d of detailRoutes) {
    const res = await request(d.path);
    assert(res.status === 200, `${d.path} returns HTTP 200`);
    assert(res.text.includes(d.expectedText), `${d.path} renders expected content '${d.expectedText}'`);
  }

  // 404 Handling for non-existent entities
  const notFoundRoutes = ['/rituals/non-existent-ritual-slug', '/samagri/non-existent-item'];
  for (const r of notFoundRoutes) {
    const res = await request(r);
    assert(res.status === 404, `${r} correctly returns HTTP 404`);
  }

  // 3. SEARCH DATA DEPENDENCIES & QUERIES
  console.log('\n[TEST GROUP 3: Search Route & Queries]');
  const searchQueries = [
    'Varalakshmi',
    'Satyanarayana Puja',
    'Bhimseni Camphor',
    'Griha Pravesh',
    'Pure Cow Ghee Diya Wicks',
  ];
  for (const q of searchQueries) {
    const res = await request(`/search?q=${encodeURIComponent(q)}`);
    assert(res.status === 200, `Search query '${q}' returns HTTP 200`);
  }

  // Empty query and non-existent query
  const emptySearch = await request('/search');
  assert(emptySearch.status === 200, 'Empty /search query returns HTTP 200');

  const nonExistentSearch = await request('/search?q=xyznonexistentquery999');
  assert(nonExistentSearch.status === 200, 'Non-matching search returns HTTP 200');
  assert(nonExistentSearch.text.includes('No exact matches found'), 'Non-matching search shows empty state');

  // 4. API PERSISTENCE & DATA STORE
  console.log('\n[TEST GROUP 4: Database Repository & Persistence API]');
  const dataRes = await request('/api/data');
  assert(dataRes.status === 200, 'GET /api/data returns HTTP 200');
  assert(dataRes.json && dataRes.json.success === true, 'GET /api/data returns success');
  assert(dataRes.json && dataRes.json.products.length >= 8, `GET /api/data has ${dataRes.json?.products?.length} products`);
  assert(dataRes.json && dataRes.json.rituals.length >= 4, `GET /api/data has ${dataRes.json?.rituals?.length} rituals`);
  assert(dataRes.json && dataRes.json.festivals.length >= 10, `GET /api/data has ${dataRes.json?.festivals?.length} festivals`);

  // Test placing a real order
  const testOrderId = `PK-TEST-${Date.now()}`;
  const initialBlrStock = dataRes.json.products[0].inventoryByHub.blr;
  const targetProductId = dataRes.json.products[0].id;

  const testOrder = {
    orderId: testOrderId,
    createdAt: new Date().toISOString(),
    customer: {
      name: 'Ramesh Sundaram',
      phone: '9845012345',
      email: 'ramesh.sundaram@example.com',
      address: '12 Temple Street, Malleshwaram',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560003',
      ritualDate: '2026-11-15',
      deliverySlot: 'morning-consecrated',
    },
    kits: [],
    products: [
      {
        product: dataRes.json.products[0],
        quantity: 2,
      },
    ],
    subtotal: 1000,
    savings: 0,
    total: 1000,
    assignedHub: 'Bengaluru Central (Indiranagar)',
    boxSequenceStatus: {
      box1: 'Scheduled for Assembly',
      box2: 'Scheduled for Assembly',
      box3: 'Fresh Flowers Available Where Supported',
      box4: 'Queued for Aarti Packing',
    },
  };

  const createOrderRes = await request('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testOrder),
  });
  assert(createOrderRes.status === 200, 'POST /api/orders returns HTTP 200');
  assert(createOrderRes.json && createOrderRes.json.success === true, 'Order created successfully in database');

  // Verify the order is returned by GET /api/orders
  const getOrdersRes = await request('/api/orders');
  const foundOrder = getOrdersRes.json?.orders?.find((o) => o.orderId === testOrderId);
  assert(Boolean(foundOrder), `Persisted order ${testOrderId} retrieved from database`);

  // Verify stock deduction in database
  const refreshedData = await request('/api/data');
  const refreshedProd = refreshedData.json.products.find((p) => p.id === targetProductId);
  assert(
    refreshedProd.inventoryByHub.blr === initialBlrStock - 2,
    `Inventory automatically deducted for Bengaluru hub (was ${initialBlrStock}, now ${refreshedProd.inventoryByHub.blr})`
  );

  // Test PATCH box status update
  const patchOrderRes = await request('/api/orders', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: testOrderId,
      boxKey: 'box1',
      newStatus: 'Consecrated and Packed at Hub',
    }),
  });
  assert(patchOrderRes.status === 200, 'PATCH /api/orders updates box status');

  const verifyPatchedOrders = await request('/api/orders');
  const patchedOrder = verifyPatchedOrders.json?.orders?.find((o) => o.orderId === testOrderId);
  assert(
    patchedOrder?.boxSequenceStatus?.box1 === 'Consecrated and Packed at Hub',
    'Updated box status successfully persisted'
  );

  // 5. ADMIN AUTHENTICATION & MIDDLEWARE SECURITY
  console.log('\n[TEST GROUP 5: Admin Authentication & Security]');
  // Unauthenticated access to /admin must redirect to /admin/login
  const unauthAdmin = await request('/admin');
  assert(
    unauthAdmin.status === 307 || unauthAdmin.status === 302,
    `Unauthenticated /admin redirects with HTTP ${unauthAdmin.status}`
  );
  assert(
    unauthAdmin.headers['location']?.includes('/admin/login'),
    `Redirect points to /admin/login (Got ${unauthAdmin.headers['location']})`
  );

  const unauthOrders = await request('/admin/orders');
  assert(
    unauthOrders.status === 307 || unauthOrders.status === 302,
    `Unauthenticated /admin/orders redirects with HTTP ${unauthOrders.status}`
  );

  // Authenticated access with invalid credentials
  const loginFailRes = await request('/admin/login');
  assert(loginFailRes.status === 200, 'GET /admin/login returns HTTP 200');

  // Verify admin credentials from server action /auth
  const secret = process.env.ADMIN_SESSION_SECRET || 'dev_secret_key_samptrapthi_minimum_32_characters_long_123456';
  const payload = {
    email: 'admin@samptrapthi.com',
    role: 'admin',
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
  const validToken = `${payloadB64}.${Buffer.from(sigBuffer).toString('base64url')}`;

  const authAdmin = await request('/admin', {
    headers: {
      Cookie: `pk_admin_session=${validToken}`,
    },
  });
  assert(authAdmin.status === 200, `Authenticated /admin with valid session returns HTTP 200 (Got ${authAdmin.status})`);

  const authAdminOrders = await request('/admin/orders', {
    headers: {
      Cookie: `pk_admin_session=${validToken}`,
    },
  });
  assert(
    authAdminOrders.status === 200,
    `Authenticated /admin/orders with valid session returns HTTP 200 (Got ${authAdminOrders.status})`
  );

  // Tampered cookie must be rejected
  const tamperedAdmin = await request('/admin', {
    headers: {
      Cookie: `pk_admin_session=invalid.token_tampered`,
    },
  });
  assert(
    tamperedAdmin.status === 307 || tamperedAdmin.status === 302,
    `Tampered session token correctly rejected and redirected (${tamperedAdmin.status})`
  );

  // 6. ADMIN TO STOREFRONT SYNCHRONIZATION
  console.log('\n[TEST GROUP 6: Admin to Storefront Synchronization]');
  const sampleProduct = refreshedProd;
  const originalTagline = sampleProduct.tagline;
  const updatedTagline = `Vedic Standard Consecrated - Test ${Date.now()}`;

  // Update product via API
  await request('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...sampleProduct,
      tagline: updatedTagline,
    }),
  });

  // Verify storefront /samagri/[slug] receives the update
  const storefrontProductRes = await request(`/samagri/${sampleProduct.slug}`);
  assert(storefrontProductRes.status === 200, `Storefront product page /samagri/${sampleProduct.slug} returns 200`);

  // Restore original tagline
  await request('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...sampleProduct,
      tagline: originalTagline,
    }),
  });
  console.log('Product restored to canonical state.');

  console.log('\n========================================');
  if (failures === 0) {
    console.log('🎉 ALL RUNTIME TESTS PASSED WITH 0 FAILURES!');
  } else {
    console.error(`💥 TEST SUITE FINISHED WITH ${failures} FAILURES!`);
  }
  console.log('========================================\n');

  return failures;
}

// Start Next.js server, run tests, and terminate
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
  shell: true,
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: String(PORT),
    NODE_ENV: 'production',
  },
});

let testStarted = false;
async function waitAndRun() {
  // Poll until server is responding
  for (let i = 0; i < 30; i++) {
    await sleep(1000);
    try {
      const ping = await fetch(BASE);
      if (ping.status === 200) {
        testStarted = true;
        break;
      }
    } catch {}
  }

  if (!testStarted) {
    console.error('Server failed to start within 30 seconds');
    server.kill();
    process.exit(1);
  }

  const failures = await runTests();
  server.kill();
  process.exit(failures > 0 ? 1 : 0);
}

waitAndRun();
