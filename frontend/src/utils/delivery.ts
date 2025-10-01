export const normalizeFee = (fee?: string | number) => {
  if (fee == null) return 0;
  const s = String(fee).toLowerCase();
  if (s.includes("free")) return 0;
  const m = s.match(/\$([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
};

export const minDeliveryMins = (t?: string) => {
  if (!t) return Number.POSITIVE_INFINITY;
  const m = t.match(/(\d+)\s*([–-]\s*\d+)?/);
  return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
};
