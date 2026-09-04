import React, { useState, useEffect } from "react";
import {
  Sparkles,
  BookOpen,
  PenTool,
  Laptop,
  Lamp,
  GraduationCap,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Search,
  Tag
} from "lucide-react";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function HomePage({ searchQuery, setSearchQuery }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [minRating, setMinRating] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch products whenever filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = {
      q: searchQuery || "",
      category: selectedCategory === "All" ? "" : selectedCategory,
      sort: sortBy,
      minRating: minRating || "",
      maxPrice: maxPrice || "",
      limit: 50
    };

    api.products
      .list(params)
      .then((res) => {
        if (isMounted) {
          setProducts(res.products || []);
          if (res.categories && res.categories.length > 0) {
            setCategories(res.categories);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedCategory, sortBy, minRating, maxPrice]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("featured");
    setMinRating("");
    setMaxPrice("");
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Books":
        return <BookOpen className="w-4 h-4" />;
      case "Stationery":
        return <PenTool className="w-4 h-4" />;
      case "Electronics":
        return <Laptop className="w-4 h-4" />;
      case "Study Accessories":
        return <Lamp className="w-4 h-4" />;
      case "Exam Preparation":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Category Pills Carousel */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                active
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-102"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{cat}</span>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-white ml-1"></span>
              )}
            </button>
          );
        })}
      </section>

      {/* Filter and Sorting Controls Toolbar */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:border-brand-500"
            >
              <option value="featured">Featured & Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated (Stars)</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Rating filter */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:border-brand-500"
          >
            <option value="">All Ratings</option>
            <option value="4.5">⭐ 4.5 & above</option>
            <option value="4.0">⭐ 4.0 & above</option>
          </select>

          {/* Max price filter */}
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:border-brand-500"
          >
            <option value="">Budget: Any</option>
            <option value="500">Under ₹500</option>
            <option value="1000">Under ₹1,000</option>
            <option value="2000">Under ₹2,000</option>
          </select>
        </div>

        {/* Reset button & total count */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800 font-bold">{products.length}</strong> items
          </span>

          {(searchQuery || selectedCategory !== "All" || minRating || maxPrice || sortBy !== "featured") && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-800 font-bold px-3 py-1.5 rounded-lg hover:bg-brand-50 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-4/3 bg-slate-200 rounded-xl"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                <div className="h-8 bg-slate-200 rounded-xl w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn't find anything matching your filters or search query. Try broadening your keywords or resetting filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
