import React, { useMemo, useState, useEffect } from "react";
import { Container, Typography, Grid } from "@mui/material";
import RestaurantCard from "../components/cards/RestaurantCard";
import { ui } from "../utils/ui";

// Fallback mock data
const DEFAULT_SAVED = [
  { id: 1, name: "Pizza Palace", rating: 4.6, cuisine: "Italian • Pizza", distance: "1.2 km", deliveryTime: "25-35 min", deliveryFee: "$2.99 delivery", image: "https://picsum.photos/400/250?random=1" },
  { id: 2, name: "Sushi Express", rating: 4.8, cuisine: "Japanese • Sushi", distance: "0.8 km", deliveryTime: "20-30 min", deliveryFee: "$3.49 delivery", image: "https://picsum.photos/400/250?random=2" },
];

export default function SavedRestaurantsPage({ saved: initialSaved = DEFAULT_SAVED }) {
  // Persist “saved” in localStorage so it stays consistent with the heart toggle
  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem("saved_restaurants_list");
      return raw ? JSON.parse(raw) : initialSaved;
    } catch {
      return initialSaved;
    }
  });

  useEffect(() => {
    try { localStorage.setItem("saved_restaurants_list", JSON.stringify(saved)); } catch {}
  }, [saved]);

  // Build quick lookup of favorites from per-restaurant keys (to stay consistent with MenuPage)
  const withFavFlag = useMemo(
    () =>
      saved.map((r) => {
        const favKey = `fav_restaurant_${r.id}`;
        const isFavorite = localStorage.getItem(favKey) === "1";
        return { ...r, isFavorite };
      }),
    [saved]
  );

  const toggleFavorite = (id) => {
    const favKey = `fav_restaurant_${id}`;
    const next = localStorage.getItem(favKey) === "1" ? "0" : "1";
    localStorage.setItem(favKey, next);
    // if user “unsaves”, remove from this page’s list
    if (next === "0") {
      setSaved((prev) => prev.filter((r) => String(r.id) !== String(id)));
    } else {
      setSaved((prev) => prev.map((r) => (String(r.id) === String(id) ? r : r)));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: ui.pageBg }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Saved Restaurants
      </Typography>

      {withFavFlag.length === 0 ? (
        <EmptyState
          title="You have no saved restaurants yet"
          subtitle="Tap the heart on any restaurant to save it here."
        />
      ) : (
        <Grid container spacing={2}>
          {withFavFlag.map((r) => (
            <Grid item xs={12} sm={6} md={3} key={r.id}>
              <RestaurantCard
                restaurant={r}
                onToggleFavorite={toggleFavorite}
                showFavorite
                ctaLabel="View Menu"
                ctaTo={`/restaurant/${r.id}`}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
