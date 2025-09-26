import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

/** Normalize legacy cart: array of items without qty -> merge into { ...item, qty } */
function normalizeLegacyCart(list) {
  const map = new Map();
  (Array.isArray(list) ? list : []).forEach((it) => {
    const key = it.id ?? JSON.stringify(it);
    if (!map.has(key)) map.set(key, { ...it, qty: 1 });
    else map.get(key).qty += 1;
  });
  return Array.from(map.values());
}

const initialCart = (() => {
  try {
    const raw = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(raw) && raw.length && raw[0]?.qty) return raw;
    return normalizeLegacyCart(raw);
  } catch {
    return [];
  }
})();

const CartCtx = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const item = action.item;
      const idx = state.cart.findIndex((p) => p.id === item.id);
      const cart =
        idx === -1
          ? [...state.cart, { ...item, qty: 1 }]
          : state.cart.map((p, i) => (i === idx ? { ...p, qty: p.qty + 1 } : p));
      return { ...state, cart, isOpen: true };
    }
    case "INC": {
      const cart = state.cart.map((p) => (p.id === action.id ? { ...p, qty: p.qty + 1 } : p));
      return { ...state, cart };
    }
    case "DEC": {
      const cart = state.cart
        .map((p) => (p.id === action.id ? { ...p, qty: p.qty - 1 } : p))
        .filter((p) => p.qty > 0);
      return { ...state, cart };
    }
    case "REMOVE": {
      const cart = state.cart.filter((p) => p.id !== action.id);
      return { ...state, cart };
    }
    case "CLEAR":
      return { ...state, cart: [] };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { cart: initialCart, isOpen: false });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const value = useMemo(() => {
    const subtotal = state.cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
    const count = state.cart.reduce((n, i) => n + (i.qty || 1), 0);
    return {
      cart: state.cart,
      isOpen: state.isOpen,
      subtotal,
      count,
      add: (item) => dispatch({ type: "ADD", item }),
      inc: (id) => dispatch({ type: "INC", id }),
      dec: (id) => dispatch({ type: "DEC", id }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
      clear: () => dispatch({ type: "CLEAR" }),
      openCart: () => dispatch({ type: "OPEN" }),
      closeCart: () => dispatch({ type: "CLOSE" }),
    };
  }, [state]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
