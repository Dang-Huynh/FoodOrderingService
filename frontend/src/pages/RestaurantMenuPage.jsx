import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
  Box,
  Chip,
  IconButton,
  Container,
  Tabs,
  Tab,
  AppBar,
  TextField,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";

// --- Helper: group menu items by category ---
function groupByCategory(items) {
  const grouped = {};
  items.forEach((item) => {
    const category = item.category || "Other";
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(item);
  });
  return grouped;
}

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { add, openCart } = useCart();

  // Fetch restaurant + menu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const base = import.meta.env.VITE_API_URL.replace(/\/$/, "");

        // 1. Restaurant details
        const res1 = await fetch(`${base}/menu/restaurants/${id}/`);
        if (!res1.ok) throw new Error("Failed to fetch restaurant details");
        const restaurantData = await res1.json();

        // 2. Menu items
        const res2 = await fetch(`${base}/menu/restaurants/${id}/menu/`);
        if (!res2.ok) throw new Error("Failed to fetch menu items");
        const menuData = await res2.json();

        // 3. Combine
        setRestaurant({
          ...restaurantData,
          menu: groupByCategory(menuData),
        });

        // Load favorite
        const favKey = `fav_restaurant_${id}`;
        const savedFav = localStorage.getItem(favKey);
        setIsFavorite(savedFav ? savedFav === "1" : false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Save favorite to localStorage
  useEffect(() => {
    if (restaurant) {
      localStorage.setItem(`fav_restaurant_${id}`, isFavorite ? "1" : "0");
    }
  }, [id, isFavorite, restaurant]);

  const sections = useMemo(
    () => (restaurant ? Object.keys(restaurant.menu || {}) : []),
    [restaurant]
  );

  const filterItems = useCallback(
    (items) =>
      items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ),
    [searchQuery]
  );

  const groupedFiltered = useMemo(() => {
    if (!restaurant) return {};
    const out = {};
    sections.forEach((s) => {
      const list = filterItems(restaurant.menu[s] || []);
      if (list.length) out[s] = list;
    });
    return out;
  }, [sections, restaurant, filterItems]);

  const addToCart = (item) => {
    add(item);
    openCart();
  };

  if (loading) return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  if (error) return <Typography color="error" sx={{ p: 4 }}>{error}</Typography>;
  if (!restaurant) return <Typography sx={{ p: 4 }}>Restaurant not found.</Typography>;

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", pb: 10 }}>
      {/* Header */}
      <Box sx={{ position: "relative" }}>
        <CardMedia component="img" height="250" image={restaurant.image} alt={restaurant.name} />
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ position: "absolute", top: 16, left: 16, backgroundColor: "white", "&:hover": { backgroundColor: "#f0f0f0" } }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={() => setIsFavorite((f) => !f)}
          sx={{ position: "absolute", top: 16, right: 16, backgroundColor: "white", "&:hover": { backgroundColor: "#f0f0f0" } }}
        >
          {isFavorite ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      <Container maxWidth="lg">
        {/* Restaurant info */}
        <Card sx={{ mt: -4, borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", position: "relative", zIndex: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>{restaurant.name}</Typography>
              <Chip
                icon={<StarIcon sx={{ color: "white", fontSize: "16px" }} />}
                label={restaurant.rating}
                size="small"
                sx={{ backgroundColor: "#3d8f3d", color: "white", fontWeight: 600, fontSize: "0.8rem" }}
              />
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {restaurant.cuisine}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {restaurant.distance} • {restaurant.deliveryTime} • {restaurant.deliveryFee}
            </Typography>

            {restaurant.offer && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <OfferIcon sx={{ color: "#e76f51", fontSize: "18px", mr: 0.5 }} />
                <Typography variant="body2" sx={{ color: "#e76f51", fontWeight: 500 }}>
                  {restaurant.offer}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Search */}
        <Box sx={{ mt: 3 }}>
          <Card sx={{ borderRadius: "16px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #eef0f2" }}>
            <Box sx={{ display: "flex", alignItems: "center", p: 1.5, width: "100%" }}>
              <SearchIcon sx={{ color: "text.secondary", mx: 1 }} />
              <TextField
                placeholder="Search for dishes..."
                variant="standard"
                InputProps={{ disableUnderline: true }}
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>
          </Card>
        </Box>

        {/* Tabs */}
        <Box sx={{ bgcolor: "background.paper", mt: 3, borderRadius: "12px" }}>
          <AppBar position="static" color="default" sx={{ borderRadius: "12px 12px 0 0" }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="menu categories"
              sx={{
                "& .MuiTab-root": { fontWeight: 600 },
                "& .Mui-selected": { color: "black" },
                "& .MuiTabs-indicator": { backgroundColor: "black" },
              }}
            >
              <Tab label="All" />
              {sections.map((section) => <Tab key={section} label={section} />)}
            </Tabs>
          </AppBar>
        </Box>

        {/* Menu content */}
        <Box sx={{ mt: 3 }}>
          {tab === 0 ? (
            <Box>
              {Object.entries(groupedFiltered).map(([section, items]) => (
                <SectionBlock key={section} title={section}>
                  <Grid container spacing={2}>
                    {items.map((item) => (
                      <Grid item xs={12} sm={6} key={`${section}-${item.id}`}>
                        <MenuCard item={item} onAdd={() => addToCart(item)} />
                      </Grid>
                    ))}
                  </Grid>
                </SectionBlock>
              ))}
              {Object.keys(groupedFiltered).length === 0 && (
                <Typography color="text.secondary">No dishes match your search.</Typography>
              )}
            </Box>
          ) : (
            <Box>
              <SectionBlock title={sections[tab - 1]}>
                <Grid container spacing={2}>
                  {filterItems(restaurant.menu[sections[tab - 1]] || []).map((item) => (
                    <Grid item xs={12} sm={6} key={`${sections[tab - 1]}-${item.id}`}>
                      <MenuCard item={item} onAdd={() => addToCart(item)} />
                    </Grid>
                  ))}
                </Grid>
                {filterItems(restaurant.menu[sections[tab - 1]] || []).length === 0 && (
                  <Typography color="text.secondary">No dishes match your search.</Typography>
                )}
              </SectionBlock>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

/** --- Small components --- */
function SectionBlock({ title, children }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, pl: 1 }}>{title}</Typography>
      {children}
    </Box>
  );
}

function MenuCard({ item, onAdd }) {
  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 6px 12px rgba(0,0,0,0.15)" },
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", p: 2 }}>
        <Box sx={{ flex: 1, mr: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{item.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{item.description}</Typography>
          <Typography variant="body1" fontWeight="bold">
            ${Number(item.price)?.toFixed(2) || "0.00"}
          </Typography>
        </Box>
        <Box sx={{ width: 100, height: 100, position: "relative" }}>
          <CardMedia component="img" height="100" image={item.image} alt={item.name} sx={{ borderRadius: "8px" }} />
          <Button
            variant="contained"
            size="small"
            sx={{
              position: "absolute",
              bottom: -10,
              right: 0,
              backgroundColor: "black",
              color: "white",
              borderRadius: "16px",
              minWidth: "auto",
              px: 1.5,
              fontWeight: 600,
              "&:hover": { backgroundColor: "#333" },
            }}
            onClick={onAdd}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
