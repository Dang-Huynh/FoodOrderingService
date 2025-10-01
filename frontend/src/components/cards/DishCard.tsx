import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";

const clamp = (lines) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

export default function DishCard({ item, onAdd }) {
  const TITLE_LINES = 1;
  const DESC_LINES = 2;
  const TITLE_LH = 1.35;
  const DESC_LH = 1.45;
  const CARD_HEIGHT = 360;
  const IMG_FRAME_H = 170;

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
      {/* No-crop image frame: centers and CONTAINS the image */}
      <Box
        sx={{
          height: IMG_FRAME_H,
          backgroundColor: "#fafafa",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={item.image}
          alt={item.name}
          loading="lazy"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            display: "block",
          }}
        />
      </Box>

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          p: 2,
          height: `calc(${CARD_HEIGHT}px - ${IMG_FRAME_H}px)`,
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

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: "auto" }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            ${Number(item.price).toFixed(2)}
          </Typography>
          <Button
            onClick={onAdd}
            variant="contained"
            size="small"
            sx={{ bgcolor: "black", color: "white", borderRadius: 999, px: 2, fontWeight: 700, "&:hover": { bgcolor: "#333" } }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
