import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
import { getRestaurant } from "../api";


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

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({}); // grouped by category
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // fetch restaurant + grouped menu via API helper
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getRestaurant(id);
        if (!mounted) return;
        setRestaurant(data);
        setMenu(data.menu || {});
        setSections(Object.keys(data.menu || {}));
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError("Failed to load restaurant or menu data.");
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

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

  const filterItems = useCallback(
    (items) =>
      items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      ),
    [searchQuery]
  );

  const grouped = useMemo(() => {
    const out = {};
    sections.forEach((s) => {
      const list = Array.isArray(menu[s]) ? filterItems(menu[s]) : [];
      if (list.length) out[s] = list;
    });
    return out;
  }, [sections, menu, filterItems]);

  // remember current restaurant id and enforce single-restaurant cart
  useEffect(() => {
    // remember last restaurant visited (used to backfill old cart items)
    localStorage.setItem("lastRestaurantId", String(id));

    // OPTIONAL: if cart exists from another restaurant, clear it
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
    if (!restaurant || !restaurant.id) {
    console.warn("Tried to add item before restaurant loaded");
    return;
  }

    const itemWithRestaurant  = { ...item, restaurantId: restaurant.id };
    add(itemWithRestaurant );              // your CartContext add()
    // also keep raw storage compatible if other code reads localStorage directly
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

      {/* Sticky Tabs */}
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
              <Section key={section} title={section} items={items} onAdd={addToCart} />
            ))
          : sections[tab - 1] && (
              <Section
                title={sections[tab - 1]}
                items={grouped[sections[tab - 1]] || []}
                onAdd={addToCart}
              />
            )}
      </Container>
    </Box>
  );
}

/** ---------- Section ---------- */
function Section({ title, items, onAdd }) {
  if (!items || !items.length)
    return (
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        No dishes found.
      </Typography>
    );
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        {title} ({items.length})
      </Typography>
      <ScrollableDishGrid items={items} onAdd={onAdd} />
    </Box>
  );
}

/** ---------- Scrollable Dish Grid ---------- */
function ScrollableDishGrid({ items, onAdd }) {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
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
      scrollContainerRef.current.scrollBy({
        left: direction === "right" ? 300 : -300,
        behavior: "smooth",
      });
    }
  };

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

/** ---------- Dish Card ---------- */
function DishCard({ item, onAdd }) {
  const TITLE_LINES = 1;
  const DESC_LINES = 2;
  const TITLE_LH = 1.35;
  const DESC_LH = 1.45;
  const CARD_HEIGHT = 360;

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid #eef0f2",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: CARD_HEIGHT,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box sx={{ position: "relative", pt: "62%", flexShrink: 0 }}>
        <CardMedia
          component="img"
          image={item.image}
          alt={item.name}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
      </Box>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          p: 2,
          height: `calc(${CARD_HEIGHT}px - 62%)`,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            lineHeight: TITLE_LH,
            height: `${TITLE_LINES * TITLE_LH}em`,
            mb: 0.5,
            ...clamp(TITLE_LINES),
          }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: DESC_LH,
            height: `${DESC_LINES * DESC_LH}em`,
            mb: 1,
            flexGrow: 1,
            ...clamp(DESC_LINES),
          }}
        >
          {item.description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: "auto",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            ${Number(item.price).toFixed(2)}
          </Typography>
          <Button
            onClick={onAdd}
            variant="contained"
            size="small"
            sx={{
              bgcolor: "black",
              color: "white",
              borderRadius: 999,
              px: 2,
              fontWeight: 700,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}