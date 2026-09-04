import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const {
    cart,
    removeFromCart,
    updateQty,
    clearCart,
    subtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    coupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Sign In Required</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please sign in with your student ID (23501a05xx@edukart.com) to view and manage your cart.
          </p>
        </div>
        <Link
          to="/auth"
          state={{ from: { pathname: "/cart" } }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          Sign In / Register <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added any learning materials to your bag yet.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Shopping Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {cart.map(({ product, qty }) => (
              <div
                key={product._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-50/60 transition"
              >
                {/* Thumbnail */}
                <Link
                  to={`/product/${product._id}`}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-200/80 flex items-center justify-center p-1.5"
                >
                  <img
                    src={product.img}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  <Link
                    to={`/product/${product._id}`}
                    className="block font-bold text-slate-900 text-sm hover:text-brand-600 truncate mt-1"
                  >
                    {product.title}
                  </Link>
                  <span className="text-xs font-semibold text-slate-500">
                    ₹{product.price} each
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQty(product._id, qty - 1)}
                      className="p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800 min-w-[28px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQty(product._id, qty + 1)}
                      className="p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-right min-w-[70px]">
                    <span className="text-sm font-extrabold text-slate-900">
                      ₹{product.price * qty}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Educational Free Shipping Notice */}
          <div className="p-4 rounded-xl bg-brand-50 border border-brand-200/80 text-xs text-brand-800 flex items-center justify-between">
            <span className="font-medium">
              {subtotal >= 499
                ? "🎉 You have qualified for FREE Shipping on this order!"
                : `Add ₹${499 - subtotal} more of eligible items to unlock FREE Delivery.`}
            </span>
            <Link to="/" className="font-bold underline ml-2 shrink-0">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Breakdown Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            {/* Price lines */}
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Coupon Discount ({coupon?.code})
                  </span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping & Handling</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline text-slate-900 font-bold">
                <span className="text-sm">Grand Total</span>
                <span className="text-2xl font-black text-brand-600">₹{grandTotal}</span>
              </div>
            </div>

            {/* Coupon input */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Have a Promo Code?
              </label>
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold">{coupon.code}</p>
                      <p className="text-[10px] text-emerald-700">{coupon.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. LEARN20"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase font-semibold focus:outline-hidden focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>End-to-end encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
