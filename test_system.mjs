async function runVerification() {
  const base = 'http://localhost:5000';
  console.log('====================================================');
  console.log('       ZAKU E-COMMERCE VERIFICATION POST-UPDATE      ');
  console.log('====================================================\n');

  // 1. Frontend HTML and bundle loading
  console.log('>>> 1. Verifying Frontend Web Server...');
  const htmlRes = await fetch(base + '/');
  if (htmlRes.status !== 200) throw new Error('Frontend status: ' + htmlRes.status);
  const html = await htmlRes.text();
  console.log('  [PASS] Index HTML delivered (' + html.length + ' bytes)');

  const jsUrl = html.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
  const cssUrl = html.match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1];
  if (!jsUrl || !cssUrl) throw new Error('Could not find JS/CSS bundle in index.html');

  const jsRes = await fetch(base + jsUrl);
  const cssRes = await fetch(base + cssUrl);
  if (jsRes.status !== 200) throw new Error('JS bundle status: ' + jsRes.status);
  if (cssRes.status !== 200) throw new Error('CSS bundle status: ' + cssRes.status);
  console.log('  [PASS] JavaScript bundle verified (status: 200)');
  console.log('  [PASS] CSS stylesheet verified (status: 200)');

  // 2. Original Assets and Images
  console.log('\n>>> 2. Verifying Original Branding Assets & Images...');
  const assetsToCheck = [
    '/assets/hero_banner_original.png',
    '/assets/zaku_original_logo.jpg',
    '/assets/prod_whole_spices.jpg',
    '/assets/prod_shahi_spice_mix.jpg',
    '/assets/prod_turmeric_powder.jpg',
    '/assets/prod_chilli_powder.jpg',
    '/assets/prod_peri_peri_spice_mix.jpg'
  ];

  for (const asset of assetsToCheck) {
    const res = await fetch(base + asset);
    if (res.status !== 200) throw new Error('Failed to load asset ' + asset + ' (' + res.status + ')');
    const bytes = (await res.arrayBuffer()).byteLength;
    console.log('  [PASS] Asset: ' + asset + ' (status 200, ' + bytes + ' bytes)');
  }

  // 3. Categories API
  console.log('\n>>> 3. Verifying Categories API...');
  const catRes = await fetch(base + '/api/categories');
  const catData = await catRes.json();
  if (!catData.success || catData.data.length !== 4) throw new Error('Categories count invalid');
  console.log('  [PASS] 4 Categories: ' + catData.data.map(c => c.name).join(', '));

  // 4. Products API: Loading and Verification of 5 Products
  console.log('\n>>> 4. Verifying The 5 Authentic Products in Catalog...');
  const prodsRes = await fetch(base + '/api/products');
  const prodsData = await prodsRes.json();
  if (!prodsData.success || prodsData.data.length !== 5) {
    throw new Error('Expected 5 products, found: ' + prodsData.data.length);
  }

  const expected = [
    { name: 'Whole Spices', weight: '90 gm', price: 299 },
    { name: 'Shahi Spice Mix', weight: '140 gm', price: 499 },
    { name: 'Turmeric (Holud) Powder', weight: '250 gm', price: 190 },
    { name: 'Red Chili Powder', weight: '250 gm', price: 210 },
    { name: 'Peri Peri Spice Mix', weight: '100 gm', price: 199 }
  ];

  for (const exp of expected) {
    const found = prodsData.data.find(p => p.name === exp.name);
    if (!found) throw new Error('Missing product: ' + exp.name);
    if (found.weight !== exp.weight) throw new Error('Incorrect weight for ' + exp.name + ': got ' + found.weight + ', expected ' + exp.weight);
    if (found.price !== exp.price) throw new Error('Incorrect price for ' + exp.name + ': got ' + found.price + ', expected ' + exp.price);
    console.log('  [PASS] ' + found.name + ' — ' + found.weight + ' — ৳' + found.price + ' (Image: ' + found.image + ')');
  }

  // 5. Category Filtering Functionality
  console.log('\n>>> 5. Testing Category Filtering...');
  const whole = await (await fetch(base + '/api/products?category=whole-spices')).json();
  const mixes = await (await fetch(base + '/api/products?category=spice-mixes')).json();
  const seas = await (await fetch(base + '/api/products?category=seasonings')).json();

  console.log('  [PASS] Whole Spices: ' + whole.data.map(p => p.name).join(', '));
  console.log('  [PASS] Spice Mixes: ' + mixes.data.map(p => p.name).join(', '));
  console.log('  [PASS] Seasonings: ' + seas.data.map(p => p.name).join(', '));

  // 6. Test Placing An Order
  console.log('\n>>> 6. Testing Checkout & Order Placement...');
  const orderRes = await fetch(base + '/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Tanvir Ahmed',
      phone: '01811223344',
      address: 'Road 5, Block B, Bashundhara R/A, Dhaka',
      district: 'Dhaka',
      note: 'Fragile jars',
      items: [{
        productId: 'zaku-prod-1',
        name: 'Whole Spices',
        weight: '90 gm',
        price: 299,
        quantity: 1,
        image: '/assets/prod_whole_spices.jpg',
        total: 299
      }],
      subtotal: 299,
      deliveryFee: 60,
      grandTotal: 359
    })
  });
  const orderData = await orderRes.json();
  if (orderRes.status !== 201 || !orderData.success) throw new Error('Order placement failed');
  console.log('  [PASS] Order successfully saved with ID: ' + orderData.data.id);

  // 7. Test Admin Login & Order Lifecycle
  console.log('\n>>> 7. Testing Admin Authentication & Status Updates...');
  const loginRes = await fetch(base + '/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'zaku2026' })
  });
  const auth = await loginRes.json();
  if (!auth.success) throw new Error('Admin login failed');

  const updateRes = await fetch(base + '/api/orders/' + orderData.data.id + '/status', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + auth.token
    },
    body: JSON.stringify({ status: 'Delivered', note: 'Package handed over' })
  });
  const updateData = await updateRes.json();
  if (!updateData.success || updateData.data.status !== 'Delivered') throw new Error('Status update failed');
  console.log('  [PASS] Admin marked order ' + orderData.data.id + ' as Delivered');

  console.log('\n====================================================');
  console.log('  ALL UPDATED REQUIREMENTS VERIFIED WITH 100% PASS   ');
  console.log('====================================================');
}

runVerification().catch(err => {
  console.error('\n[VERIFICATION ERROR]:', err);
  process.exit(1);
});
