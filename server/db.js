import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const INITIAL_DATA = {
  categories: [
    { id: 'all', name: 'All Products', slug: 'all' },
    { id: 'whole-spices', name: 'Whole Spices', slug: 'whole-spices' },
    { id: 'spice-mixes', name: 'Spice Mixes', slug: 'spice-mixes' },
    { id: 'seasonings', name: 'Seasonings', slug: 'seasonings' }
  ],
  products: [
    {
      id: 'zaku-prod-1',
      name: 'Whole Spices',
      slug: 'whole-spices-90gm',
      category: 'whole-spices',
      categoryName: 'Whole Spices',
      weight: '90 gm',
      price: 299,
      image: '/assets/prod_whole_spices.jpg',
      shortDescription: 'ZAKU Whole Spices blend with authentic handpicked whole aromatic spices.',
      description: 'ZAKU Whole Spices is an exquisite blend of unbroken, sun-dried, premium spices chosen for their intense aroma, natural essential oils, and traditional freshness. Ideal for everyday cooking, aromatic curries, and traditional stews.',
      ingredients: ['Cumin', 'Cinnamon Sticks', 'Green Cardamom', 'Cloves', 'Bay Leaves', 'Black Peppercorns'],
      inStock: true,
      stockQuantity: 45,
      isFeatured: true,
      sortOrder: 1
    },
    {
      id: 'zaku-prod-2',
      name: 'Shahi Spice Mix',
      slug: 'shahi-spice-mix-140gm',
      category: 'spice-mixes',
      categoryName: 'Spice Mixes',
      weight: '140 gm',
      price: 499,
      image: '/assets/prod_shahi_spice_mix.jpg',
      shortDescription: 'Signature Shahi Spice Mix crafted with premium royal ingredients.',
      description: 'Crafted for connoisseurs of authentic flavors, ZAKU Shahi Spice Mix combines aromatic royal cardamom, mace, shahi jeera, and toasted spices. Imparts an irresistible aroma and rich flavor to roast, korma, and traditional curries.',
      ingredients: ['Shahi Jeera', 'Green Cardamom', 'Black Cardamom', 'Cinnamon', 'Mace', 'Nutmeg', 'Cloves'],
      inStock: true,
      stockQuantity: 32,
      isFeatured: true,
      sortOrder: 2
    },
    {
      id: 'zaku-prod-3',
      name: 'Turmeric (Holud) Powder',
      slug: 'turmeric-holud-powder-250gm',
      category: 'whole-spices',
      categoryName: 'Whole Spices',
      weight: '250 gm',
      price: 190,
      image: '/assets/prod_turmeric_powder.jpg',
      shortDescription: '100% natural pure turmeric powder with deep golden color and rich aroma.',
      description: 'ZAKU Turmeric (Holud) Powder is made from high-curcumin heirloom turmeric rhizomes. Carefully sun-dried, polished, and hygienically powdered to preserve natural purity, vibrant color, and traditional culinary excellence.',
      ingredients: ['100% Pure Natural Turmeric'],
      inStock: true,
      stockQuantity: 50,
      isFeatured: true,
      sortOrder: 3
    },
    {
      id: 'zaku-prod-4',
      name: 'Red Chili Powder',
      slug: 'red-chili-powder-250gm',
      category: 'whole-spices',
      categoryName: 'Whole Spices',
      weight: '250 gm',
      price: 210,
      image: '/assets/prod_chilli_powder.jpg',
      shortDescription: 'Pure vibrant red chili powder ground from handpicked sun-dried chilies.',
      description: 'ZAKU Red Chili Powder delivers the authentic pungent heat and rich natural color required for traditional Bangladeshi cuisine. Free from synthetic colorants or adulteration.',
      ingredients: ['100% Pure Sun-Dried Red Chilies'],
      inStock: true,
      stockQuantity: 40,
      isFeatured: true,
      sortOrder: 4
    },
    {
      id: 'zaku-prod-5',
      name: 'Peri Peri Spice Mix',
      slug: 'peri-peri-spice-mix-100gm',
      category: 'spice-mixes',
      categoryName: 'Spice Mixes',
      secondaryCategory: 'seasonings',
      weight: '100 gm',
      price: 199,
      image: '/assets/prod_peri_peri_spice_mix.jpg',
      shortDescription: 'Bold & Spicy Peri Peri spice blend for marinating, coating & seasoning.',
      description: 'Turn your everyday fries, grilled chicken, and snacks into an irresistible flavor sensation. ZAKU Peri Peri Spice Mix delivers the perfect balance of fiery chili heat, zesty citrus notes, aromatic garlic, and savory sea salt.',
      ingredients: ['Chili Flakes', 'Paprika', 'Garlic Powder', 'Onion Powder', 'Black Pepper', 'Natural Salt'],
      inStock: true,
      stockQuantity: 60,
      isFeatured: true,
      sortOrder: 5
    }
  ],
  orders: []
};

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDb(INITIAL_DATA);
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, falling back to initial data:', err);
    return INITIAL_DATA;
  }
}

function writeDb(data) {
  try {
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

export function syncProducts() {
  const current = readDb();
  current.products = INITIAL_DATA.products;
  current.categories = INITIAL_DATA.categories;
  writeDb(current);
}

export const db = {
  getCategories() {
    const data = readDb();
    return data.categories || [];
  },

  getProducts(filters = {}) {
    const data = readDb();
    let products = [...(data.products || [])];

    if (filters.category && filters.category !== 'all') {
      products = products.filter(p =>
        p.category === filters.category ||
        p.secondaryCategory === filters.category
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        (p.ingredients && p.ingredients.some(ing => ing.toLowerCase().includes(q)))
      );
    }

    if (filters.sortBy) {
      if (filters.sortBy === 'price-low') {
        products.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price-high') {
        products.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === 'name') {
        products.sort((a, b) => a.name.localeCompare(b.name));
      }
    } else {
      products.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
    }

    return products;
  },

  getProductById(id) {
    const data = readDb();
    return data.products.find(p => p.id === id || p.slug === id) || null;
  },

  createProduct(productData) {
    const data = readDb();
    const newId = `zaku-prod-${Date.now().toString(36)}`;
    const newProduct = {
      id: newId,
      slug: (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36),
      inStock: true,
      sortOrder: data.products.length + 1,
      ...productData
    };
    data.products.push(newProduct);
    writeDb(data);
    return newProduct;
  },

  updateProduct(id, updates) {
    const data = readDb();
    const idx = data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    data.products[idx] = { ...data.products[idx], ...updates };
    writeDb(data);
    return data.products[idx];
  },

  deleteProduct(id) {
    const data = readDb();
    const idx = data.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    data.products.splice(idx, 1);
    writeDb(data);
    return true;
  },

  getOrders() {
    const data = readDb();
    return (data.orders || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getOrderById(id) {
    const data = readDb();
    return data.orders.find(o => o.id.toLowerCase() === id.toLowerCase()) || null;
  },

  createOrder(orderPayload) {
    const data = readDb();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ZAKU-2026-${randomSuffix}`;
    const now = new Date().toISOString();

    const newOrder = {
      id: orderId,
      createdAt: now,
      customer: {
        name: orderPayload.name,
        phone: orderPayload.phone,
        address: orderPayload.address,
        district: orderPayload.district || 'Dhaka',
        note: orderPayload.note || ''
      },
      items: orderPayload.items || [],
      subtotal: Number(orderPayload.subtotal || 0),
      deliveryFee: Number(orderPayload.deliveryFee || 60),
      grandTotal: Number(orderPayload.grandTotal || 0),
      paymentMethod: orderPayload.paymentMethod || 'Cash on Delivery (COD)',
      status: 'Pending',
      timeline: [
        {
          status: 'Pending',
          timestamp: now,
          note: 'Order successfully received & waiting for processing'
        }
      ]
    };

    if (Array.isArray(orderPayload.items)) {
      for (const item of orderPayload.items) {
        const prod = data.products.find(p => p.id === item.productId);
        if (prod && typeof prod.stockQuantity === 'number') {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
          if (prod.stockQuantity === 0) {
            prod.inStock = false;
          }
        }
      }
    }

    data.orders.unshift(newOrder);
    writeDb(data);
    return newOrder;
  },

  updateOrderStatus(orderId, newStatus, note = '') {
    const data = readDb();
    const order = data.orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
    if (!order) return null;

    order.status = newStatus;
    if (!order.timeline) order.timeline = [];
    order.timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Order marked as ${newStatus}`
    });

    writeDb(data);
    return order;
  },

  getStats() {
    const data = readDb();
    const orders = data.orders || [];
    const products = data.products || [];

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const processingOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Confirmed').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

    const lowStockProducts = products.filter(p => (p.stockQuantity || 0) < 10);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      totalProducts: products.length,
      lowStockProducts: lowStockProducts.length
    };
  }
};
