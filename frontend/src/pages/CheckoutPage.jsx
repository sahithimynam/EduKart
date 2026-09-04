import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  QrCode,
  Truck,
  Building,
  ShieldCheck,
  Check,
  ArrowLeft,
  Lock,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";

export default function CheckoutPage() {
  const { user, isAuthenticated, demoLogin } = useAuth();
  const {
    cart,
    subtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    coupon,
    clearCart
  } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "Student Sahithi",
    address: user?.address || "Flat 302, Academic Enclave, Near Tech Park",
    city: user?.city || "Bangalore",
    pincode: user?.pincode || "560001",
    phone: user?.phone || "+91 98765 43210"
  });

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">No items to checkout</h2>
        <p className="text-xs text-slate-500">Your cart is empty. Please add items to proceed.</p>
        <Link to="/" className="inline-block px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    // If not authenticated, automatically log in as Demo Student for seamless live demo testing
    if (!isAuthenticated) {
      try {
        await demoLogin("user");
      } catch (err) {
        setError("Please sign in or click Demo Student to place order.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.product._id,
          qty: item.qty
        })),
        shippingAddress,
        paymentMethod,
        discount: discountAmount
      };

      const res = await api.orders.create(payload);
      clearCart();
      navigate(`/order-success/${res.order._id}`);
    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Failed to place order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link to="/cart" className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Secure Checkout
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form area: Address + Payment */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-8 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Delivery & Shipping Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700">Full Name / Student Name</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700">Street / Campus / Hostel Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">PIN Code</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-brand-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700">Contact Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Payment Method (Simulated Instant Sandbox)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { id: "UPI", label: "UPI / QR Code", icon: <QrCode className="w-4 h-4 text-emerald-600" />, desc: "Google Pay, PhonePe, Paytm" },
                { id: "CARD", label: "Credit / Debit Card", icon: <CreditCard className="w-4 h-4 text-brand-600" />, desc: "Visa, MasterCard, RuPay" },
                { id: "NETBANKING", label: "Net Banking", icon: <Building className="w-4 h-4 text-purple-600" />, desc: "All Indian national & private banks" },
                { id: "COD", label: "Cash on Delivery", icon: <Truck className="w-4 h-4 text-amber-600" />, desc: "Pay on arrival at your door" }
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === m.id
                      ? "border-brand-600 bg-brand-50/50 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="mt-0.5 text-brand-600 focus:ring-brand-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      {m.icon}
                      <span>{m.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* UPI QR Simulation details */}
            {paymentMethod === "UPI" && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 p-1 shrink-0 flex items-center justify-center">
                  <QrCode className="w-9 h-9 text-slate-800" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Mock UPI Gateway Activated</p>
                  <p className="text-[11px] text-slate-500">
                    Instant sandbox confirmation upon clicking Place Order.
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Place Order Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Order & Payment...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" /> Place Order & Pay ₹{grandTotal}
              </>
            )}
          </button>
        </form>

        {/* Right side: Items snapshot */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
              Review Items ({cart.length})
            </h3>

            <div className="max-h-64 overflow-y-auto space-y-3 divide-y divide-slate-100 pr-1">
              {cart.map(({ product, qty }) => (
                <div key={product._id} className="pt-2.5 first:pt-0 flex items-center gap-3">
                  <img
                    src={product.img}
                    alt={product.title}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-semibold text-slate-800 truncate">{product.title}</p>
                    <p className="text-slate-500 text-[11px]">Qty: {qty} × ₹{product.price}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    ₹{product.price * qty}
                  </span>
                </div>
              ))}
            </div>

            {/* Price lines */}
            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({coupon?.code})</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between items-baseline font-bold text-slate-900">
                <span className="text-sm">Total Due</span>
                <span className="text-xl font-black text-brand-600">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
