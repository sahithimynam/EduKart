import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  ShoppingCart,
  Heart,
  User,
  Search,
  LogOut,
  LayoutDashboard,
  Package,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar({ searchQuery, setSearchQuery }) {
  const { user, isAuthenticated, isAdmin, logout, demoLogin } = useAuth();
  const { totalItems, wishlist } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleQuickDemo = async (role) => {
    await demoLogin(role);
    setUserDropdownOpen(false);
    navigate(role === "admin" ? "/admin" : "/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Edu<span className="text-brand-600">Kart</span>
              </span>
            </div>
          </Link>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search notebooks, exam guides, pens, drafting tools, desk lamps..."
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 rounded-full border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-hidden transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </form>

          {/* Right Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist Link */}
            <Link
              to={isAuthenticated ? "/wishlist" : "/auth"}
              state={!isAuthenticated ? { from: { pathname: "/wishlist" }, message: "Please sign in with your student ID (23501a05xx@edukart.com) to view your saved wishlist" } : undefined}
              className="relative p-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {isAuthenticated && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to={isAuthenticated ? "/cart" : "/auth"}
              state={!isAuthenticated ? { from: { pathname: "/cart" }, message: "Please sign in with your student ID (23501a05xx@edukart.com) to access your shopping cart" } : undefined}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition font-medium text-sm"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {isAuthenticated && totalItems > 0 && (
                <span className="bg-brand-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:block text-xs font-medium text-slate-700 pr-1 max-w-[100px] truncate">
                    {user?.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-sm animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isAdmin ? "bg-purple-100 text-purple-700" : "bg-brand-50 text-brand-700"
                      }`}>
                        {isAdmin ? "Administrator" : "Student"}
                      </span>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      Saved Wishlist
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-purple-700 hover:bg-purple-50 transition font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
                >
                  Sign In
                </Link>

                {/* Quick 1-Click Demo Button */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    onClick={() => handleQuickDemo("user")}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg border border-brand-200 transition"
                    title="1-Click Login as Demo Student (23501a0501)"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    Demo Student (0501)
                  </button>
                  <button
                    onClick={() => handleQuickDemo("admin")}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 transition"
                    title="1-Click Login as Demo Admin"
                  >
                    Admin
                  </button>
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 rounded-lg border border-slate-200 focus:outline-hidden"
              />
            </form>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => handleQuickDemo("user")}
                className="text-xs font-medium px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg border border-brand-200"
              >
                ⚡ Login as Demo Student
              </button>
              <button
                onClick={() => handleQuickDemo("admin")}
                className="text-xs font-medium px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg border border-purple-200"
              >
                ⚡ Login as Demo Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
