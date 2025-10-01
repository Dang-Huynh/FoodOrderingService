export const money = (n: number | string) =>
  `$${(typeof n === "string" ? parseFloat(n) : n || 0).toFixed(2)}`;

export const dateTime = (v?: string | number | Date) => {
  if (!v) return "Unknown Date";
  const d = new Date(v);
  return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleString();
};
