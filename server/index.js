import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static assets from client public folder
app.use('/assets', express.static(path.join(__dirname, '../client/public/assets')));

// ADMIN AUTH CONSTANTS (Can be set via env, defaults for test and evaluation)
const ADMIN_USERNAME = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASS || 'zaku2026';
const ADMIN_TOKEN = 'zaku_session_secure_token_2026';

// Middleware for admin verification
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes(ADMIN_TOKEN)) {
    return res.status(401).json({ success: false, message: 'Unauthorized admin access' });
  }
  next();
}

// ==================== API ROUTES ==================== //

// 1. Categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Products
app.get('/api/products', (req, res) => {
  try {
    const { category, search, sortBy, offersOnly } = req.query;
    const products = db.getProducts({ category, search, sortBy, offersOnly });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/products', requireAdmin, (req, res) => {
  try {
    const { name, category, price, weight, image, shortDescription, description, ingredients, inStock, stockQuantity } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, price and category are required' });
    }
    const newProduct = db.createProduct({
      name,
      bengaliName: req.body.bengaliName || name,
      category,
      categoryName: category === 'whole-spices' ? 'Whole Spices' : category === 'spice-mixes' ? 'Spice Mixes' : 'Seasonings',
      price: Number(price),
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : Number(price),
      isOffer: Boolean(req.body.isOffer),
      weight: weight || '100 gm',
      image: image || '/assets/whole_spices_jar.png',
      detailImage: image || '/assets/whole_spices_jar.png',
      shortDescription: shortDescription || 'Authentic ZAKU premium spice packaging.',
      description: description || 'Premium spice blend from ZAKU.',
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients || '').split(',').map(s => s.trim()).filter(Boolean),
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      stockQuantity: stockQuantity ? Number(stockQuantity) : 50
    });
    res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Orders
app.post('/api/orders', (req, res) => {
  try {
    const { name, phone, address, district, note, items, subtotal, deliveryFee, grandTotal } = req.body;
    
    if (!name || !phone || !address) {
      return res.status(400).json({ success: false, message: 'Customer name, phone and address are required' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    const order = db.createOrder({
      name,
      phone,
      address,
      district: district || 'Dhaka',
      note: note || '',
      items,
      subtotal,
      deliveryFee,
      grandTotal,
      paymentMethod: 'Cash on Delivery (COD)'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully and recorded to database',
      data: order
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    // Both admin and lookup
    const orders = db.getOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/orders/:id/status', requireAdmin, (req, res) => {
  try {
    const { status, note } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    const order = db.updateOrderStatus(req.params.id, status, note);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Admin Auth & Stats
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: { username: ADMIN_USERNAME, role: 'Administrator' }
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve frontend if built
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexHtml = path.join(clientDistPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.status(200).send('ZAKU Spices E-Commerce API Server Running. Please start client Vite or run build.');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ZAKU E-Commerce API Server listening on http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
});

