import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Search,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('zaku_admin_token') || '');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'stats'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Order Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status Filter for Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product Add/Edit Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    bengaliName: '',
    category: 'whole-spices',
    price: '',
    originalPrice: '',
    weight: '100 gm',
    image: '/assets/whole_spices_jar.png',
    shortDescription: '',
    description: '',
    ingredients: '',
    inStock: true,
    stockQuantity: 50,
    isOffer: false
  });

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
      } else if (statsRes.status === 401) {
        handleLogout();
        return;
      }

      // 2. Fetch Orders
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success) setOrders(ordersData.data);
      }

      // 3. Fetch Products
      const prodsRes = await fetch('/api/products');
      if (prodsRes.ok) {
        const prodsData = await prodsRes.json();
        if (prodsData.success) setProducts(prodsData.data);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        localStorage.setItem('zaku_admin_token', data.token);
      } else {
        setLoginError(data.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setLoginError('Server error while authenticating');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('zaku_admin_token');
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, note: `Status updated to ${newStatus} by store admin` })
      });
      const data = await res.json();
      if (data.success) {
        // update local list
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.data);
        }
        // reload stats
        loadAdminData();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Product CRUD
  const openCreateProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      bengaliName: '',
      category: 'whole-spices',
      price: '',
      originalPrice: '',
      weight: '100 gm',
      image: '/assets/whole_spices_jar.png',
      shortDescription: '',
      description: '',
      ingredients: '',
      inStock: true,
      stockQuantity: 50,
      isOffer: false
    });
    setProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || '',
      bengaliName: prod.bengaliName || '',
      category: prod.category || 'whole-spices',
      price: prod.price || '',
      originalPrice: prod.originalPrice || '',
      weight: prod.weight || '100 gm',
      image: prod.image || '/assets/whole_spices_jar.png',
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      ingredients: Array.isArray(prod.ingredients) ? prod.ingredients.join(', ') : '',
      inStock: prod.inStock !== undefined ? prod.inStock : true,
      stockQuantity: prod.stockQuantity || 50,
      isOffer: Boolean(prod.isOffer)
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : Number(productForm.price),
        stockQuantity: Number(productForm.stockQuantity),
        ingredients: productForm.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
      };

      if (editingProduct) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setProductModalOpen(false);
          loadAdminData();
        }
      } else {
        // Create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setProductModalOpen(false);
          loadAdminData();
        }
      }
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to delete this spice product?')) return;
    try {
      const res = await fetch(`/api/products/${prodId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== prodId));
        loadAdminData();
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  // Filtered orders
  const filteredOrders =
    orderStatusFilter === 'all'
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === orderStatusFilter.toLowerCase());

  // If not logged in, render Admin Login Form
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 font-sans">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#7A1F1F]/10 text-[#7A1F1F] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-stone-900"><span className="font-zaku tracking-wide">ZAKU</span> Admin Portal</h2>
          <p className="text-xs text-stone-500 mt-1 mb-6">
            Authorized store management and order processing only.
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1F1F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7A1F1F]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-[#7A1F1F] hover:bg-[#631717] text-white font-bold text-sm rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                {isLoggingIn ? 'Verifying...' : 'Sign In as Admin'}
              </button>
            </div>

            <div className="text-center pt-2 text-[11px] text-stone-400">
              Demo Credentials: username: <code className="text-stone-700">admin</code> / password: <code className="text-stone-700">zaku2026</code>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ================= ADMIN DASHBOARD VIEW ================= //
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans space-y-8">
      
      {/* Top Admin Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#7A1F1F] bg-[#7A1F1F]/10 px-2.5 py-1 rounded">
            Store Administration
          </span>
          <h1 className="text-2xl font-black text-stone-900 mt-1"><span className="font-zaku tracking-wide">ZAKU</span> Control Center</h1>
          <p className="text-xs text-stone-500">Live backend database connected & persistent</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadAdminData}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
            title="Refresh Store Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-stone-400 uppercase">Total Revenue</span>
            <h3 className="text-2xl font-black text-[#7A1F1F]">৳{stats.totalRevenue}</h3>
            <p className="text-[11px] text-emerald-600 font-medium">From verified orders</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-stone-400 uppercase">Total Orders</span>
            <h3 className="text-2xl font-black text-stone-900">{stats.totalOrders}</h3>
            <p className="text-[11px] text-stone-500">{stats.pendingOrders} pending confirmation</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-stone-400 uppercase">Delivered Orders</span>
            <h3 className="text-2xl font-black text-emerald-700">{stats.deliveredOrders}</h3>
            <p className="text-[11px] text-stone-500">{stats.processingOrders} in transit/processing</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-stone-400 uppercase">Active Spices</span>
            <h3 className="text-2xl font-black text-stone-900">{stats.totalProducts}</h3>
            <p className="text-[11px] text-stone-500">{stats.lowStockProducts} low on stock</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-b-2 border-[#7A1F1F] text-[#7A1F1F]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'border-b-2 border-[#7A1F1F] text-[#7A1F1F]'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Spices & Inventory ({products.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: ORDERS ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Status Filter Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-stone-400 uppercase mr-1">Status:</span>
              {['all', 'Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    orderStatusFilter.toLowerCase() === st.toLowerCase()
                      ? 'bg-[#7A1F1F] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st.toUpperCase()}
                </button>
              ))}
            </div>

            <span className="text-xs text-stone-500 font-semibold">
              Showing {filteredOrders.length} orders
            </span>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">District & Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status & Action</th>
                    <th className="p-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-stone-900">
                        <div>{order.id}</div>
                        <div className="text-[11px] font-sans font-normal text-stone-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-stone-900">{order.customer?.name}</div>
                        <div className="text-xs text-stone-500 font-mono">{order.customer?.phone}</div>
                      </td>

                      <td className="p-4">
                        <div className="text-stone-800 font-semibold">{order.customer?.district}</div>
                        <div className="text-xs text-stone-500 truncate max-w-xs">
                          {order.items?.map((i) => `${i.name} (${i.quantity}x)`).join(', ')}
                        </div>
                      </td>

                      <td className="p-4 font-black text-[#7A1F1F]">
                        ৳{order.grandTotal}
                      </td>

                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border focus:outline-none cursor-pointer ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.status === 'Processing'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : order.status === 'Confirmed'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : order.status === 'Cancelled'
                              ? 'bg-red-50 text-red-800 border-red-300'
                              : 'bg-stone-100 text-stone-800 border-stone-300'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg bg-stone-100 hover:bg-[#7A1F1F] hover:text-white text-stone-700 transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCTS ================= */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-200">
            <div>
              <h3 className="font-extrabold text-stone-900 text-sm">Spices Inventory</h3>
              <p className="text-xs text-stone-500">Update prices, stock, weights, and product information</p>
            </div>
            <button
              type="button"
              onClick={openCreateProductModal}
              className="px-4 py-2.5 bg-[#7A1F1F] hover:bg-[#631717] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Spice</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="p-4">Spice</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Weight</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg bg-stone-50 border border-stone-200 p-1 object-contain"
                          />
                          <div>
                            <div className="font-bold text-stone-900">{p.name}</div>
                            <div className="text-[11px] text-stone-500">{p.bengaliName}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-stone-700 capitalize">
                        {p.categoryName || p.category}
                      </td>

                      <td className="p-4 font-semibold text-stone-700">{p.weight}</td>

                      <td className="p-4 font-black text-[#7A1F1F]">
                        ৳{p.price}
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-xs text-stone-400 line-through ml-1.5 font-normal">
                            ৳{p.originalPrice}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            p.inStock && p.stockQuantity > 5
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {p.inStock ? `${p.stockQuantity} jars` : 'Out of stock'}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditProductModal(p)}
                            className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                            title="Edit Spice Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                            title="Delete Spice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="border-b border-stone-100 pb-4">
              <span className="text-xs font-extrabold uppercase text-[#7A1F1F]">
                Order Management
              </span>
              <h3 className="text-xl font-black text-stone-900 mt-1">{selectedOrder.id}</h3>
              <p className="text-xs text-stone-500">
                Created: {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-stone-400 font-bold uppercase">Customer</span>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{selectedOrder.customer?.name}</p>
                <p className="font-mono text-stone-600">{selectedOrder.customer?.phone}</p>
              </div>
              <div>
                <span className="text-stone-400 font-bold uppercase">Destination</span>
                <p className="font-semibold text-stone-900 mt-0.5">{selectedOrder.customer?.address}</p>
                <p className="text-stone-500">{selectedOrder.customer?.district}, Bangladesh</p>
              </div>
            </div>

            {/* Status change in modal */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-700 uppercase">Change Status:</span>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-xs"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Ordered items */}
            <div>
              <h4 className="text-xs font-bold uppercase text-stone-500 mb-2">Order Items</h4>
              <div className="divide-y divide-stone-100">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.name} className="w-10 h-10 object-contain rounded bg-stone-50" />
                      <div>
                        <span className="font-bold text-stone-900">{it.name}</span>
                        <span className="text-stone-500 block">{it.weight} • Qty: {it.quantity}</span>
                      </div>
                    </div>
                    <span className="font-black text-stone-900">৳{it.total || it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-stone-700">Grand Total (COD):</span>
              <span className="text-2xl font-black text-[#7A1F1F]">৳{selectedOrder.grandTotal}</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= PRODUCT ADD / EDIT MODAL ================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setProductModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-stone-900">
              {editingProduct ? 'Edit Spice Product' : 'Add New Spice to Inventory'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Bengali Name</label>
                  <input
                    type="text"
                    value={productForm.bengaliName}
                    onChange={(e) => setProductForm({ ...productForm, bengaliName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  >
                    <option value="whole-spices">Whole Spices</option>
                    <option value="spice-mixes">Spice Mixes</option>
                    <option value="seasonings">Seasonings</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price (৳ BDT) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Original Price</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Weight *</label>
                  <input
                    type="text"
                    required
                    value={productForm.weight}
                    onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Jar Image URL</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Ingredients (comma separated)</label>
                <input
                  type="text"
                  placeholder="Cumin, Cardamom, Cloves, Cinnamon"
                  value={productForm.ingredients}
                  onChange={(e) => setProductForm({ ...productForm, ingredients: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="text-[#7A1F1F] rounded"
                  />
                  <span className="font-bold text-stone-800">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isOffer}
                    onChange={(e) => setProductForm({ ...productForm, isOffer: e.target.checked })}
                    className="text-[#7A1F1F] rounded"
                  />
                  <span className="font-bold text-stone-800">Highlight in Offers</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#7A1F1F] hover:bg-[#631717] text-white font-bold rounded-xl shadow-xs"
                >
                  Save Spice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

