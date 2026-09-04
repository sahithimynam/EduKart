import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  Truck,
  CheckCircle2,
  Clock
} from "lucide-react";
import { api } from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // overview, products, orders
  const [loading, setLoading] = useState(true);

  // New product form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "Books",
    price: "",
    originalPrice: "",
    stock: 50,
    badge: "",
    img: "/images/products/dsa.png",
    desc: "",
    highlights: ""
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const refreshData = async () => {
    try {
      const [statsData, productsData, ordersData] = await Promise.all([
        api.stats.get(),
        api.products.list({ limit: 100 }),
        api.orders.getAllOrders()
      ]);
      setStats(statsData);
      setProducts(productsData.products || []);
      setOrders(ordersData || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const payload = {
        ...newProduct,
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice || newProduct.price),
        stock: Number(newProduct.stock),
        highlights: newProduct.highlights
          ? newProduct.highlights.split("\n").filter((h) => h.trim())
          : []
      };
      await api.products.create(payload);
      setShowAddModal(false);
      setActionMessage("Product added successfully!");
      setNewProduct({
        title: "",
        category: "Books",
        price: "",
        originalPrice: "",
        stock: 50,
        badge: "",
        img: "/images/products/dsa.png",
        desc: "",
        highlights: ""
      });
      refreshData();
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to add product");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.products.delete(id);
      setActionMessage(`Deleted "${title}"`);
      refreshData();
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
      setActionMessage(`Order updated to ${newStatus}`);
      refreshData();
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to update order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md">
            Administration Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Edukart Management Dashboard
          </h1>
        </div>

        {actionMessage && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {actionMessage}
          </div>
        )}

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Gross Sales</p>
            <p className="text-xl font-black text-slate-900">₹{stats?.totalRevenue || 0}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Orders</p>
            <p className="text-xl font-black text-slate-900">{stats?.totalOrders || 0}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Catalog Items</p>
            <p className="text-xl font-black text-slate-900">{stats?.totalProducts || 0}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Students</p>
            <p className="text-xl font-black text-slate-900">{stats?.totalUsers || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 transition ${
            activeTab === "overview"
              ? "border-b-2 border-purple-600 text-purple-700"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Recent Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 transition ${
            activeTab === "products"
              ? "border-b-2 border-purple-600 text-purple-700"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Product Catalog ({products.length})
        </button>
      </div>

      {/* Orders Table Tab */}
      {activeTab === "overview" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-mono text-[11px] font-bold text-slate-900">
                      {order._id.slice(-8)}
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900">{order.user?.name || "Student"}</p>
                      <p className="text-[10px] text-slate-400">{order.user?.email}</p>
                    </td>
                    <td className="p-3.5">
                      {order.items?.length} items
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      ₹{order.total}
                    </td>
                    <td className="p-3.5 text-[11px]">
                      {order.paymentMethod}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border border-slate-200 ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : order.status === "SHIPPED"
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : order.status === "CONFIRMED"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : order.status === "CANCELLED"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Table Tab */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Badge</th>
                  <th className="p-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 flex items-center gap-3 min-w-[240px]">
                      <img
                        src={p.img}
                        alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">{p.title}</p>
                        <p className="text-[10px] text-slate-400">⭐ {p.rating} ({p.reviewsCount})</p>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      ₹{p.price}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3.5">
                      {p.badge && (
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold">
                          {p.badge}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleDeleteProduct(p._id, p.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Educational Resource</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Databases Primer"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                  >
                    <option value="Books">Books</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Study Accessories">Study Accessories</option>
                    <option value="Exam Preparation">Exam Preparation</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Stock Units</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="299"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="499"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Image URL</label>
                <input
                  type="url"
                  value={newProduct.img}
                  onChange={(e) => setNewProduct({ ...newProduct, img: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Highlights (1 per line)</label>
                <textarea
                  rows={2}
                  placeholder="Comprehensive coverage&#10;Interview ready diagrams"
                  value={newProduct.highlights}
                  onChange={(e) => setNewProduct({ ...newProduct, highlights: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed breakdown of the learning material..."
                  value={newProduct.desc}
                  onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {savingProduct ? "Saving..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
