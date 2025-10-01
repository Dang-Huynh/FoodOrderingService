import React from "react";
import { Chip, Stack } from "@mui/material";

export default function ChipGroup({ value, onChange, options }) {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
      {options.map((o) => (
        <Chip
          key={String(o.value)}
          label={o.label}
          onClick={() => onChange(o.value)}
          variant={value === o.value ? "filled" : "outlined"}
          sx={{ borderRadius: "16px" }}
        />
      ))}
    </Stack>
  );
}
