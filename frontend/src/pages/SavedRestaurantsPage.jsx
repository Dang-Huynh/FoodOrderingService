import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

// top of file
const DEFAULT_SAVED = [
  { id: 1, name: "Pizza Palace", rating: 4.6, cuisine: "Italian • Pizza", distance: "1.2 km", deliveryTime: "25-35 min", deliveryFee: "$2.99 delivery", image: "https://picsum.photos/400/250?random=1" },
  { id: 2, name: "Sushi Express", rating: 4.8, cuisine: "Japanese • Sushi", distance: "0.8 km", deliveryTime: "20-30 min", deliveryFee: "$3.49 delivery", image: "https://picsum.photos/400/250?random=2" },
];

export default function SavedRestaurantsPage({ saved = DEFAULT_SAVED }) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Saved Restaurants
      </Typography>
      {saved.length === 0 ? (
        <Typography color="text.secondary">
          You have no saved restaurants yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {saved.map((r) => (
            <Grid item xs={12} sm={6} md={3} key={r.id}>
              <Card
                sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={r.image}
                  alt={r.name}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, fontSize: "1.05rem" }}
                    >
                      {r.name}
                    </Typography>
                    <Chip
                      label={r.rating}
                      size="small"
                      sx={{
                        bgcolor: "#3d8f3d",
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {r.cuisine}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {r.distance} • {r.deliveryTime} • {r.deliveryFee}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/restaurant/${r.id}`}
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: "black",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                  >
                    View Menu
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
