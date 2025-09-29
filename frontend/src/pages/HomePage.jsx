import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  LocalShipping as DeliveryIcon,
  CreditCard as PaymentIcon,
  LocalOffer as OfferIcon,
} from "@mui/icons-material";

function HomePage() {
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/menu/restaurants/`);
        if (!res.ok) throw new Error("Failed to load restaurants");
        const data = await res.json();
        setRestaurants(data);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, [API_URL]);

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(to right, #000000, #222222)",
          color: "white",
          py: { xs: 5, md: 8 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: 900, mx: "auto" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.4rem", md: "3.6rem" },
                letterSpacing: -0.5,
                mb: 2,
              }}
            >
              Order food anytime, anywhere
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                mb: 3,
                fontSize: { xs: "1.05rem", md: "1.25rem" },
              }}
            >
              Fresh meals from local favorites—delivered fast.
            </Typography>

            <Box sx={{ display: "inline-flex", gap: 1 }}>
              <Button
                component={RouterLink}
                to="/restaurants"
                variant="contained"
                sx={{
                  bgcolor: "white",
                  color: "black",
                  fontWeight: 700,
                  px: 3,
                  py: 1.4,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                Browse Restaurants
              </Button>
              <Button
                component={RouterLink}
                to="/deals"
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.6)",
                  fontWeight: 700,
                  px: 3,
                  py: 1.4,
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
                startIcon={<OfferIcon />}
              >
                View Deals
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", p: 3, borderRadius: "16px" }}>
              <RestaurantIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Wide Variety
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore hundreds of local spots and top-rated picks.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", p: 3, borderRadius: "16px" }}>
              <DeliveryIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Fast Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live tracking and reliable ETAs, every time.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", p: 3, borderRadius: "16px" }}>
              <PaymentIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Easy Payments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Secure checkout with cards and saved methods.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Restaurants Preview */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Popular Restaurants
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {restaurants.slice(0, 3).map((r) => (
              <Grid item xs={12} sm={6} md={4} key={r.id}>
                <Card
                  component={RouterLink}
                  to={`/restaurants/${r.id}`}
                  sx={{ p: 2, textDecoration: "none" }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {r.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {r.description || "Delicious meals available"}
                    </Typography>
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

export default HomePage;
