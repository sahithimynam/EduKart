import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, Star, ShoppingCart, Heart, Check, ExternalLink, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isSaved = isInWishlist(product._id);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left image */}
          <div className="bg-slate-100 aspect-square md:aspect-auto relative overflow-hidden">
            <img
              src={product.img}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right info */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-slate-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 leading-snug mb-3">
                {product.title}
              </h3>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-black text-slate-900">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.stock > 0 ? (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {product.desc}
              </p>

              {/* Highlights */}
              {product.highlights && product.highlights.length > 0 && (
                <div className="mb-6 space-y-1.5">
                  <p className="text-xs font-bold text-slate-700">What's included:</p>
                  {product.highlights.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                {/* Quantity selector */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-800 min-w-[32px] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAdd}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add to Cart (₹{product.price * qty})
                    </>
                  )}
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-xl border transition ${
                    isSaved
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500" : ""}`} />
                </button>
              </div>

              {/* Full details link */}
              <Link
                to={`/product/${product._id}`}
                onClick={onClose}
                className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center justify-center gap-1.5 pt-1"
              >
                View Complete Product Details <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
