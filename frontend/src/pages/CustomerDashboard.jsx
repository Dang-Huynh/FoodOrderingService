import React from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Box,
  CardMedia,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  DirectionsBike as BikeIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";

/* ------------------------ UI TOKENS ------------------------ */
const ui = {
  pageBg: "#f5f5f5",
  card: {
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid #eef0f2",
  },
  blackBtn: { bgcolor: "black", color: "white", "&:hover": { bgcolor: "#333" } },
};

/* ------------------------ HELPERS ------------------------ */
const statusMeta = {
  Preparing: { color: "#FF6B35", icon: <ScheduleIcon sx={{ fontSize: 20, color: "#FF6B35" }} /> },
  "Out for delivery": { color: "#00B2FF", icon: <BikeIcon sx={{ fontSize: 20, color: "#00B2FF" }} /> },
  Delivered: { color: "#00C853", icon: <CheckIcon sx={{ fontSize: 20, color: "#00C853" }} /> },
};

const StatusDot = ({ color = "#666" }) => (
  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color, mr: 1 }} />
);

const SectionHeader = ({ icon, title, action }) => (
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {icon}
      <Typography variant="h6" sx={{ fontWeight: 700, ml: 1 }}>
        {title}
      </Typography>
    </Box>
    {action}
  </Box>
);

/* ------------------------ CARDS ------------------------ */
function ActiveOrderCard({ order }) {
  const meta = statusMeta[order.status] || { color: "#666", icon: <ScheduleIcon sx={{ fontSize: 20 }} /> };
  return (
    <Card sx={{ ...ui.card, background: "linear-gradient(135deg, #000 0%, #333 100%)", color: "white" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <StatusDot color={meta.color} />
          <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.7)" }}>
            ORDER IN PROGRESS
          </Typography>
        </Box>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {order.restaurantName}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mb: 2 }}>
              {order.items.join(" • ")}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              {meta.icon}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {order.status}
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
                  Estimated delivery: {order.estimatedDelivery}
                </Typography>
              </Box>
            </Box>

            <Button
              component={Link}
              to={`/order/${order.id}`}
              variant="contained"
              sx={{ bgcolor: "white", color: "black", fontWeight: 700, borderRadius: 1.5, px: 3 }}
            >
              Track Order
            </Button>
          </Grid>

          <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
            <CardMedia
              component="img"
              image={order.restaurantImage}
              alt={order.restaurantName}
              sx={{ width: 120, height: 120, borderRadius: 2, mx: "auto", border: "4px solid rgba(255,255,255,0.12)", objectFit: "cover" }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function ReorderCard({ recentOrders }) {
  return (
    <Card sx={{ ...ui.card, width: "100%" }}>
      <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
        <SectionHeader icon={<RestaurantIcon sx={{ color: "black" }} />} title="Reorder favorites" />
        <Grid container spacing={2}>
          {recentOrders.map((order) => (
            <Grid item xs={12} sm={6} key={order.id}>
              <Card
                sx={{ borderRadius: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #eef0f2", transition: "transform .2s, box-shadow .2s",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }, }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CardMedia component="img" image={order.restaurantImage} alt={order.restaurantName} sx={{ width: 44, height: 44, borderRadius: 1.5, mr: 1.5, objectFit: "cover" }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {order.restaurantName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${order.total.toFixed(2)} • {order.estimatedDelivery}
                      </Typography>
                    </Box>
                  </Box>

                  {/* We don't have restaurantId on order; route safely to /menu */}
                  <Button component={Link} to="/menu" variant="contained" fullWidth size="small" sx={{ ...ui.blackBtn, borderRadius: 1, fontWeight: 700 }}>
                    Reorder
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard({ onOpenCart }) {
  return (
    <Card sx={{ ...ui.card, width: "100%" }}>
      <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Quick actions
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 0.5 }}>
          <Button component={Link} to="/menu" variant="contained" sx={{ ...ui.blackBtn, py: 1.25, borderRadius: 1.5, fontWeight: 700 }} fullWidth>
            Browse Restaurants
          </Button>
          <Button component={Link} to="/orders" variant="outlined" sx={{ borderColor: "#eef0f2", color: "black", py: 1.25, borderRadius: 1.5, fontWeight: 700, "&:hover": { borderColor: "black", bgcolor: "rgba(0,0,0,0.04)" } }} fullWidth>
            View Order History
          </Button>
          <Button onClick={onOpenCart} variant="outlined" sx={{ borderColor: "#eef0f2", color: "black", py: 1.25, borderRadius: 1.5, fontWeight: 700, "&:hover": { borderColor: "black", bgcolor: "rgba(0,0,0,0.04)" } }} fullWidth>
            Open Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function SavedRestaurantsSection({ restaurants }) {
  return (
    <Card sx={{ ...ui.card }}>
      <CardContent sx={{ p: 3 }}>
        <SectionHeader
          icon={<FavoriteIcon sx={{ color: "#FF385C" }} />}
          title="Your saved restaurants"
          action={<Button component={Link} to="/saved" variant="text" sx={{ color: "black", fontWeight: 700 }}>View all</Button>}
        />

        <Grid container spacing={2}>
          {restaurants.map((r) => (
            <Grid item xs={12} sm={6} md={3} key={r.id} sx={{ display: "flex" }}>
              <Card sx={{ borderRadius: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #eef0f2", width: "100%", transition: "transform .2s, box-shadow .2s",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }, }}>
                <CardContent sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <CardMedia component="img" image={r.image} alt={r.name} sx={{ width: 48, height: 48, borderRadius: 1.5, mr: 1.5, objectFit: "cover" }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.name}
                      </Typography>
                      <Chip label={r.isOpen ? "Open" : "Closed"} size="small" color={r.isOpen ? "success" : "default"} sx={{ height: 20, fontSize: "0.7rem" }} />
                    </Box>
                  </Box>

                  <Typography variant="caption" color="text.secondary" noWrap>
                    {r.cuisine}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    ⭐ {r.rating} • {r.deliveryTime}
                  </Typography>

                  <Box sx={{ mt: "auto" }}>
                    <Button component={Link} to={`/restaurant/${r.id}`} variant="contained" size="small" fullWidth disabled={!r.isOpen} sx={{ ...ui.blackBtn, mt: 1, borderRadius: 1, fontWeight: 700 }}>
                      {r.isOpen ? "Order now" : "Currently closed"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

/* ------------------------ DEFAULT DATA (kept) ------------------------ */
const DEFAULT_ORDERS = [
  { id: 201, date: "2025-09-19", total: 19.75, status: "Preparing", restaurantName: "Curry House", restaurantImage: "https://picsum.photos/200/150?random=10", estimatedDelivery: "25-35 min", items: ["Chicken Tikka Masala", "Garlic Naan"] },
  { id: 202, date: "2025-09-12", total: 27.1, status: "Delivered", restaurantName: "Burger Hub", restaurantImage: "https://picsum.photos/200/150?random=11", estimatedDelivery: "20-30 min", items: ["Double Cheeseburger", "Fries", "Chocolate Shake"] },
  { id: 203, date: "2025-09-08", total: 32.45, status: "Delivered", restaurantName: "Sushi Express", restaurantImage: "https://picsum.photos/200/150?random=12", estimatedDelivery: "15-25 min", items: ["California Roll", "Miso Soup", "Edamame"] },
  { id: 204, date: "2025-09-05", total: 18.9, status: "Delivered", restaurantName: "Pizza Palace", restaurantImage: "https://picsum.photos/200/150?random=13", estimatedDelivery: "30-40 min", items: ["Margherita Pizza", "Garlic Bread"] },
];

const SAVED_RESTAURANTS = [
  { id: 1, name: "Pizza Palace", cuisine: "Italian • Pizza", rating: 4.6, deliveryTime: "25-35 min", image: "https://picsum.photos/100/100?random=1", isOpen: true },
  { id: 2, name: "Sushi Express", cuisine: "Japanese • Sushi", rating: 4.8, deliveryTime: "20-30 min", image: "https://picsum.photos/100/100?random=2", isOpen: true },
  { id: 3, name: "Burger Hub", cuisine: "American • Burgers", rating: 4.3, deliveryTime: "30-40 min", image: "https://picsum.photos/100/100?random=3", isOpen: false },
  { id: 4, name: "Thai Orchid", cuisine: "Thai • Asian", rating: 4.7, deliveryTime: "35-45 min", image: "https://picsum.photos/100/100?random=4", isOpen: true },
];

/* ------------------------ PAGE ------------------------ */
export default function CustomerDashboard({ orders = DEFAULT_ORDERS }) {
  const { openCart } = useCart();
  const activeOrder = orders.find((o) => o.status !== "Delivered");
  const recentOrders = orders.slice(0, 4);

  return (
    <Box sx={{ bgcolor: ui.pageBg, minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Good evening, Alex!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            What would you like to order today?
          </Typography>
        </Box>

        <Grid container spacing={3} alignItems="stretch">
          {/* Active Order Tracker */}
          {activeOrder && (
            <Grid item xs={12}>
              <ActiveOrderCard order={activeOrder} />
            </Grid>
          )}

          {/* Reorder + Quick actions */}
          <Grid item xs={12} md={activeOrder ? 8 : 6} sx={{ display: "flex" }}>
            <ReorderCard recentOrders={recentOrders} />
          </Grid>

          <Grid item xs={12} md={activeOrder ? 4 : 6} sx={{ display: "flex" }}>
            <QuickActionsCard onOpenCart={openCart} />
          </Grid>

          {/* Saved Restaurants */}
          <Grid item xs={12}>
            <SavedRestaurantsSection restaurants={SAVED_RESTAURANTS} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
