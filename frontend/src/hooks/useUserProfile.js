import { useEffect, useMemo, useRef, useState } from "react";

export default function useUserProfile(initialUser) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("userProfile");
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialUser;
  });

  // persist
  useEffect(() => {
    try { localStorage.setItem("userProfile", JSON.stringify(user)); } catch {}
  }, [user]);

  // validators
  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(user.email || ""), [user.email]);
  const phoneOk = useMemo(() => (user.phone || "").replace(/\D/g, "").length >= 10, [user.phone]);

  // avatar upload
  const fileRef = useRef(null);
  const triggerAvatar = () => fileRef.current?.click();
  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, avatar: url }));
  };

  // upserts
  const upsertAddress = (a) => {
    setUser((prev) => {
      const exists = prev.addresses.some((x) => x.id === a.id);
      const list = exists ? prev.addresses.map((x) => (x.id === a.id ? a : x)) : [...prev.addresses, a];
      const normalized = a.isDefault ? list.map((x) => ({ ...x, isDefault: x.id === a.id })) : list;
      return { ...prev, addresses: normalized };
    });
  };

  const upsertPayment = (p) => {
    setUser((prev) => {
      const exists = prev.paymentMethods.some((x) => x.id === p.id);
      const list = exists ? prev.paymentMethods.map((x) => (x.id === p.id ? p : x)) : [...prev.paymentMethods, p];
      const normalized = p.isDefault ? list.map((x) => ({ ...x, isDefault: x.id === p.id })) : list;
      return { ...prev, paymentMethods: normalized };
    });
  };

  const deleteAddress = (id) =>
    setUser((prev) => ({ ...prev, addresses: prev.addresses.filter((x) => x.id !== id) }));
  const deletePayment = (id) =>
    setUser((prev) => ({ ...prev, paymentMethods: prev.paymentMethods.filter((x) => x.id !== id) }));

  const setDefaultAddress = (addressId) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr) => ({ ...addr, isDefault: addr.id === addressId })),
    }));
  };

  const setDefaultPayment = (paymentId) => {
    setUser((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((pm) => ({ ...pm, isDefault: pm.id === paymentId })),
    }));
  };

  return {
    user, setUser,
    emailOk, phoneOk,
    fileRef, triggerAvatar, onAvatarChange,
    upsertAddress, upsertPayment, deleteAddress, deletePayment,
    setDefaultAddress, setDefaultPayment,
  };
}
