import React, { useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, IconButton, Typography, Box, Button, Container,
  Badge, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider,
  TextField, InputAdornment, useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ui = { blackBtn: { bgcolor: "black", color: "white", "&:hover": { bgcolor: "#333" } } };

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { count, openCart } = useCart();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/menu?query=${encodeURIComponent(q)}`);
    setQuery("");
    setMobileOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={trigger ? 3 : 0}
        sx={{
          bgcolor: "rgba(255,255,255,0.8)",
          color: "inherit",
          backdropFilter: "blur(8px)",
          borderBottom: trigger ? "1px solid #eef0f2" : "transparent",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1 }}>
            <Box sx={{ display: { xs: "inline-flex", md: "none" } }}>
              <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                <MenuIcon />
              </IconButton>
            </Box>

            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ textDecoration: "none", color: "inherit", fontWeight: 800, letterSpacing: -0.2, mr: 2 }}
            >
              UberEats Clone
            </Typography>

            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5, mr: 2 }}>
              <Button component={RouterLink} to="/" color={isActive("/") ? "primary" : "inherit"}>Home</Button>
              <Button component={RouterLink} to="/menu" color={isActive("/menu") ? "primary" : "inherit"}>Menu</Button>
              <Button component={RouterLink} to="/orders" color={isActive("/orders") ? "primary" : "inherit"}>Orders</Button>
            </Box>

            <Box sx={{ flex: 1 }} />

            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", minWidth: 280, mr: 1.5 }}>
              <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search restaurants or dishes…"
                size="small"
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                  autoComplete: "off",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton aria-label="Cart" sx={{ color: "inherit" }} onClick={openCart}>
                <Badge badgeContent={count} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {user ? (
                <Button onClick={logout} variant="contained" sx={ui.blackBtn}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    startIcon={<LoginIcon />}
                    variant="contained"
                    sx={{ ...ui.blackBtn, display: { xs: "none", md: "inline-flex" } }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="outlined"
                    sx={{ ml: 1, display: { xs: "none", md: "inline-flex" } }}
                  >
                    Sign Up
                  </Button>
                </>
              )}

              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: "inline-flex", md: "none" } }}
                aria-label="Search and menu"
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, flex: 1 }}>Menu</Typography>
            <IconButton onClick={() => setMobileOpen(false)} aria-label="Close"><CloseIcon /></IconButton>
          </Box>

          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search restaurants or dishes…"
            size="small"
            fullWidth
            autoFocus
            variant="outlined"
            InputProps={{
              startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
              autoComplete: "off",
            }}
          />

          <Divider sx={{ my: 2 }} />

          <List>
            <ListItemButton component={RouterLink} to="/" onClick={() => setMobileOpen(false)} selected={isActive("/")}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/menu" onClick={() => setMobileOpen(false)} selected={isActive("/menu")}>
              <ListItemIcon><RestaurantMenuIcon /></ListItemIcon>
              <ListItemText primary="Menu" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/orders" onClick={() => setMobileOpen(false)} selected={isActive("/orders")}>
              <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItemButton>

            <ListItemButton onClick={() => { setMobileOpen(false); openCart(); }}>
              <ListItemIcon>
                <Badge badgeContent={count} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="Cart" />
            </ListItemButton>
          </List>

          <Divider sx={{ my: 1.5 }} />

          {user ? (
            <Button fullWidth onClick={() => { logout(); setMobileOpen(false); }} sx={ui.blackBtn}>
              Logout
            </Button>
          ) : (
            <>
              <Button
                fullWidth
                component={RouterLink}
                to="/login"
                startIcon={<AccountCircleIcon />}
                variant="contained"
                sx={{ mb: 1, ...ui.blackBtn }}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Button>
              <Button
                fullWidth
                component={RouterLink}
                to="/register"
                variant="outlined"
                sx={ui.blackBtn}
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      <CartDrawer />
    </>
  );
}
