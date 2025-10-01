import { useEffect, useMemo, useState, useCallback } from "react";
import { getRestaurant } from "../api";

export default function useRestaurantMenu(id, searchQuery) {
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getRestaurant(id);
        if (!mounted) return;
        setRestaurant(data);
        setMenu(data.menu || {});
        setSections(Object.keys(data.menu || {}));
      } catch (e) {
        setErr("Failed to load restaurant or menu data.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const filterItems = useCallback(
    (items) => items.filter((i) =>
      i.name.toLowerCase().includes((searchQuery || "").trim().toLowerCase())
    ), [searchQuery]
  );

  const grouped = useMemo(() => {
    const out = {};
    sections.forEach((s) => {
      const list = Array.isArray(menu[s]) ? filterItems(menu[s]) : [];
      if (list.length) out[s] = list;
    });
    return out;
  }, [sections, menu, filterItems]);

  return { restaurant, grouped, sections, loading, error };
}
