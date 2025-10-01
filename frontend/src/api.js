// src/api.js

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

/* -------------------- Public: Restaurants -------------------- */
export async function getRestaurants() {
  const res = await fetch(`${API_URL}/menu/restaurants/`);
  if (!res.ok) throw new Error("Failed to fetch restaurants");
  return res.json();
}

export async function getRestaurant(id) {
  const res = await fetch(`${API_URL}/menu/restaurants/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch restaurant");
  return res.json();
}

/* -------------------- Auth -------------------- */
export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error("Login failed");

  const data = await res.json(); // expects { access, refresh }
  localStorage.setItem("access_token", data.access);
  if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
  return data;
}

/* -------------------- Protected: Orders -------------------- */
export async function fetchOrders() {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/orders/`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function placeOrder(payload) {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`${API_URL}/orders/place/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to place order");
  }
  return res.json();
}

/* -------------------- Optional default export -------------------- */
const api = {
  API_URL,
  getRestaurants,
  getRestaurant,
  loginUser,
  fetchOrders,
  placeOrder,
};

export default api;
