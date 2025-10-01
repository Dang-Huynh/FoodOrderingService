import React from "react";
import { Box, Typography } from "@mui/material";

export default function Row({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", my: 0.75 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}
