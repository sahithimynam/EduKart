const API_BASE = "https://edukart-z4vv.onrender.com/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("edukart_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg = data?.message || (typeof data === "string" ? data : "Request failed");
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth API
  auth: {
    register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
    login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    demoLogin: (role = "user") => request("/auth/demo", { method: "POST", body: JSON.stringify({ role }) }),
    me: () => request("/auth/me"),
    updateProfile: (payload) => request("/auth/profile", { method: "PUT", body: JSON.stringify(payload) }),
  },

  // Products API
  products: {
    list: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== "" && val !== null) {
          query.append(key, val);
        }
      });
      const qStr = query.toString();
      return request(`/products${qStr ? `?${qStr}` : ""}`);
    },
    getById: (id) => request(`/products/${id}`),
    getCategories: () => request("/products/categories"),
    create: (payload) => request("/products", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
  },

  // Orders API
  orders: {
    create: (payload) => request("/orders", { method: "POST", body: JSON.stringify(payload) }),
    getMyOrders: () => request("/orders/mine"),
    getById: (id) => request(`/orders/${id}`),
    getAllOrders: () => request("/orders"),
    updateStatus: (id, status) => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },

  // Wishlist API
  wishlist: {
    get: () => request("/wishlist"),
    add: (productId) => request("/wishlist", { method: "POST", body: JSON.stringify({ productId }) }),
    remove: (productId) => request(`/wishlist/${productId}`, { method: "DELETE" }),
  },

  // Admin Stats
  stats: {
    get: () => request("/stats"),
  }
};
