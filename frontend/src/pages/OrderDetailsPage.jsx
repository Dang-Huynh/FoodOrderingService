import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel,
  CardMedia,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { fetchOrders } from "../api";

const ui = {
  pageBg: "#fafbfc",
  card: {
    borderRadius: 3,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid #eef0f2",
  },
  blackBtn: { bgcolor: "black", "&:hover": { bgcolor: "#333" } },
};

const fallbackImg = "https://placehold.co/600x400/png"

const steps = ["Received", "Preparing", "On the way", "Delivered"];
const statusToIndex = (s) => {
  const v = String(s || "").toLowerCase();
  if (v.includes("deliver")) return 3;
  if (v.includes("way")) return 2;
  if (v.includes("prepar")) return 1;
  return 0;
};

const fmt = (n) => `$${parseFloat(n).toFixed(2)}`;
const formatDate = (value) => {
  if (!value) return "Unknown Date";
  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  } catch {
    return "Invalid Date";
  }
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((orders) => {
        const match = orders.find((o) => String(o.id) === id);
        if (!match) throw new Error("Order not found");
        setOrder(match);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load order details.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const itemSubtotal = useMemo(() => {
    if (!order?.items) return 0;
    return order.items.reduce(
      (sum, it) => sum + (it.unit_price || it.price || 0) * (it.quantity || 1),
      0
    );
  }, [order]);

  const deliveryFee = parseFloat(order?.delivery_fee || 3.99);
  const serviceFee = parseFloat(order?.service_fee || 0);
  const tax = parseFloat(order?.tax || 2.49);
  const tip = parseFloat(order?.tip || 0);
    const total = useMemo(() => {
    return itemSubtotal + deliveryFee + serviceFee + tax + tip;
  }, [itemSubtotal, deliveryFee, serviceFee, tax, tip]);


  if (loading) {
    return (
      <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{error || "Order not found."}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: ui.pageBg, minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Order #{order.id}
            </Typography>
            <Chip
              label={order.status}
              color={
                String(order.status).toLowerCase().includes("deliver")
                  ? "success"
                  : "warning"
              }
              size="small"
            />
          </Box>
          <Typography color="text.secondary">
            From <b>{order.restaurant?.name || "N/A"}</b>
            {" • Placed on "}
            {formatDate(order.placed_at || order.created || order.date)}
          </Typography>
        </Box>

        {/* Progress */}
        <Card sx={{ ...ui.card, mb: 3 }}>
          <CardContent>
            <Stepper activeStep={statusToIndex(order.status)} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ ...ui.card }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Items
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  {order.items?.map((item, idx) => {
                    return (
                      <Grid item xs={12} key={idx}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <CardMedia
                            component="img"
                            image={item.image_url || fallbackImg}
                            alt={item.name}
                            sx={{ width: 120, height: 80, borderRadius: 1 }}
                            loading="lazy"
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 700 }}>
                              {item.name || item.item_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.quantity ?? 1} × {fmt(item.unit_price || item.price)}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {fmt(
                              (item.unit_price || item.price || 0) *
                                (item.quantity ?? 1)
                            )}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Summary */}
          <Grid item xs={12} md={4}>
            <Card sx={{ ...ui.card, position: { md: "sticky" }, top: { md: 24 } }} >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Summary
                </Typography>
                <Row label="Items subtotal" value={fmt(itemSubtotal)} />
                <Row label="Delivery fee" value={fmt(deliveryFee)} />
                <Row label="Tax" value={fmt(tax)} />
                <Divider sx={{ my: 1.5 }} />
                <Row label={<b>Total</b>} value={<b>{fmt(total)}</b>} />

                <Button
                  component={Link}
                  to="/menu"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, ...ui.blackBtn }}
                >
                  Reorder
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function Row({ label, value, sx }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "baseline",
        columnGap: 4,
        my: 0.75,
        ...sx,
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography
        sx={{ textAlign: "right", minWidth: 96, whiteSpace: "nowrap" }}
      >
        {value}
      </Typography>
    </Box>
  );
}
