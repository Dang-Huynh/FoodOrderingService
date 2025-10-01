import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  TextField,
} from "@mui/material";
import ChipGroup from "../common/ChipGroup";

export default function DeliveryOptions({
  deliveryTime,
  setDeliveryTime,
  scheduledTime,
  setScheduledTime,
  tipPct,
  setTipPct,
}) {
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
          DELIVERY OPTIONS
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Time & tip
        </Typography>

        <Typography sx={{ mb: 1, fontWeight: 600 }}>Time</Typography>
        <ChipGroup
          value={deliveryTime}
          onChange={setDeliveryTime}
          options={[
            { value: "ASAP", label: "ASAP" },
            { value: "SCHEDULED", label: "Schedule" },
          ]}
        />
        {deliveryTime === "SCHEDULED" && (
          <Box sx={{ mt: 1 }}>
            <TextField
              type="datetime-local"
              size="small"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography sx={{ mb: 1, fontWeight: 600 }}>Tip</Typography>
        <ChipGroup
          value={tipPct}
          onChange={(v) => setTipPct(Number(v))}
          options={[
            { value: 0, label: "No tip" },
            { value: 0.1, label: "10%" },
            { value: 0.15, label: "15%" },
            { value: 0.2, label: "20%" },
          ]}
        />
      </CardContent>
    </Card>
  );
}