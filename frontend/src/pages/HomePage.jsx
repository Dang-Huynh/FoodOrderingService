import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Container
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  LocalShipping as DeliveryIcon,
  CreditCard as PaymentIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";

function HomePage() {
  const [address, setAddress] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return; 
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/menu/restaurants/?q=${query}&address=${address}`
      );

      if (!response.ok) throw new Error("Failed to fetch results");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(to right, #000000, #222222)",
          color: "white",
          py: { xs: 4, md: 6 },
          px: 2,
          position: "relative",
          zIndex: 1
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto" }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 700, fontSize: { xs: "2.5rem", md: "3.5rem" }, mb: 2 }}
            >
              Order food anytime, anywhere
            </Typography>
            <Typography
              variant="h6"
              sx={{ opacity: 0.9, mb: 4, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
            >
              Fresh meals delivered to your door in minutes.
            </Typography>

            {/* Search Bar */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
                maxWidth: 1000,
                mx: "auto",
                bgcolor: "white",
                borderRadius: "28px",
                p: 1,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                <LocationIcon sx={{ color: "text.secondary", ml: 1, mr: 1 }} />
                <TextField
                  placeholder="Enter delivery address"
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  fullWidth
                  sx={{ mr: 1 }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", flex: 2 }}>
                <SearchIcon sx={{ color: "text.secondary", ml: 1, mr: 1 }} />
                <TextField
                  placeholder="Search for restaurants or dishes..."
                  variant="standard"
                  InputProps={{ disableUnderline: true }}
                  fullWidth
                  sx={{ mr: 1 }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Box>
              <Button
                variant="contained"
                sx={{
                  borderRadius: "24px",
                  py: 1.5,
                  px: 3,
                  fontWeight: 600,
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": { backgroundColor: "#333" }
                }}
                onClick={handleSearch}
              >
                {loading ? "Searching..." : "Find Food"}
              </Button>
            </Box>

            {/* Search Results */}
            <Box sx={{ mt: 4 }}>
              {error && <Typography color="error">{error}</Typography>}
              {results.length > 0 && (
                <>
                  <Typography variant="h5" sx={{ mb: 2 }}>Results:</Typography>
                  <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                    gap: 2
                  }}>
                    {results.map((item) => (
                      <Card key={item.id} sx={{ p: 2 }}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                      </Card>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h4" sx={{ textAlign: "center", fontWeight: 600, mb: 4 }}>
          Why choose us?
        </Typography>
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          gap: 4
        }}>
          {[
            { icon: RestaurantIcon, title: "Wide Variety", desc: "Choose from hundreds of local restaurants." },
            { icon: DeliveryIcon, title: "Fast Delivery", desc: "Get your meal delivered in 30 minutes or less." },
            { icon: PaymentIcon, title: "Easy Payments", desc: "Pay securely with credit card or Stripe." }
          ].map((feature, index) => (
            <Card key={index} sx={{
              textAlign: "center",
              p: 3,
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "1px solid",
              borderColor: "divider",
              height: "100%"
            }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Box sx={{
                  bgcolor: "#f5f5f5",
                  borderRadius: "50%",
                  width: 80,
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <feature.icon sx={{ fontSize: 40, color: "primary.main" }} />
                </Box>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>{feature.title}</Typography>
                <Typography variant="body1" color="text.secondary">{feature.desc}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;
