import { Card, CardContent, CardMedia, Chip, Typography, Box, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Link as RouterLink } from "react-router-dom";

// layout tokens
const CARD_W = 250; // fixed card width (px)
const IMG_H = Math.round((CARD_W * 9) / 16); // 16:9 height

const ui = {
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

const titleSx = {
  fontWeight: 700,
  fontSize: "1.05rem",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  lineHeight: 1.25,
  minHeight: 24,
};

const metaSx = {
  mb: 0.5,
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  minHeight: 20,
};

const offerRowSx = {
  minHeight: 24,
  display: "flex",
  alignItems: "center",
  mt: 1,
};

export default function RestaurantCard({
  id,
  name,
  image,
  rating,
  cuisine,
  distance,
  deliveryTime,
  deliveryFee,
  promoted,
  offer,
  isFavorite,
  onToggleFavorite,
  toLink = `/restaurant/${id}`,
  cta = "View Menu",
}: {
  id: string | number;
  name: string;
  image?: string;
  rating?: number;
  cuisine?: string;
  distance?: string;
  deliveryTime?: string;
  deliveryFee?: string;
  promoted?: boolean;
  offer?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  toLink?: string;
  cta?: string;
}) {
  return (
    <Card
      sx={{
        ...ui.card,
        display: "flex",
        flexDirection: "column",
        width: `${CARD_W}px`,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(0,0,0,0.12)" },
      }}
    >
      {/* Promoted badge */}
      {promoted && (
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
            zIndex: 2,
          }}
        />
      )}

      {/* Favorite */}
      {onToggleFavorite && (
        <Box
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
            zIndex: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          }}
        >
          {isFavorite ? <FavoriteIcon sx={{ color: "red" }} /> : <FavoriteBorderIcon />}
        </Box>
      )}

      {/* Fixed-size image frame */}
      <Box sx={{ width: `${CARD_W}px`, height: `${IMG_H}px`, position: "relative", bgcolor: "#f7f7f7", flexShrink: 0 }}>
        <CardMedia
          component="img"
          image={image}
          alt={name}
          loading="lazy"
          sx={{ position: "absolute", inset: 0, width: `${CARD_W}px`, height: `${IMG_H}px`, objectFit: "cover" }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", flexGrow: 1, minHeight: 160 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
          <Typography variant="h6" sx={titleSx}>{name}</Typography>
          {rating != null && (
            <Chip
              icon={<StarIcon sx={{ color: "white", fontSize: 16 }} />}
              label={rating}
              size="small"
              sx={{ backgroundColor: "#3d8f3d", color: "white", fontWeight: 700 }}
            />
          )}
        </Box>

        {cuisine && (
          <Typography variant="body2" color="text.secondary" sx={metaSx}>
            {cuisine}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary" noWrap>
          {distance} • {deliveryTime} • {deliveryFee}
        </Typography>

        {/* Offer row */}
        <Box sx={offerRowSx}>
          {offer && (
            <>
              <LocalOfferIcon sx={{ color: "#e76f51", fontSize: 18, mr: 0.5 }} />
              <Typography variant="body2" sx={{ color: "#e76f51", fontWeight: 600 }}>
                {offer}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ mt: "auto" }}>
          <Button component={RouterLink} to={toLink} variant="contained" fullWidth sx={{ ...ui.blackBtn, borderRadius: 1.5, mt: 1, fontWeight: 700 }}>
            {cta}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
