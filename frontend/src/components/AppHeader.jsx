import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Avatar, Menu, MenuItem, Button } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link, useNavigate, useLocation } from "react-router-dom";


export default function AppHeader({ cartCount = 0, userInitial = 'U', onSignOut }) {
const [anchor, setAnchor] = React.useState(null);
const open = Boolean(anchor);
const navigate = useNavigate();
const { pathname } = useLocation();


return (
<AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
<Toolbar sx={{ gap: 1 }}>
<Typography variant="h6" sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/')}>MealApp</Typography>
<Box sx={{ flex: 1 }} />


<Button component={Link} to="/menu" color={pathname === '/menu' ? 'inherit' : 'primary'}>Restaurants</Button>
<IconButton component={Link} to="/saved" aria-label="saved restaurants">
<FavoriteIcon />
</IconButton>
<IconButton component={Link} to="/cart" aria-label="cart">
<Badge badgeContent={cartCount} color="primary">
<ShoppingBagIcon />
</Badge>
</IconButton>


<IconButton onClick={(e)=>setAnchor(e.currentTarget)} size="small" sx={{ ml: 1 }}>
<Avatar sx={{ width: 32, height: 32 }}>{userInitial}</Avatar>
</IconButton>
<Menu anchorEl={anchor} open={open} onClose={()=>setAnchor(null)} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
<MenuItem component={Link} to="/dashboard" onClick={()=>setAnchor(null)}>Dashboard</MenuItem>
<MenuItem component={Link} to="/profile" onClick={()=>setAnchor(null)}>Profile</MenuItem>
<MenuItem component={Link} to="/orders" onClick={()=>setAnchor(null)}>Orders</MenuItem>
<MenuItem onClick={()=>{ setAnchor(null); onSignOut?.(); }}>Sign out</MenuItem>
</Menu>
</Toolbar>
</AppBar>
);
}