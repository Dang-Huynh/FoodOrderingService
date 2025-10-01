import { useState } from "react";

const promoCodes = [
  { code: "WELCOME20", type: "PCT", value: 0.2, label: "20% off" },
  { code: "FREESHIP", type: "ABS", value: 2.99, label: "Free delivery" },
  { code: "SAVE10", type: "ABS", value: 10, label: "$10 off" },
];

export function usePromoCodes() {
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [error, setError] = useState("");

  const applyPromo = (code) => {
    setError("");
    const normalized = code.trim().toUpperCase();
    const hit = promoCodes.find((x) => x.code === normalized);
    if (hit) {
      setAppliedPromo(hit);
      return true;
    } else {
      setAppliedPromo(null);
      setError("Promo code is invalid or expired.");
      return false;
    }
  };

  return { appliedPromo, applyPromo, error, clearPromo: () => setAppliedPromo(null) };
}
