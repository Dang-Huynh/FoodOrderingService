import React, { useEffect, useMemo, useState } from "react";
import { Container, Grid, Card, Chip, Box, Typography } from "@mui/material";
import { getRestaurants } from "../api";

// Shared pieces
import SearchSortBar from "../components/bars/SearchSortBar";
import RestaurantCard from "../components/cards/RestaurantCard";
import { usePersistedState } from "../hooks/usePersistedState";
import { normalizeFee, minDeliveryMins } from "../utils/delivery";

/** ---------- UI tokens ---------- */
const ui = {
  pageBg: "#f5f5f5",
  card: {
    borderRadius: 6,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid #eef0f2",
  },
  blackBtn: {
    backgroundColor: "black",
    color: "white",
    "&:hover": { backgroundColor: "#333" },
  },
};

/** ---------- Categories ---------- */
const categories = [
  "All",
  "American",
  "Pizza",
  "Sushi",
  "Japanese",
  "Burgers",
  "Indian",
  "Vegan",
  "Desserts",
  "Mexican",
  "Chinese",
  "Breakfast",
  "Middle Eastern",
  "Vietnamese",
  "Deals",
  "Promoted",
  "Fast & Cheap",
];

function MenuPage() {
  const [restaurantsList, setRestaurantsList] = useState([]);

  // Persisted UI state
  const [query, setQuery] = usePersistedState("menu_query", "");
  const [sortBy, setSortBy] = usePersistedState("menu_sort", "recommended"); // "recommended" | "arrival_asc" | "rating_desc"
  const [selectedCategory, setSelectedCategory] = useState("All");

  /** Fetch restaurants from backend */
  useEffect(() => {
    let mounted = true;
    getRestaurants()
      .then((data) => {
        if (!mounted) return;
        setRestaurantsList(data);
      })
      .catch((err) => console.error(err));
    return () => {
      mounted = false;
    };
  }, []);

  /** Load favorites from localStorage (id => isFavorite) */
  useEffect(() => {
    setRestaurantsList((prev) =>
      prev.map((r) => {
        const key = `fav_restaurant_${r.id}`;
        const saved = localStorage.getItem(key);
        return saved ? { ...r, isFavorite: saved === "1" } : { ...r, isFavorite: false };
      })
    );
    // re-run only when the list length changes (initial load)
  }, [restaurantsList.length]);

  /** Toggle favorite for a single restaurant */
  const toggleFavorite = (id) => {
    setRestaurantsList((prev) =>
      prev.map((restaurant) => {
        if (restaurant.id !== id) return restaurant;
        const nextFav = !restaurant.isFavorite;
        localStorage.setItem(`fav_restaurant_${id}`, nextFav ? "1" : "0");
        return { ...restaurant, isFavorite: nextFav };
      })
    );
  };

  /** Filtering */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return restaurantsList.filter((r) => {
      const textHit =
        !q ||
        r.name?.toLowerCase().includes(q) ||
        r.cuisine_type?.toLowerCase().includes(q) ||
        r.tags?.some((t) => t.toLowerCase().includes(q));
      if (!textHit) return false;

      // category filters
      if (selectedCategory === "All") return true;
      if (selectedCategory === "Deals") return !!r.offer;
      if (selectedCategory === "Promoted") return !!r.promoted;
      if (selectedCategory === "Fast & Cheap") {
        return normalizeFee(r.deliveryFee) <= 1.99 && minDeliveryMins(r.deliveryTime) <= 20;
      }
      // otherwise match category name against cuisine_type
      return r.cuisine_type?.toLowerCase().includes(selectedCategory.toLowerCase());
    });
  }, [restaurantsList, query, selectedCategory]);

  /** Sorting (recommended / earliest arrival / rating) */
  const sorted = useMemo(() => {
    const arr = [...filtered];

    if (sortBy === "recommended") {
      // Promoted first, then by rating (desc), then by earlier arrival
      arr.sort((a, b) => {
        const prom = Number(!!b.promoted) - Number(!!a.promoted);
        if (prom !== 0) return prom;
        const rate = (b.rating ?? 0) - (a.rating ?? 0);
        if (rate !== 0) return rate;
        return minDeliveryMins(a.deliveryTime) - minDeliveryMins(b.deliveryTime);
      });
    } else if (sortBy === "arrival_asc") {
      arr.sort(
        (a, b) => minDeliveryMins(a.deliveryTime) - minDeliveryMins(b.deliveryTime)
      );
    } else if (sortBy === "rating_desc") {
      arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return arr;
  }, [filtered, sortBy]);

  /** Reset all controls */
  const handleReset = () => {
    setQuery("");
    setSelectedCategory("All");
    setSortBy("recommended");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ bgcolor: ui.pageBg, minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Restaurants Near You
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Browse by category or search for your favorites.
        </Typography>

        {/* Search + Sort + Reset */}
        <Card sx={{ ...ui.card, mb: 2 }}>
          <SearchSortBar
            query={query}
            onQuery={setQuery}
            sortBy={sortBy}
            onSort={setSortBy}
            onReset={handleReset}
          />
        </Card>

        {/* Category chips */}
        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1, mb: 2 }}>
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
              size="small"
              clickable
              onClick={() => setSelectedCategory(c)}
              variant={selectedCategory === c ? "filled" : "outlined"}
              sx={{
                borderRadius: "999px",
                bgcolor: selectedCategory === c ? "black" : "white",
                color: selectedCategory === c ? "white" : "inherit",
                border: "1px solid #eef0f2",
                flex: "0 0 auto",
              }}
            />
          ))}
        </Box>

        {/* Results */}
        {sorted.length === 0 ? (
          <Card sx={{ ...ui.card }}>
            <Box sx={{ py: 6, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No results
              </Typography>
              <Typography color="text.secondary">
                Try adjusting your search or selecting a different category.
              </Typography>
            </Box>
          </Card>
        ) : (
          <Grid container spacing={3} alignItems="stretch">
            {sorted.map((r) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={r.id} sx={{ display: "flex" }}>
                <RestaurantCard
                  id={r.id}
                  name={r.name}
                  image={r.image}
                  rating={r.rating}
                  cuisine={r.cuisine_type}
                  distance={r.distance}
                  deliveryTime={r.deliveryTime}
                  deliveryFee={r.deliveryFee}
                  promoted={!!r.promoted}
                  offer={r.offer}                 // Optional: render inside RestaurantCard if supported
                  isFavorite={!!r.isFavorite}
                  onToggleFavorite={() => toggleFavorite(r.id)}
                  cta="View Menu"
                  toLink={`/restaurant/${r.id}`}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}


export default MenuPage;
