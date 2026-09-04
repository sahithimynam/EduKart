import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Calendar, Clock, ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { api } from "../services/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders
      .getMyOrders()
      .then((data) => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user orders:", err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "DELIVERED":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">Delivered</span>;
      case "SHIPPED":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">Shipped</span>;
      case "CONFIRMED":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">Confirmed</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">Cancelled</span>;
      case "PLACED":
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">Order Placed</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          My Learning Orders
        </h1>
        <span className="text-xs text-slate-500 font-semibold">
          {orders.length} orders total
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No orders yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You have not placed any orders yet. Discover our e-books, courses, and engineering kits today!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Start Learning <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-brand-300 transition space-y-4"
            >
              {/* Top header row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Order ID</span>
                    <span className="font-mono font-bold text-slate-800">{order._id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date</span>
                    <span className="font-semibold text-slate-700">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <Link
                    to={`/order-success/${order._id}`}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                  >
                    Receipt <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Items preview */}
              <div className="divide-y divide-slate-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                      )}
                      <div className="truncate">
                        <p className="font-bold text-slate-800 truncate">{item.title}</p>
                        <p className="text-slate-400 text-[11px]">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom footer row */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Payment: <strong className="text-slate-800">{order.paymentMethod}</strong> ({order.paymentStatus})
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-slate-500">Total:</span>
                  <span className="text-base font-black text-brand-600">₹{order.total}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
