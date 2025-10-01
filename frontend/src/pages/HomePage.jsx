import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  LocalShipping as DeliveryIcon,
  CreditCard as PaymentIcon,
  LocalOffer as OfferIcon,
} from "@mui/icons-material";

function HomePage() {
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
                to="/menu"
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
                to="/menu?category=Deals"
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
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: "#f5f5f5",
                    borderRadius: "50%",
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RestaurantIcon sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Wide Variety
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore hundreds of local spots and top-rated picks.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: "#f5f5f5",
                    borderRadius: "50%",
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DeliveryIcon sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Fast Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Live tracking and reliable ETAs, every time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: "#f5f5f5",
                    borderRadius: "50%",
                    width: 80,
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PaymentIcon sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                  Easy Payments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Secure checkout with cards and saved methods.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;
