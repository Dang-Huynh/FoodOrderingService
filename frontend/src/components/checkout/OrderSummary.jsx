import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Box,
  IconButton,
  Chip,
  Divider,
  Stack,
  TextField,
  Button,
  Skeleton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const fmt = (n) => `$${n.toFixed(2)}`;

export default function OrderSummary({
  cart,
  inc,
  dec,
  remove,
  promo,
  setPromo,
  appliedPromo,
  applyPromo,
  clearPromo,
  loading = false,
}) {
  const handleApplyPromo = () => {
    applyPromo(promo);
  };

  return (
    <Card sx={{ 
      mb: 3, 
      borderRadius: 3,
      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      border: "1px solid #eef0f2",
    }}>
      <CardContent>
        <Typography
          variant="overline"
          sx={{
            color: "text.secondary",
            letterSpacing: 1,
            fontWeight: 700,
          }}
        >
          ORDER SUMMARY
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Review your items
        </Typography>

        {loading ? (
          <Skeleton variant="rectangular" height={120} />
        ) : cart.length === 0 ? (
          <Typography color="text.secondary">Your cart is empty.</Typography>
        ) : (
          <>
            <List>
              {cart.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{
                    px: 0,
                    pr: { xs: 10, sm: 20 },
                    py: 1,
                    "&:not(:last-of-type)": {
                      borderBottom: "1px solid #f0f2f4",
                    },
                  }}
                  secondaryAction={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        minWidth: 120,
                        justifyContent: "flex-end",
                        flexShrink: 0,
                      }}
                    >
                      {/* Price */}
                      <Typography
                        sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                      >
                        {fmt((item.price || 0) * (item.qty || 1))}
                      </Typography>

                      {/* Delete button */}
                      <IconButton
                        edge="end"
                        aria-label="Remove item"
                        onClick={() => remove(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  {/* Thumbnail */}
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    sx={{
                      width: 96,
                      height: 64,
                      borderRadius: 1,
                      objectFit: "cover",
                      mr: 1.5,
                      flexShrink: 0,
                      border: "1px solid #eef0f2",
                    }}
                  />

                  {/* Name + desc */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{ fontWeight: 700, lineHeight: 1.2 }}
                      noWrap
                    >
                      {item.name}
                      {item.qty > 1 ? ` × ${item.qty}` : ""}
                    </Typography>
                    {item.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      >
                        {item.description}
                      </Typography>
                    )}

                    {/* Qty control */}
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <Chip
                        label="-"
                        onClick={() => dec(item.id)}
                        variant="outlined"
                        size="small"
                        sx={{
                          height: 28,
                          borderRadius: "999px",
                          px: 0.5,
                        }}
                      />
                      <Typography
                        sx={{
                          fontWeight: 700,
                          minWidth: 24,
                          textAlign: "center",
                        }}
                      >
                        {item.qty || 1}
                      </Typography>
                      <Chip
                        label="+"
                        onClick={() => inc(item.id)}
                        variant="outlined"
                        size="small"
                        sx={{
                          height: 28,
                          borderRadius: "999px",
                          px: 0.5,
                        }}
                      />
                    </Stack>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <TextField
                label="Promo code"
                size="small"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                sx={{ flex: 1 }}
              />
              <Button variant="outlined" onClick={handleApplyPromo}>
                Apply
              </Button>
              {appliedPromo && (
                <Chip
                  label={`${appliedPromo.label} (${appliedPromo.code})`}
                  onDelete={clearPromo}
                />
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}