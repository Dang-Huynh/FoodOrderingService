import { useEffect, useState } from "react";
export function usePersistedState<T>(key: string, initial: T){
  const [state, set] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, set] as const;
}
