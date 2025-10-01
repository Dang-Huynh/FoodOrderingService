import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  IconButton,
  Container,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Search as SearchIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";

// shared hook + components
import useRestaurantMenu from "../hooks/useRestaurantMenu";
import { usePersistedState } from "../hooks/usePersistedState";
import DishCard from "../components/cards/DishCard";

/** ---------- Helpers ---------- */
const clamp = (lines) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

/** ---------- Page ---------- */
export default function RestaurantMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add, openCart } = useCart();

  // persist search across visits per-restaurant
  const [searchQuery, setSearchQuery] = usePersistedState(
    `menu_search_${id}`,
    ""
  );
  const [tab, setTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // restaurant, sections, grouped (filtered by searchQuery)
  const {
    restaurant,
    grouped,
    sections,
    loading: hookLoading,
    error: hookError,
  } = useRestaurantMenu(id, searchQuery);

  useEffect(() => {
    setLoading(hookLoading);
    setError(hookError || null);
  }, [hookLoading, hookError]);

  // favorites persistence
  useEffect(() => {
    const favKey = `fav_restaurant_${id}`;
    const saved = localStorage.getItem(favKey);
    setIsFavorite(saved ? saved === "1" : false);
  }, [id]);

  useEffect(() => {
    const favKey = `fav_restaurant_${id}`;
    localStorage.setItem(favKey, isFavorite ? "1" : "0");
  }, [id, isFavorite]);

  // remember current restaurant id and enforce single-restaurant cart
  useEffect(() => {
    localStorage.setItem("lastRestaurantId", String(id));
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      if (saved.length) {
        const rid = saved[0]?.restaurantId;
        if (rid && String(rid) !== String(id)) {
          localStorage.removeItem("cart");
        }
      }
    } catch {}
  }, [id]);

  const addToCart = (item) => {
    if (!restaurant || !restaurant.id) return;
    const itemWithRestaurant = { ...item, restaurantId: restaurant.id };
    add(itemWithRestaurant);
    try {
      const saved = JSON.parse(localStorage.getItem("cart") || "[]");
      localStorage.setItem("cart", JSON.stringify([...saved, itemWithRestaurant]));
    } catch {}
    openCart();
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container>
        <Typography variant="h6" color="error" mt={4}>
          {error}
        </Typography>
      </Container>
    );

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", pb: 8 }}>
      {/* Hero */}
      <Box sx={{ position: "relative" }}>
        {restaurant?.image && (
          <CardMedia
            component="img"
            height="260"
            image={restaurant.image}
            alt={restaurant.name}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.0) 100%)",
          }}
        />
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            backgroundColor: "white",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={() => setIsFavorite((f) => !f)}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "white",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          {isFavorite ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon />}
        </IconButton>

        {/* Info overlay */}
        <Container maxWidth="lg">
          <Box
            sx={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: "white",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {restaurant.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {restaurant.cuisine_type} • {restaurant.distance} • {restaurant.deliveryTime} •{" "}
                {restaurant.deliveryFee}
              </Typography>
              {restaurant.offer && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <OfferIcon sx={{ fontSize: 18, mr: 0.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {restaurant.offer}
                  </Typography>
                </Box>
              )}
            </Box>
            <Chip
              icon={<StarIcon sx={{ color: "white", fontSize: 16 }} />}
              label={restaurant.rating}
              sx={{ bgcolor: "#3d8f3d", color: "white", fontWeight: 700 }}
            />
          </Box>
        </Container>
      </Box>

      {/* Sticky Tabs + Search */}
      <Box
        sx={{
          position: "sticky",
          top: 64,
          zIndex: 10,
          bgcolor: "#f5f5f5",
          borderBottom: "1px solid #eee",
          py: 1,
        }}
      >
        <Container maxWidth="lg">
          <Card
            sx={{
              borderRadius: 2,
              border: "1px solid #eef0f2",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          >
            <Box sx={{ p: 1.5 }}>
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for dishes…"
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ borderTop: "1px solid #eef0f2" }}>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="menu categories"
                sx={{
                  px: 1,
                  "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
                  "& .Mui-selected": { color: "black" },
                  "& .MuiTabs-indicator": { backgroundColor: "black" },
                }}
              >
                <Tab label="All" />
                {sections.map((s) => (
                  <Tab key={s} label={s} />
                ))}
              </Tabs>
            </Box>
          </Card>
        </Container>
      </Box>

      {/* Menu Items */}
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        {tab === 0
          ? Object.entries(grouped).map(([section, items]) => (
              <Section key={section} title={section} items={items}>
                <ScrollableDishRow items={items} onAdd={addToCart} />
              </Section>
            ))
          : sections[tab - 1] && (
              <Section
                title={sections[tab - 1]}
                items={grouped[sections[tab - 1]] || []}
              >
                <ScrollableDishRow
                  items={grouped[sections[tab - 1]] || []}
                  onAdd={addToCart}
                />
              </Section>
            )}

        {/* empty state when searching "All" and nothing matches */}
        {tab === 0 && Object.keys(grouped).length === 0 && (
          <Card sx={{ borderRadius: 2, border: "1px solid #eef0f2" }}>
            <CardContent sx={{ py: 6, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No dishes match your search
              </Typography>
              <Typography color="text.secondary">
                Try a different keyword or switch the category.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}

/** ---------- Sections & Row ---------- */
function Section({ title, items, children }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        {title} ({items.length})
      </Typography>
      {children}
    </Box>
  );
}

function ScrollableDishRow({ items, onAdd }) {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, items]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!items.length) {
    return <Typography color="text.secondary">No dishes here yet.</Typography>;
  }

  return (
    <Box sx={{ position: "relative" }}>
      {showLeftArrow && (
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: -16,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "white",
            boxShadow: 2,
            zIndex: 2,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      <Box
        ref={scrollContainerRef}
        onScroll={checkScroll}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
          pb: 2,
          mx: -0.5,
        }}
      >
        {items.map((item) => (
          <Box key={item.id} sx={{ minWidth: 280, maxWidth: 280 }}>
            <DishCard item={item} onAdd={() => onAdd(item)} />
          </Box>
        ))}
      </Box>

      {showRightArrow && (
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: -16,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "white",
            boxShadow: 2,
            zIndex: 2,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
}
