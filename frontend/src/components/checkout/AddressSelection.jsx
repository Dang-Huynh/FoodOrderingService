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

export default function AddressSelection({
  addresses,
  addressId,
  setAddressId,
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
          DELIVERY ADDRESS
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Choose where we're heading
        </Typography>

        {loading ? (
          <Skeleton variant="rectangular" height={68} />
        ) : (addresses || []).length === 0 ? (
          <Typography color="text.secondary">No addresses yet.</Typography>
        ) : (
          <List>
            {addresses.map((a) => (
              <ListItemButton
                key={a.id}
                selected={addressId === a.id}
                onClick={() => setAddressId(a.id)}
                sx={{ borderRadius: 1 }}
              >
                <Radio
                  edge="start"
                  checked={addressId === a.id}
                  tabIndex={-1}
                />
                <ListItemText
                  primary={<b>{a.label}</b>}
                  secondary={`${a.line1}${
                    a.line2 ? `, ${a.line2}` : ""
                  }, ${a.city}`}
                />
              </ListItemButton>
            ))}
          </List>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Link component="button" onClick={() => navigate("/profile")}>
            Add new address
          </Link>
          {addressId && (
            <Link component="button" onClick={() => navigate("/profile")}>
              Edit
            </Link>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}