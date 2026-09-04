import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();

  // Local storage persisted cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("edukart_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Local storage persisted wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("edukart_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Coupon state
  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem("edukart_coupon");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Notification toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    localStorage.setItem("edukart_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("edukart_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem("edukart_coupon", JSON.stringify(coupon));
    } else {
      localStorage.removeItem("edukart_coupon");
    }
  }, [coupon]);

  // Sync wishlist from backend if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.wishlist
        .get()
        .then((items) => {
          if (Array.isArray(items) && items.length > 0) {
            setWishlist(items);
          }
        })
        .catch(() => {});
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [isAuthenticated]);

  // Cart operations
  const addToCart = (product, qty = 1) => {
    if (!isAuthenticated) {
      showToast("Please sign in with your student ID to add items to cart", "error");
      return false;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { product, qty }];
    });
    showToast(`Added "${product.title}" to cart!`);
    return true;
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
    showToast("Item removed from cart", "info");
  };

  const updateQty = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  // Wishlist operations
  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      showToast("Please sign in with your student ID to save items to wishlist", "error");
      return false;
    }
    const isSaved = isInWishlist(product._id);
    if (isSaved) {
      setWishlist((prev) => prev.filter((item) => (item._id || item) !== product._id));
      showToast(`Removed "${product.title}" from wishlist`, "info");
      try {
        await api.wishlist.remove(product._id);
      } catch {}
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.title}" to wishlist!`);
      try {
        await api.wishlist.add(product._id);
      } catch {}
    }
    return true;
  };

  // Pricing calculations
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const rawShipping = subtotal > 499 || subtotal === 0 ? 0 : 49;
  const shippingFee = coupon?.code === "EDUFREESHIP" ? 0 : rawShipping;

  let discountAmount = 0;
  if (coupon) {
    if (coupon.type === "percent") {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else if (coupon.type === "flat") {
      discountAmount = Math.min(subtotal, coupon.value);
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyCoupon = (codeStr) => {
    const clean = codeStr.trim().toUpperCase();
    if (clean === "LEARN20") {
      setCoupon({ code: "LEARN20", type: "percent", value: 20, desc: "20% Student Discount" });
      showToast("Coupon LEARN20 applied! 20% discount added.");
      return { success: true, message: "20% discount applied!" };
    }
    if (clean === "EDUFREESHIP") {
      setCoupon({ code: "EDUFREESHIP", type: "free_shipping", value: 0, desc: "Free Shipping on any order" });
      showToast("Coupon EDUFREESHIP applied! Free shipping unlocked.");
      return { success: true, message: "Free shipping applied!" };
    }
    if (clean === "FLAT100") {
      setCoupon({ code: "FLAT100", type: "flat", value: 100, desc: "Flat ₹100 Off" });
      showToast("Coupon FLAT100 applied! ₹100 discount added.");
      return { success: true, message: "Flat ₹100 off applied!" };
    }
    showToast("Invalid coupon code. Try 'LEARN20' or 'EDUFREESHIP'", "error");
    return { success: false, message: "Invalid promo code" };
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast("Coupon removed", "info");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        totalItems,
        subtotal,
        shippingFee,
        discountAmount,
        grandTotal,
        coupon,
        toast,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        isInWishlist,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        showToast,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium transition-all duration-300 transform translate-y-0 ${
            toast.type === "error"
              ? "bg-rose-600 text-white"
              : toast.type === "info"
              ? "bg-slate-800 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
