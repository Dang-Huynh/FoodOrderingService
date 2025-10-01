import { Card, CardContent, Box, Typography } from "@mui/material";

const ui = {
  card: { borderRadius: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #eef0f2" },
};

export default function SectionCard({ title, action, children, dense = false }) {
  return (
    <Card sx={{ ...ui.card }}>
      <CardContent sx={{ p: dense ? 3 : 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
          {action}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}
