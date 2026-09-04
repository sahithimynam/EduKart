import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  ArrowLeft,
  Check,
  Share2
} from "lucide-react";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    api.products
      .getById(id)
      .then((res) => {
        setProduct(res.product);
        setRelated(res.related || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-xs hover:bg-brand-700 transition"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/auth", {
        state: {
          from: { pathname: `/product/${product._id}` },
          message: "Please sign in with your student ID (23501a05xx@edukart.com) to add items to your cart"
        }
      });
      return;
    }
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/auth", {
        state: {
          from: { pathname: `/product/${product._id}` },
          message: "Please sign in with your student ID (23501a05xx@edukart.com) to checkout"
        }
      });
      return;
    }
    addToCart(product, qty);
    navigate("/checkout");
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      navigate("/auth", {
        state: {
          from: { pathname: `/product/${product._id}` },
          message: "Please sign in with your student ID (23501a05xx@edukart.com) to save items to your wishlist"
        }
      });
      return;
    }
    toggleWishlist(product);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="space-y-12 pb-20">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-brand-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
        <span>/</span>
        <span className="text-slate-400">{product.category}</span>
        <span>/</span>
        <span className="text-slate-700 font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Media */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-slate-50 border border-slate-200/80 shadow-sm flex items-center justify-center p-8">
            <img
              src={product.img}
              alt={product.title}
              className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
            />
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition shadow-md ${
                isSaved ? "bg-rose-50 text-rose-600" : "bg-white/80 text-slate-600 hover:text-rose-600 hover:bg-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Right Column: Information & Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-slate-800">{product.rating.toFixed(1)}</span>
                <span className="text-slate-400">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-slate-900">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">Inclusive of all taxes & GST</p>
            </div>

            <div>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Stock ({product.stock} left)
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Highlights checklist */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">About This Item</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.desc}
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  -
                </button>
                <span className="px-4 py-2.5 text-sm font-bold text-slate-800 min-w-[40px] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3 px-5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-white hover:bg-slate-50 text-slate-800 border-2 border-brand-600 hover:border-brand-700"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 text-brand-600" /> Add to Cart
                  </>
                )}
              </button>

              {/* Buy Now Instant */}
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition"
              >
                <Zap className="w-4 h-4" /> Buy Now
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <div className="p-3 rounded-xl bg-slate-50">
              <Truck className="w-4 h-4 mx-auto mb-1 text-brand-600" />
              <span>Fast Express Dispatch</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-brand-600" />
              <span>Verified Genuine Quality</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <RotateCcw className="w-4 h-4 mx-auto mb-1 text-brand-600" />
              <span>7-Day Replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Similar in {product.category}</h2>
            <Link to="/" className="text-xs font-semibold text-brand-600 hover:text-brand-800">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
