import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Package,
  ArrowRight,
  Clock,
  Printer,
  ShoppingBag,
  MapPin,
  CreditCard
} from "lucide-react";
import { api } from "../services/api";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id) {
      api.orders
        .getById(id)
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching order:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 pb-20">
      {/* Success Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 text-center shadow-md space-y-5">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-75">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Payment & Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Your educational gear and digital resources are being prepared. A confirmation receipt has been saved to your account.
          </p>
        </div>

        {order && (
          <div className="inline-block bg-slate-50 border border-slate-200 rounded-2xl px-5 py-2.5 text-xs text-slate-600">
            Order Reference ID: <strong className="text-slate-900 font-mono">{order._id}</strong>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/orders"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" /> View My Orders
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Browsing
          </Link>
        </div>
      </div>

      {/* Order Details Receipt */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Order Summary & Invoice
          </h2>

          {/* Delivery & Payment details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>Shipping Address</span>
              </div>
              <p className="font-semibold text-slate-900">{order.shippingAddress?.fullName}</p>
              <p className="text-slate-600">{order.shippingAddress?.address}</p>
              <p className="text-slate-600">
                {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
              </p>
              <p className="text-slate-600">Phone: {order.shippingAddress?.phone}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Payment & Status</span>
              </div>
              <p className="text-slate-600">
                Method: <strong className="text-slate-900">{order.paymentMethod}</strong>
              </p>
              <p className="text-slate-600">
                Status: <span className="font-bold text-emerald-600">{order.paymentStatus}</span>
              </p>
              <p className="text-slate-600">
                Order Date:{" "}
                <strong className="text-slate-900">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })}
                </strong>
              </p>
              <p className="text-slate-600">
                Delivery Status:{" "}
                <span className="font-bold text-brand-600">{order.status}</span>
              </p>
            </div>
          </div>

          {/* Items table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ordered Items</h3>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.img && (
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                    )}
                    <div className="truncate">
                      <p className="font-bold text-slate-800 truncate">{item.title}</p>
                      <p className="text-slate-500">Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-slate-100 pt-4 space-y-1.5 text-xs text-right text-slate-600">
            <p>Subtotal: <strong className="text-slate-900 font-semibold">₹{order.subtotal}</strong></p>
            {order.discount > 0 && (
              <p className="text-emerald-600">Discount: <strong>-₹{order.discount}</strong></p>
            )}
            <p>Shipping: <strong>{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}</strong></p>
            <p className="text-base font-black text-slate-900 pt-2 border-t border-slate-100">
              Total Paid: <span className="text-brand-600">₹{order.total}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
