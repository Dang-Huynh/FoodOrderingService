import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";

const ui = {
  pageBg: "#fafbfc",
  card: {
    borderRadius: 3,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid #eef0f2",
  },
  blackBtn: { bgcolor: "black", "&:hover": { bgcolor: "#333" } },
};

const orders = [
  {
    id: 1,
    date: "2025-09-15",
    total: "$45.99",
    status: "Delivered",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { name: "Coca-Cola", quantity: 2, price: 2.99 },
    ],
  },
  {
    id: 2,
    date: "2025-09-10",
    total: "$32.50",
    status: "In Progress",
    items: [
      { name: "Pepperoni Pizza", quantity: 1, price: 14.99 },
      { name: "Sparkling Water", quantity: 1, price: 3.5 },
    ],
  },
];

const statusColor = (s) =>
  s === "Delivered" ? "success" : s === "Cancelled" ? "error" : "warning";

export default function OrdersPage() {
  const [tab, setTab] = useState(0); // 0 = Active, 1 = Past

  const active = useMemo(
    () =>
      orders.filter(
        (o) => o.status !== "Delivered" && o.status !== "Cancelled"
      ),
    []
  );
  const past = useMemo(
    () =>
      orders.filter(
        (o) => o.status === "Delivered" || o.status === "Cancelled"
      ),
    []
  );

  const list = tab === 0 ? active : past;

  return (
    <Box sx={{ bgcolor: ui.pageBg, minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Your Orders
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Track active orders and browse your past deliveries.
        </Typography>

        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 3,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
          }}
        >
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label={`Active (${active.length})`} />
            <Tab label={`Past (${past.length})`} />
          </Tabs>
        </Box>

        {list.length === 0 ? (
          <Card sx={{ ...ui.card }}>
            <CardContent sx={{ py: 6, textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No {tab === 0 ? "active" : "past"} orders yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                When you place an order, it’ll show up here.
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="contained"
                sx={ui.blackBtn}
              >
                Explore restaurants
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {list.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order.id}>
                <Card sx={{ ...ui.card, height: "100%" }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700, mr: 2 }}>
                        Order #{order.id}
                      </Typography>

                      <Chip
                        label={order.status}
                        color={statusColor(order.status)}
                        size="small"
                        sx={{ ml: "auto" }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      Placed on {order.date}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ mb: 1 }}>
                      {order.items.slice(0, 2).map((it) => (
                        <Typography
                          key={it.name}
                          variant="body2"
                          color="text.secondary"
                        >
                          • {it.quantity} × {it.name}
                        </Typography>
                      ))}
                      {order.items.length > 2 && (
                        <Typography variant="caption" color="text.secondary">
                          + {order.items.length - 2} more
                        </Typography>
                      )}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography color="text.secondary">Total</Typography>
                      <Typography sx={{ fontWeight: 700 }}>
                        {order.total}
                      </Typography>
                    </Box>

                    <Button
                      component={Link}
                      to={`/order/${order.id}`}
                      fullWidth
                      variant="contained"
                      sx={ui.blackBtn}
                    >
                      View details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
