import React from "react";
import {
  Box,
  Drawer,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const fmt = (n) => `$${n.toFixed(2)}`;

export default function CartDrawer() {
  const { isOpen, closeCart, cart, inc, dec, remove, clear, subtotal } = useCart();
  const navigate = useNavigate();

  return (
    <Drawer anchor="right" open={isOpen} onClose={closeCart}>
      <Box sx={{ width: { xs: 340, sm: 400 }, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Your Cart
          </Typography>
          <IconButton aria-label="Close cart" onClick={closeCart}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />

        {cart.length === 0 ? (
          <Typography color="text.secondary">Your cart is empty.</Typography>
        ) : (
          <>
            <List>
              {cart.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <IconButton edge="end" aria-label="Remove item" onClick={() => remove(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 600 }}>{item.name}</Typography>
                        <Typography>{fmt((item.price || 0) * (item.qty || 1))}</Typography>
                      </Box>
                    }
                    secondary={item.description}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                    <IconButton size="small" aria-label="Decrease quantity" onClick={() => dec(item.id)}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ mx: 1, minWidth: 24, textAlign: "center" }}>{item.qty}</Typography>
                    <IconButton size="small" aria-label="Increase quantity" onClick={() => inc(item.id)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>{fmt(subtotal)}</Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 1, bgcolor: "black", "&:hover": { bgcolor: "#333" } }}
              onClick={() => { closeCart(); navigate("/checkout"); }}
            >
              Go to checkout
            </Button>
            <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={clear}>
              Clear cart
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );
}
