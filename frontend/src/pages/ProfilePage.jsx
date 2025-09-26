import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardMedia,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Logout as LogoutIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";

/* -------------------- Mock data -------------------- */
const DEFAULT_USER = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  joinDate: "January 2024",
  avatar: "https://picsum.photos/100/100?random=50",
  preferences: { notifications: true, marketingEmails: false, smsUpdates: true },
  addresses: [
    {
      id: "addr1",
      label: "Home",
      line1: "123 Main Street",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      zip: "10001",
      isDefault: true,
      instructions: "Ring bell twice",
    },
    {
      id: "addr2",
      label: "Work",
      line1: "456 Business Ave",
      line2: "Floor 15",
      city: "New York",
      state: "NY",
      zip: "10002",
      isDefault: false,
      instructions: "Front desk delivery",
    },
  ],
  paymentMethods: [
    { id: "pm1", brand: "Visa", last4: "4242", exp: "04/28", isDefault: true },
    { id: "pm2", brand: "Mastercard", last4: "8888", exp: "12/25", isDefault: false },
  ],
  favoriteRestaurants: [
    { id: 1, name: "Pizza Palace", cuisine: "Italian", image: "https://picsum.photos/80/80?random=1", rating: 4.6 },
    { id: 2, name: "Sushi Express", cuisine: "Japanese", image: "https://picsum.photos/80/80?random=2", rating: 4.8 },
  ],
};

/* -------------------- UI helpers -------------------- */
const ui = {
  pageBg: "#f5f5f5",
  card: { borderRadius: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #eef0f2" },
  blackBtn: { bgcolor: "black", color: "white", "&:hover": { bgcolor: "#333" } },
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function SectionCard({ title, action, children, dense = false }) {
  return (
    <Card sx={{ ...ui.card }}>
      <CardContent sx={{ p: dense ? 3 : 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {action}
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

/* -------------------- Reusable dialogs -------------------- */
function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function EditEntityDialog({ open, type, initialData, onClose, onSave }) {
  const [data, setData] = useState(initialData || {});
  useEffect(() => setData(initialData || {}), [initialData, open]);

  const isAddress = type === "address";
  const isPayment = type === "payment";

  const validate = () => {
    if (isAddress) return !!(data.label && data.line1 && data.city && data.state && data.zip);
    if (isPayment) {
      return (
        !!data.brand &&
        /^[0-9]{4}$/.test(data.last4 || "") &&
        /^([0-1][0-9])\/([0-9]{2})$/.test(data.exp || "")
      );
    }
    return false;
  };

  const idOrNew = () => data.id || (crypto?.randomUUID?.() ?? `id_${Date.now()}`);
  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...data, id: idOrNew() });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isAddress ? (data.id ? "Edit Address" : "Add Address") : data.id ? "Edit Payment Method" : "Add Payment Method"}
      </DialogTitle>
      <DialogContent>
        {isAddress && (
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Label" fullWidth value={data.label || ""} onChange={(e) => setData({ ...data, label: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Instructions" fullWidth value={data.instructions || ""} onChange={(e) => setData({ ...data, instructions: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Address line 1" fullWidth value={data.line1 || ""} onChange={(e) => setData({ ...data, line1: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Address line 2" fullWidth value={data.line2 || ""} onChange={(e) => setData({ ...data, line2: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="City" fullWidth value={data.city || ""} onChange={(e) => setData({ ...data, city: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="State" fullWidth value={data.state || ""} onChange={(e) => setData({ ...data, state: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="ZIP" fullWidth value={data.zip || ""} onChange={(e) => setData({ ...data, zip: e.target.value })} />
            </Grid>
          </Grid>
        )}

        {isPayment && (
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField label="Brand" placeholder="Visa / Mastercard" fullWidth value={data.brand || ""} onChange={(e) => setData({ ...data, brand: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Last 4 digits" fullWidth inputProps={{ maxLength: 4 }} value={data.last4 || ""} onChange={(e) => setData({ ...data, last4: e.target.value.replace(/\D/g, "") })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Expiry (MM/YY)" placeholder="04/28" fullWidth value={data.exp || ""} onChange={(e) => setData({ ...data, exp: e.target.value })} />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!validate()} sx={ui.blackBtn}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* -------------------- Main page -------------------- */
export default function ProfilePage({ user: initialUser = DEFAULT_USER, onSave, onLogout }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("userProfile");
      if (stored) return JSON.parse(stored);
    } catch {}
    return initialUser;
  });

  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [dialog, setDialog] = useState({ open: false, type: null, data: null });
  const [confirm, setConfirm] = useState({ open: false, type: null, id: null });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    try {
      localStorage.setItem("userProfile", JSON.stringify(user));
    } catch {}
  }, [user]);

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(user.email || ""), [user.email]);
  const phoneOk = useMemo(() => (user.phone || "").replace(/\D/g, "").length >= 10, [user.phone]);

  const handleSavePersonal = () => {
    if (!emailOk || !phoneOk) {
      setSnack({ open: true, message: "Please enter a valid email and phone number.", severity: "error" });
      return;
    }
    onSave?.(user);
    setIsEditing(false);
    setSnack({ open: true, message: "Profile updated.", severity: "success" });
  };

  /* Avatar upload */
  const fileRef = useRef(null);
  const triggerAvatar = () => fileRef.current?.click();
  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUser((prev) => ({ ...prev, avatar: url }));
  };

  /* Address & Payment upserts */
  const openAddAddress = () => setDialog({ open: true, type: "address", data: null });
  const openEditAddress = (addr) => setDialog({ open: true, type: "address", data: addr });
  const openAddPayment = () => setDialog({ open: true, type: "payment", data: null });
  const openEditPayment = (pm) => setDialog({ open: true, type: "payment", data: pm });
  const closeDialog = () => setDialog({ open: false, type: null, data: null });

  const upsertAddress = (a) => {
    setUser((prev) => {
      const exists = prev.addresses.some((x) => x.id === a.id);
      const list = exists ? prev.addresses.map((x) => (x.id === a.id ? a : x)) : [...prev.addresses, a];
      const normalized = a.isDefault ? list.map((x) => ({ ...x, isDefault: x.id === a.id })) : list;
      return { ...prev, addresses: normalized };
    });
    closeDialog();
    setSnack({ open: true, message: "Address saved.", severity: "success" });
  };

  const upsertPayment = (p) => {
    setUser((prev) => {
      const exists = prev.paymentMethods.some((x) => x.id === p.id);
      const list = exists ? prev.paymentMethods.map((x) => (x.id === p.id ? p : x)) : [...prev.paymentMethods, p];
      const normalized = p.isDefault ? list.map((x) => ({ ...x, isDefault: x.id === p.id })) : list;
      return { ...prev, paymentMethods: normalized };
    });
    closeDialog();
    setSnack({ open: true, message: "Payment method saved.", severity: "success" });
  };

  const askDelete = (type, id) => setConfirm({ open: true, type, id });
  const closeConfirm = () => setConfirm({ open: false, type: null, id: null });

  const doDelete = () => {
    if (!confirm.id) return;
    if (confirm.type === "address") {
      setUser((prev) => ({ ...prev, addresses: prev.addresses.filter((x) => x.id !== confirm.id) }));
      setSnack({ open: true, message: "Address deleted.", severity: "success" });
    } else if (confirm.type === "payment") {
      setUser((prev) => ({ ...prev, paymentMethods: prev.paymentMethods.filter((x) => x.id !== confirm.id) }));
      setSnack({ open: true, message: "Payment method deleted.", severity: "success" });
    }
    closeConfirm();
  };

  const setDefaultAddress = (addressId) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr) => ({ ...addr, isDefault: addr.id === addressId })),
    }));
  };

  const setDefaultPayment = (paymentId) => {
    setUser((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((pm) => ({ ...pm, isDefault: pm.id === paymentId })),
    }));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: ui.pageBg }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={user.avatar}
                sx={{
                  width: 88,
                  height: 88,
                  border: "4px solid #fff",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                }}
              >
                {user.name?.split(" ")?.map((n) => n[0])?.join("")}
              </Avatar>
              <Tooltip title="Change photo">
                <IconButton
                  aria-label="Change profile photo"
                  onClick={triggerAvatar}
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: -6,
                    right: -6,
                    bgcolor: "white",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onAvatarChange} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.2 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {user.joinDate}
              </Typography>
            </Box>
          </Box>

          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": { fontWeight: 600, textTransform: "none", minHeight: 48 },
              "& .Mui-selected": { color: "black" },
              "& .MuiTabs-indicator": { backgroundColor: "black" },
            }}
          >
            <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Info" />
            <Tab icon={<LocationIcon />} iconPosition="start" label="Addresses" />
            <Tab icon={<CreditCardIcon />} iconPosition="start" label="Payment Methods" />
            <Tab icon={<NotificationsIcon />} iconPosition="start" label="Preferences" />
            <Tab icon={<FavoriteIcon />} iconPosition="start" label="Favorites" />
          </Tabs>
        </Box>

        {/* Personal Info */}
        <TabPanel value={tabValue} index={0}>
          <SectionCard
            title="Personal Information"
            action={
              <Button startIcon={<EditIcon />} onClick={() => setIsEditing((v) => !v)}>
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            }
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  fullWidth
                  disabled={!isEditing}
                  sx={{ mb: 3 }}
                />
                <TextField
                  label="Email Address"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  fullWidth
                  disabled={!isEditing}
                  error={isEditing && !emailOk}
                  helperText={isEditing && !emailOk ? "Enter a valid email" : " "}
                  sx={{ mb: 3 }}
                />
                <TextField
                  label="Phone Number"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  fullWidth
                  disabled={!isEditing}
                  error={isEditing && !phoneOk}
                  helperText={isEditing && !phoneOk ? "Enter a valid phone number" : " "}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Avatar src={user.avatar} sx={{ width: 120, height: 120, mx: "auto", mb: 2 }} />
                  {isEditing && (
                    <Button variant="outlined" onClick={triggerAvatar} sx={{ borderRadius: 2 }}>
                      Change Photo
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => setIsEditing(false)} sx={{ borderRadius: 2 }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSavePersonal} sx={ui.blackBtn}>
                  Save Changes
                </Button>
              </Box>
            )}
          </SectionCard>
        </TabPanel>

        {/* Addresses */}
        <TabPanel value={tabValue} index={1}>
          <SectionCard
            title="Saved Addresses"
            action={
              <Button startIcon={<AddIcon />} onClick={openAddAddress} variant="contained" sx={ui.blackBtn}>
                Add New
              </Button>
            }
          >
            <Grid container spacing={3}>
              {user.addresses.map((address) => (
                <Grid item xs={12} md={6} key={address.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      ...ui.card,
                      border: address.isDefault ? "2px solid black" : "1px solid #eef0f2",
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Chip label={address.label} color={address.isDefault ? "primary" : "default"} size="small" />
                        <Box>
                          <Tooltip title="Edit address">
                            <IconButton size="small" onClick={() => openEditAddress(address)} sx={{ mr: 0.5 }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete address">
                            <IconButton size="small" onClick={() => askDelete("address", address.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ""}
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
                        <Button size="small" onClick={() => setDefaultAddress(address.id)} sx={{ mt: 1 }}>
                          Set as Default
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        </TabPanel>

        {/* Payment Methods */}
        <TabPanel value={tabValue} index={2}>
          <SectionCard
            title="Payment Methods"
            action={
              <Button startIcon={<AddIcon />} onClick={openAddPayment} variant="contained" sx={ui.blackBtn}>
                Add New
              </Button>
            }
          >
            <Grid container spacing={3}>
              {user.paymentMethods.map((payment) => (
                <Grid item xs={12} md={6} key={payment.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      ...ui.card,
                      border: payment.isDefault ? "2px solid black" : "1px solid #eef0f2",
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CreditCardIcon sx={{ color: "#6b7280" }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {payment.brand} •••• {payment.last4}
                          </Typography>
                        </Box>
                        <Box>
                          <Tooltip title="Edit payment">
                            <IconButton size="small" onClick={() => openEditPayment(payment)} sx={{ mr: 0.5 }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete payment">
                            <IconButton size="small" onClick={() => askDelete("payment", payment.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Expires {payment.exp}
                      </Typography>

                      {!payment.isDefault && (
                        <Button size="small" onClick={() => setDefaultPayment(payment.id)}>
                          Set as Default
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        </TabPanel>

        {/* Preferences */}
        <TabPanel value={tabValue} index={3}>
          <SectionCard title="Notification Preferences" dense>
            <List sx={{ p: 0 }}>
              <ListItem
                sx={{ px: 0 }}
                secondaryAction={
                  <Switch
                    edge="end"
                    checked={user.preferences.notifications}
                    onChange={(e) =>
                      setUser({ ...user, preferences: { ...user.preferences, notifications: e.target.checked } })
                    }
                  />
                }
              >
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Push Notifications" secondary="Receive order updates and promotions" />
              </ListItem>

              <ListItem
                sx={{ px: 0 }}
                secondaryAction={
                  <Switch
                    edge="end"
                    checked={user.preferences.marketingEmails}
                    onChange={(e) =>
                      setUser({ ...user, preferences: { ...user.preferences, marketingEmails: e.target.checked } })
                    }
                  />
                }
              >
                <ListItemIcon>
                  <CreditCardIcon />
                </ListItemIcon>
                <ListItemText primary="Email Notifications" secondary="Get order receipts and promos via email" />
              </ListItem>

              <ListItem
                sx={{ px: 0 }}
                secondaryAction={
                  <Switch
                    edge="end"
                    checked={user.preferences.smsUpdates}
                    onChange={(e) =>
                      setUser({ ...user, preferences: { ...user.preferences, smsUpdates: e.target.checked } })
                    }
                  />
                }
              >
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="SMS Updates" secondary="Text messages for order status" />
              </ListItem>
            </List>
          </SectionCard>
        </TabPanel>

        {/* Favorites */}
        <TabPanel value={tabValue} index={4}>
          <SectionCard title="Favorite Restaurants">
            <Grid container spacing={3}>
              {user.favoriteRestaurants.map((restaurant) => (
                <Grid item xs={12} sm={6} key={restaurant.id}>
                  <Card sx={{ ...ui.card, borderRadius: 2, display: "flex", alignItems: "center" }}>
                    <CardMedia component="img" image={restaurant.image} alt={restaurant.name} sx={{ width: 84, height: 84 }} loading="lazy" />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {restaurant.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {restaurant.cuisine} • ⭐ {restaurant.rating}
                      </Typography>
                      <Button variant="contained" size="small" sx={{ mt: 1, ...ui.blackBtn }}>
                        Order Again
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        </TabPanel>

        {/* Footer actions */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            variant="outlined"
            sx={{ color: "#4b5563", borderColor: "#e5e7eb", borderRadius: 2, px: 4 }}
          >
            Sign Out
          </Button>
        </Box>

        {/* Modals */}
        <EditEntityDialog
          open={dialog.open}
          type={dialog.type}
          initialData={dialog.data}
          onClose={closeDialog}
          onSave={dialog.type === "address" ? upsertAddress : upsertPayment}
        />
        <ConfirmDialog
          open={confirm.open}
          title="Confirm deletion"
          message="This action cannot be undone."
          onCancel={closeConfirm}
          onConfirm={doDelete}
        />

        <Snackbar
          open={snack.open}
          autoHideDuration={2500}
          onClose={() => setSnack({ ...snack, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snack.severity} variant="filled" sx={{ width: "100%" }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
