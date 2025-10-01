import { Card, CardContent, Typography, Box, IconButton, Button, Tooltip } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ui = { card: { borderRadius: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #eef0f2" } };

export default function PaymentCard({ payment, onEdit, onDelete, onSetDefault }) {
  return (
    <Card variant="outlined" sx={{ ...ui.card, border: payment.isDefault ? "2px solid black" : "1px solid #eef0f2" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CreditCardIcon sx={{ color: "#6b7280" }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {payment.brand} •••• {payment.last4}
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Edit payment"><IconButton size="small" onClick={onEdit} sx={{ mr: 0.5 }}><EditIcon fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Delete payment"><IconButton size="small" onClick={onDelete}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Expires {payment.exp}
        </Typography>

        {!payment.isDefault && (
          <Button size="small" onClick={onSetDefault}>
            Set as Default
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
