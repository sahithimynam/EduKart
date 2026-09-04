import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Check } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isSaved = isInWishlist(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
          isSaved
            ? "bg-rose-50 text-rose-600 shadow-sm"
            : "bg-white/80 text-slate-500 hover:text-rose-600 hover:bg-white"
        }`}
        title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-500" : ""}`} />
      </button>

      {/* Thumbnail */}
      <Link
        to={`/product/${product._id}`}
        className="block relative h-52 bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center p-3 border-b border-slate-100"
      >
        <img
          src={product.img}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
          loading="lazy"
        />
      </Link>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="font-semibold text-brand-600 uppercase tracking-wider text-[10px] bg-brand-50 px-2 py-0.5 rounded-md">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-slate-700">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product._id}`}
            className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 text-sm leading-snug mb-1"
          >
            {product.title}
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {product.desc}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            {discountPercent && (
              <span className="text-[10px] font-bold text-emerald-600">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs ${
              justAdded
                ? "bg-emerald-600 text-white"
                : "bg-brand-600 hover:bg-brand-700 text-white hover:shadow-brand-500/25 active:scale-95"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
