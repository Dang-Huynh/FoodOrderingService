import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Skeleton,
  List,
  ListItemButton,
  Radio,
  ListItemText,
  Stack,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PaymentSelection({
  payments,
  paymentId,
  setPaymentId,
  loading = false,
}) {
  const navigate = useNavigate();

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
          PAYMENT METHOD
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          How would you like to pay?
        </Typography>

        {loading ? (
          <Skeleton variant="rectangular" height={68} />
        ) : (payments || []).length === 0 ? (
          <Typography color="text.secondary">No payment methods yet.</Typography>
        ) : (
          <List>
            {payments.map((p) => (
              <ListItemButton
                key={p.id}
                selected={paymentId === p.id}
                onClick={() => setPaymentId(p.id)}
                sx={{ borderRadius: 1 }}
              >
                <Radio edge="start" checked={paymentId === p.id} tabIndex={-1} />
                <ListItemText
                  primary={`${p.brand} •••• ${p.last4}`}
                  secondary={`Expires ${p.exp}`}
                />
              </ListItemButton>
            ))}
          </List>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Link component="button" onClick={() => navigate("/profile")}>
            Add new payment
          </Link>
          {paymentId && (
            <Link component="button" onClick={() => navigate("/profile")}>
              Edit
            </Link>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}