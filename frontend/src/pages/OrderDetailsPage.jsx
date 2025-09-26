import React, { useMemo } from "react";
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
} from "@mui/material";
import { useParams, Link } from "react-router-dom";

const ui = {
  pageBg: "#fafbfc",
  card: {
    borderRadius: 3,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid #eef0f2",
  },
  blackBtn: { bgcolor: "black", "&:hover": { bgcolor: "#333" } },
};

const ordersData = {
  1: {
    id: 1,
    restaurantName: "Pizza Palace",
    date: "2025-09-15",
    status: "Delivered",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { name: "Coca-Cola", quantity: 2, price: 2.99 },
    ],
    deliveryFee: 4.99,
    tax: 3.5,
  },
  2: {
    id: 2,
    restaurantName: "Sushi Express",
    date: "2025-09-10",
    status: "In Progress",
    items: [
      { name: "Pepperoni Pizza", quantity: 1, price: 14.99 },
      { name: "Sparkling Water", quantity: 1, price: 3.5 },
    ],
    deliveryFee: 3.99,
    tax: 2.0,
  },
};

const steps = ["Received", "Preparing", "On the way", "Delivered"];
const statusToIndex = (s) =>
  s === "Delivered" ? 3 : s === "On the way" ? 2 : s === "Preparing" ? 1 : 0;

const fmt = (n) => `$${n.toFixed(2)}`;

export default function OrderDetailsPage() {
  const { id } = useParams();
  const order = ordersData[id] || ordersData[1];

  const itemSubtotal = useMemo(
    () => order.items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [order.items]
  );
  const total = useMemo(
    () => itemSubtotal + order.deliveryFee + order.tax,
    [itemSubtotal, order.deliveryFee, order.tax]
  );

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
              color={order.status === "Delivered" ? "success" : "warning"}
              size="small"
            />
          </Box>
          <Typography color="text.secondary">
            From <b>{order.restaurantName}</b> • Placed on {order.date}
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
          {/* Items */}
          <Grid item xs={12} md={8}>
            <Card sx={{ ...ui.card }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Items
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {order.items.map((item) => {
                    const img = `https://picsum.photos/seed/${encodeURIComponent(
                      item.name
                    )}/120/80`;
                    return (
                      <Grid item xs={12} key={item.name}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <CardMedia
                            component="img"
                            image={img}
                            alt={item.name}
                            sx={{ width: 120, height: 80, borderRadius: 1 }}
                            loading="lazy"
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 700 }}>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.quantity} × {fmt(item.price)}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {fmt(item.price * item.quantity)}
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
            <Card
              sx={{ ...ui.card, position: { md: "sticky" }, top: { md: 24 } }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Summary
                </Typography>

                <Row
                  label="Items subtotal"
                  value={fmt(itemSubtotal)}
                  sx={{ my: 1.25 }}
                />
                <Row label="Delivery fee" value={fmt(order.deliveryFee)} />
                <Row label="Tax" value={fmt(order.tax)} />
                <Divider sx={{ my: 1.5 }} />
                <Row
                  label={<b>Total</b>}
                  value={<b>{fmt(total)}</b>}
                  sx={{ my: 0.75 }}
                />

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
