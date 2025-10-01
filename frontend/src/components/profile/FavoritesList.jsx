import { Grid, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const ui = {
  card: {
    borderRadius: 2,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid #eef0f2",
  },
  blackBtn: { bgcolor: "black", color: "white", "&:hover": { bgcolor: "#333" } },
};

export default function FavoritesList({ favorites }) {
  return (
    <Grid container spacing={3}>
      {favorites.map((r) => (
        <Grid item xs={12} sm={6} key={r.id}>
          <Card sx={{ ...ui.card, borderRadius: 2, display: "flex", alignItems: "center" }}>
            <CardMedia
              component="img"
              image={r.image}
              alt={r.name}
              sx={{ width: 84, height: 84 }}
              loading="lazy"
            />
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {r.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {r.cuisine} • ⭐ {r.rating}
              </Typography>
              <Button
                component={Link}
                to="/menu"  
                variant="contained"
                size="small"
                sx={{ mt: 1, ...ui.blackBtn }}
              >
                Order Again
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
