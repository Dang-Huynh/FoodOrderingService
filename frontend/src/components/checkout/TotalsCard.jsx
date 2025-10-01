import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Box,
  Skeleton,
} from "@mui/material";

const fmt = (n) => `$${n.toFixed(2)}`;

function Row({ label, value, sx }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        columnGap: 2,
        my: 0.75,
        ...sx,
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography
        sx={{
          fontWeight: /Total|To pay/i.test(String(label)) ? 800 : 600,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function TotalsCard({
  subtotal,
  discount,
  deliveryFee,
  serviceFee,
  tax,
  tip,
  total,
  canPlace,
  placing,
  onPlace,
  loading = false,
}) {
  return (
    <Card sx={{ 
      position: { md: "sticky" }, 
      top: { md: 24 },
      borderRadius: 3,
      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      border: "1px solid #eef0f2",
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Total
        </Typography>

        {loading ? (
          <Skeleton variant="rectangular" height={160} />
        ) : (
          <>
            <Row label="Subtotal" value={fmt(subtotal)} />
            {discount > 0 && (
              <Row
                label="Promo discount"
                value={`- ${fmt(discount)}`}
              />
            )}
            <Row label="Delivery fee" value={fmt(deliveryFee)} />
            <Row label="Service fee" value={fmt(serviceFee)} />
            <Row label="Tax" value={fmt(tax)} />
            <Row label="Tip" value={fmt(tip)} />
            <Divider sx={{ my: 1.5 }} />
            <Row label={<b>To pay</b>} value={<b>{fmt(total)}</b>} />
            <Button
              fullWidth
              sx={{ 
                mt: 2, 
                bgcolor: "black", 
                "&:hover": { bgcolor: "#333" } 
              }}
              variant="contained"
              disabled={!canPlace}
              onClick={onPlace}
            >
              {placing ? "Placing..." : "Place order"}
            </Button>
            {!canPlace && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                Select address, payment, and ensure your cart isn't empty.
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}