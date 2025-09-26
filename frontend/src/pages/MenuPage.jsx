import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card, CardContent, CardMedia, Typography, Grid, Button, Chip, Box, Container, TextField, InputAdornment
} from "@mui/material";
import { LocalOffer as OfferIcon, Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon, Star as StarIcon, Search as SearchIcon } from "@mui/icons-material";

const ui = {
  pageBg: "#f5f5f5",
  card: { borderRadius: 6, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #eef0f2" },
  blackBtn: { backgroundColor: "black", color: "white", "&:hover": { backgroundColor: "#333" } },
};

const categories = ["All","Pizza","Sushi","Burgers","Indian","Vegan","Desserts","Mexican","Chinese","Breakfast","Middle Eastern","Vietnamese","Deals","Promoted","Fast & Cheap"];

const normalizeFee = (feeStr) => {
  if (!feeStr) return 0;
  if (feeStr.toLowerCase().includes("free")) return 0;
  const m = feeStr.match(/\$([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
};
const minDeliveryMins = (timeStr) => {
  if (!timeStr) return 30;
  const m = timeStr.match(/(\d+)\s*-\s*\d+/);
  return m ? parseInt(m[1], 10) : 30;
};

function MenuPage() {
  const [originalList, setOriginalList] = useState([]);
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/menu/restaurants/`);
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        const data = await res.json();

        const restaurantsWithFav = (data || []).map((r) => {
          const key = `fav_restaurant_${r.id}`;
          const saved = localStorage.getItem(key);
          return saved ? { ...r, isFavorite: saved === "1" } : r;
        });

        setOriginalList(restaurantsWithFav);
        setRestaurantsList(restaurantsWithFav);
      } catch (err) {
        console.error(err);
        setOriginalList([]);
        setRestaurantsList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const toggleFavorite = (id) => {
    setRestaurantsList((prev) =>
      prev.map((restaurant) => {
        if (restaurant.id !== id) return restaurant;
        const nextFav = !restaurant.isFavorite;
        localStorage.setItem(`fav_restaurant_${id}`, nextFav ? "1" : "0");
        return { ...restaurant, isFavorite: nextFav };
      })
    );
    setOriginalList((prev) =>
      prev.map((restaurant) => {
        if (restaurant.id !== id) return restaurant;
        const nextFav = !restaurant.isFavorite;
        return { ...restaurant, isFavorite: nextFav };
      })
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return originalList.filter((r) => {
      const name = r.name || "";
      const cuisine = r.cuisine || "";
      const tags = r.tags || [];

      const textHit =
        !q ||
        name.toLowerCase().includes(q) ||
        cuisine.toLowerCase().includes(q) ||
        tags.some((t) => t.toLowerCase().includes(q));
      if (!textHit) return false;

      if (selectedCategory === "All") return true;
      if (selectedCategory === "Deals") return !!r.offer;
      if (selectedCategory === "Promoted") return !!r.promoted;
      if (selectedCategory === "Fast & Cheap")
        return normalizeFee(r.deliveryFee) <= 1.99 && minDeliveryMins(r.deliveryTime) <= 20;

      const inTags = tags.includes(selectedCategory);
      const inCuisine = cuisine.toLowerCase().includes(selectedCategory.toLowerCase());
      return inTags || inCuisine;
    });
  }, [originalList, query, selectedCategory]);

  return (
    <Box sx={{ bgcolor: ui.pageBg, minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Restaurants Near You
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Browse by category or search for your favorites.
        </Typography>

        <Card sx={{ ...ui.card, mb: 2 }}>
          <Box sx={{ p: 1.5 }}>
            <TextField
              fullWidth
              placeholder="Search restaurants or cuisines…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            />
          </Box>
        </Card>

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

        {loading ? (
          <Typography sx={{ textAlign: "center", py: 6 }}>Loading restaurants...</Typography>
        ) : filtered.length === 0 ? (
          <Card sx={{ ...ui.card }}>
            <CardContent sx={{ py: 6, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>No results</Typography>
              <Typography color="text.secondary">Try adjusting your search or selecting a different category.</Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3} alignItems="stretch">
            {filtered.map((restaurant) => (
              <Grid key={restaurant.id} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    ...ui.card, display: "flex", flexDirection: "column", width: "100%", position: "relative", overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(0,0,0,0.12)" },
                  }}
                >
                  {restaurant.promoted && (
                    <Chip label="PROMOTED" size="small" sx={{ position: "absolute", top: 10, left: 10, backgroundColor: "black", color: "white", fontSize: "0.7rem", fontWeight: 700, zIndex: 1 }} />
                  )}

                  <Box
                    sx={{ position: "absolute", top: 10, right: 10, backgroundColor: "white", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 1, boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}
                    onClick={() => toggleFavorite(restaurant.id)}
                  >
                    {restaurant.isFavorite ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon />}
                  </Box>

                  <Box sx={{ position: "relative", pt: "56.25%" }}>
                    <CardMedia component="img" image={restaurant.image} alt={restaurant.name} sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  </Box>

                  <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{restaurant.name || ""}</Typography>
                      <Chip icon={<StarIcon sx={{ color: "white", fontSize: 16 }} />} label={restaurant.rating || 0} size="small" sx={{ backgroundColor: "#3d8f3d", color: "white", fontWeight: 700 }} />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{restaurant.cuisine || ""}</Typography>

                    <Typography variant="caption" color="text.secondary" noWrap>{restaurant.distance || ""} • {restaurant.deliveryTime || ""} • {restaurant.deliveryFee || ""}</Typography>

                    <Box sx={{ minHeight: 24, display: "flex", alignItems: "center", mt: 1 }}>
                      {restaurant.offer && (<><OfferIcon sx={{ color: "#e76f51", fontSize: 18, mr: 0.5 }} /><Typography variant="body2" sx={{ color: "#e76f51", fontWeight: 600 }}>{restaurant.offer}</Typography></>)}
                    </Box>

                    <Box sx={{ mt: "auto" }}>
                      <Button component={Link} to={`/restaurant/${restaurant.id}`} variant="contained" fullWidth sx={{ ...ui.blackBtn, borderRadius: 1.5, mt: 1, fontWeight: 700 }}>View Menu</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default MenuPage;
