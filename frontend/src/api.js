const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default {
  fetchMenu,
  fetchOrders,
  loginUser,
};


// Menu API
export async function fetchMenu() {
  const response = await fetch(`${API_URL}/menu/`);
  if (!response.ok) throw new Error("Failed to fetch menu");
  return response.json();
}

// Orders API
export async function fetchOrders() {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_URL}/orders/`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}

// Login API
export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error("Login failed");

  const data = await response.json();

  // Save tokens
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);

  return data;
}

