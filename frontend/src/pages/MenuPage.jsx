import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Chip,
  Box,
  Container,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  LocalOffer as OfferIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  Search as SearchIcon,
  Tune as TuneIcon,
  RestartAlt as ResetIcon,
} from "@mui/icons-material";
import { getRestaurants } from "../api";

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
  "Pizza",
  "Sushi",
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

/** ---------- Helpers ---------- */
const normalizeFee = (feeStr) => {
  if (!feeStr) return 0;
  if (String(feeStr).toLowerCase().includes("free")) return 0;
  const m = String(feeStr).match(/\$([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
};

// Accepts "15-25 min", "20–30 min", "25 min", "25-35m"
const minDeliveryMins = (timeStr) => {
  if (!timeStr) return Number.POSITIVE_INFINITY;
  const m = String(timeStr).match(/(\d+)\s*([–-]\s*\d+)?/);
  return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
};

function MenuPage() {
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // NEW: sort & reset
  // "recommended" | "arrival_asc" | "rating_desc"
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("menu_sort") || "recommended"
  );

  /** Fetch restaurants from backend */
  useEffect(() => {
    let mounted = true;
    getRestaurants()
      .then((data) => {
        if (!mounted) return;
        setRestaurantsList(data);
      })
      .catch((err) => console.error(err));
    return () => (mounted = false);
  }, []);

  /** Persist & load favorites */
  useEffect(() => {
    setRestaurantsList((prev) =>
      prev.map((r) => {
        const key = `fav_restaurant_${r.id}`;
        const saved = localStorage.getItem(key);
        return saved ? { ...r, isFavorite: saved === "1" } : { ...r, isFavorite: false };
      })
    );
  }, [restaurantsList.length]);

  /** Persist sort choice */
  useEffect(() => {
    localStorage.setItem("menu_sort", sortBy);
  }, [sortBy]);

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

  /** Filtering (unchanged fields) */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurantsList.filter((r) => {
      const textHit =
        !q ||
        r.name?.toLowerCase().includes(q) ||
        r.cuisine_type?.toLowerCase().includes(q) ||
        r.tags?.some((t) => t.toLowerCase().includes(q));
      if (!textHit) return false;

      if (selectedCategory === "All") return true;
      if (selectedCategory === "Deals") return !!r.offer;
      if (selectedCategory === "Promoted") return !!r.promoted;
      if (selectedCategory === "Fast & Cheap") {
        return (
          normalizeFee(r.deliveryFee) <= 1.99 &&
          minDeliveryMins(r.deliveryTime) <= 20
        );
      }

      // otherwise match category name against cuisine_type
      return r.cuisine_type?.toLowerCase().includes(selectedCategory.toLowerCase());
    });
  }, [restaurantsList, query, selectedCategory]);

  /** NEW: Sorting (recommended / earliest arrival / rating) */
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

  /** NEW: Reset all controls */
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

        {/* Search + Sort + Reset (NEW SECTION) */}
        <Card sx={{ ...ui.card, mb: 2 }}>
          <Box sx={{ p: 1.5 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <TextField
                fullWidth
                placeholder="Search restaurants or cuisines…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                  select
                  size="small"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort"
                  sx={{ minWidth: 220 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TuneIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="recommended">Recommended</MenuItem>
                  <MenuItem value="arrival_asc">Earliest arrival</MenuItem>
                  <MenuItem value="rating_desc">Rating (High → Low)</MenuItem>
                </TextField>

                <Button
                  onClick={handleReset}
                  variant="outlined"
                  startIcon={<ResetIcon />}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Reset
                </Button>
              </Box>
            </Stack>
          </Box>
        </Card>

        {/* Category chips (unchanged) */}
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

        {/* Results (unchanged, but uses `sorted`) */}
        {sorted.length === 0 ? (
          <Card sx={{ ...ui.card }}>
            <CardContent sx={{ py: 6, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No results
              </Typography>
              <Typography color="text.secondary">
                Try adjusting your search or selecting a different category.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3} alignItems="stretch">
            {sorted.map((restaurant) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={restaurant.id}
                sx={{ display: "flex" }}
              >
                <Card
                  sx={{
                    ...ui.card,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {/* Promoted badge */}
                  {restaurant.promoted && (
                    <Chip
                      label="PROMOTED"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: "black",
                        color: "white",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        zIndex: 1,
                      }}
                    />
                  )}

                  {/* Favorite icon */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "white",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 1,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                    }}
                    onClick={() => toggleFavorite(restaurant.id)}
                    aria-label={
                      restaurant.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {restaurant.isFavorite ? (
                      <FavoriteIcon sx={{ color: "red" }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </Box>

                  {/* Image */}
                  <Box sx={{ position: "relative", pt: "56.25%" }}>
                    <CardMedia
                      component="img"
                      image={restaurant.image}
                      alt={restaurant.name}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  {/* Content */}
                  <CardContent
                    sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {restaurant.name}
                      </Typography>
                      <Chip
                        icon={<StarIcon sx={{ color: "white", fontSize: 16 }} />}
                        label={restaurant.rating}
                        size="small"
                        sx={{
                          backgroundColor: "#3d8f3d",
                          color: "white",
                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {restaurant.cuisine_type}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" noWrap>
                      {restaurant.distance} • {restaurant.deliveryTime} • {restaurant.deliveryFee}
                    </Typography>

                    {/* Offer row */}
                    <Box sx={{ minHeight: 24, display: "flex", alignItems: "center", mt: 1 }}>
                      {restaurant.offer && (
                        <>
                          <OfferIcon sx={{ color: "#e76f51", fontSize: 18, mr: 0.5 }} />
                          <Typography variant="body2" sx={{ color: "#e76f51", fontWeight: 600 }}>
                            {restaurant.offer}
                          </Typography>
                        </>
                      )}
                    </Box>

                    {/* Bottom CTA */}
                    <Box sx={{ mt: "auto" }}>
                      <Button
                        component={Link}
                        to={`/restaurant/${restaurant.id}`}
                        variant="contained"
                        fullWidth
                        sx={{ ...ui.blackBtn, borderRadius: 1.5, mt: 1, fontWeight: 700 }}
                      >
                        View Menu
                      </Button>
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
