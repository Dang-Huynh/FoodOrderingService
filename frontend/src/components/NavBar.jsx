import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, IconButton, Typography, Box, Button, Container,
  Badge, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider,
  TextField, InputAdornment, useScrollTrigger,
  Avatar, Menu, MenuItem, Tooltip
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
import DashboardIcon from "@mui/icons-material/Dashboard";

import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ui = { blackBtn: { bgcolor: "black", color: "white", "&:hover": { bgcolor: "#333" } } };

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const { count, openCart } = useCart();

  useEffect(() => {
    // load lightweight profile (avatar/name) for the avatar menu
    try {
      const raw = localStorage.getItem("userProfile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    navigate(`/menu?query=${encodeURIComponent(q)}`);
    setQuery("");
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate("/login");
  };

  // avatar helpers
  const avatarSrc = profile?.avatar || "";
  const initials =
    profile?.name?.split(" ")?.map((n) => n[0])?.join("")?.toUpperCase() || "";

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
            {/* Mobile menu button */}
            <Box sx={{ display: { xs: "inline-flex", md: "none" } }}>
              <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo */}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ textDecoration: "none", color: "inherit", fontWeight: 800, letterSpacing: -0.2, mr: 2 }}
            >
              UberEats Clone
            </Typography>

            {/* Desktop links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
              <Button component={RouterLink} to="/" color={isActive("/") ? "primary" : "inherit"}>Home</Button>
              <Button component={RouterLink} to="/menu" color={isActive("/menu") ? "primary" : "inherit"}>Menu</Button>
              <Button component={RouterLink} to="/orders" color={isActive("/orders") ? "primary" : "inherit"}>Orders</Button>
            </Box>

            <Box sx={{ flex: 1 }} />

            {/* Desktop search */}
            <Box sx={{ display: { xs: "none", md: "flex" }, minWidth: 280, mr: 1.5 }}>
              <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search restaurants or dishes…"
                size="small"
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                  autoComplete: "off",
                }}
              />
            </Box>

            {/* Right actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={openCart} aria-label="Open cart">
                <Badge badgeContent={count} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* If logged in, show avatar + profile menu; else show login/signup buttons */}
              {user ? (
                <>
                  <Tooltip title="Account">
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Open account menu">
                      {avatarSrc || initials ? (
                        <Avatar src={avatarSrc} sx={{ width: 32, height: 32, fontSize: 14 }}>
                          {avatarSrc ? null : initials}
                        </Avatar>
                      ) : (
                        <AccountCircleIcon />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem onClick={() => { setAnchorEl(null); navigate("/profile"); }}>
                      <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Profile" />
                    </MenuItem>
                    <MenuItem onClick={() => { setAnchorEl(null); navigate("/dashboard"); }}>
                      <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </MenuItem>
                    <MenuItem onClick={() => { setAnchorEl(null); navigate("/orders"); }}>
                      <ListItemIcon><ReceiptLongIcon fontSize="small" /></ListItemIcon>
                      <ListItemText primary="Orders" />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemText primary="Logout" />
                    </MenuItem>
                  </Menu>
                </>
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

              {/* Mobile search icon (opens drawer where search input lives) */}
              <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { xs: "inline-flex", md: "none" } }}>
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
            <IconButton onClick={() => setMobileOpen(false)}><CloseIcon /></IconButton>
          </Box>

          {/* Mobile search input */}
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search restaurants or dishes…"
            size="small"
            fullWidth
            autoFocus
            variant="outlined"
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
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

            {/* Profile item mirrors avatar logic */}
            {user && (
              <ListItemButton component={RouterLink} to="/profile" onClick={() => setMobileOpen(false)} selected={isActive("/profile")}>
                <ListItemIcon>
                  {avatarSrc || initials ? (
                    <Avatar src={avatarSrc} sx={{ width: 24, height: 24, fontSize: 12 }}>
                      {avatarSrc ? null : initials}
                    </Avatar>
                  ) : (
                    <AccountCircleIcon />
                  )}
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            )}

            {/* Open cart drawer (no route) */}
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

          {/* Mobile login/logout */}
          {user ? (
            <Button fullWidth onClick={() => { handleLogout(); setMobileOpen(false); }} sx={ui.blackBtn}>
              Logout
            </Button>
          ) : (
            <>
              <Button
                fullWidth
                component={RouterLink}
                to="/login"
                startIcon={<LoginIcon />}
                variant="contained"
                sx={{ mb: 1, ...ui.blackBtn }}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Button>
              <Button fullWidth component={RouterLink} to="/register" variant="outlined" onClick={() => setMobileOpen(false)}>
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
