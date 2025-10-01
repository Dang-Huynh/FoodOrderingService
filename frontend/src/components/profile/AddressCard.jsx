import { Card, CardContent, Chip, Typography, Box, IconButton, Button, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ui = { card: { borderRadius: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #eef0f2" } };

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  return (
    <Card variant="outlined" sx={{ ...ui.card, border: address.isDefault ? "2px solid black" : "1px solid #eef0f2" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Chip label={address.label} color={address.isDefault ? "primary" : "default"} size="small" />
          <Box>
            <Tooltip title="Edit address"><IconButton size="small" onClick={onEdit} sx={{ mr: 0.5 }}><EditIcon fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Delete address"><IconButton size="small" onClick={onDelete}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
          {address.line1}{address.line2 ? `, ${address.line2}` : ""}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {address.city}, {address.state} {address.zip}
        </Typography>
        {address.instructions && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            🚪 {address.instructions}
          </Typography>
        )}

        {!address.isDefault && (
          <Button size="small" onClick={onSetDefault} sx={{ mt: 1 }}>
            Set as Default
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
