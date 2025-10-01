import React, { useMemo, useState } from "react";
import {
  Container, Box, Typography, Tabs, Tab, Grid, Button, Avatar,
  Snackbar, Alert, TextField
} from "@mui/material";
import {
  Edit as EditIcon, Add as AddIcon, Favorite as FavoriteIcon,
  LocationOn as LocationIcon, CreditCard as CreditCardIcon,
  Notifications as NotificationsIcon, Person as PersonIcon,
  Logout as LogoutIcon
} from "@mui/icons-material";

import useUserProfile from "../hooks/useUserProfile";

// Common UI
import SectionCard from "../components/common/SectionCard";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EditEntityDialog from "../components/common/EditEntityDialog";

// Profile UI
import ProfileHeader from "../components/profile/ProfileHeader";
import AddressCard from "../components/profile/AddressCard";
import PaymentCard from "../components/profile/PaymentCard";
import PreferencesList from "../components/profile/PreferencesList";
import FavoritesList from "../components/profile/FavoritesList";

/* -------------------- Mock data (unchanged) -------------------- */
const DEFAULT_USER = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  joinDate: "January 2024",
  avatar: "https://picsum.photos/100/100?random=50",
  preferences: { notifications: true, marketingEmails: false, smsUpdates: true },
  addresses: [
    { id: "addr1", label: "Home", line1: "123 Main Street", line2: "Apt 4B", city: "New York", state: "NY", zip: "10001", isDefault: true, instructions: "Ring bell twice" },
    { id: "addr2", label: "Work", line1: "456 Business Ave", line2: "Floor 15", city: "New York", state: "NY", zip: "10002", isDefault: false, instructions: "Front desk delivery" },
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

function TabPanel({ children, value, index }) {
  return <div hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>;
}

const ui = { pageBg: "#f5f5f5", blackBtn: { bgcolor: "black", color: "white", "&:hover": { bgcolor: "#333" } } };

export default function ProfilePage({ user: initialUser = DEFAULT_USER, onSave, onLogout }) {
  const {
    user, setUser,
    emailOk, phoneOk,
    fileRef, triggerAvatar, onAvatarChange,
    upsertAddress, upsertPayment, deleteAddress, deletePayment,
    setDefaultAddress, setDefaultPayment,
  } = useUserProfile(initialUser);

  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [dialog, setDialog] = useState({ open: false, type: null, data: null });
  const [confirm, setConfirm] = useState({ open: false, type: null, id: null });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const openAddAddress = () => setDialog({ open: true, type: "address", data: null });
  const openEditAddress = (addr) => setDialog({ open: true, type: "address", data: addr });
  const openAddPayment = () => setDialog({ open: true, type: "payment", data: null });
  const openEditPayment = (pm) => setDialog({ open: true, type: "payment", data: pm });
  const closeDialog = () => setDialog({ open: false, type: null, data: null });

  const askDelete = (type, id) => setConfirm({ open: true, type, id });
  const closeConfirm = () => setConfirm({ open: false, type: null, id: null });

  const handleSavePersonal = () => {
    if (!emailOk || !phoneOk) {
      setSnack({ open: true, message: "Please enter a valid email and phone number.", severity: "error" });
      return;
    }
    onSave?.(user);
    setIsEditing(false);
    setSnack({ open: true, message: "Profile updated.", severity: "success" });
  };

  const doDelete = () => {
    if (!confirm.id) return;
    if (confirm.type === "address") {
      deleteAddress(confirm.id);
      setSnack({ open: true, message: "Address deleted.", severity: "success" });
    } else if (confirm.type === "payment") {
      deletePayment(confirm.id);
      setSnack({ open: true, message: "Payment method deleted.", severity: "success" });
    }
    closeConfirm();
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: ui.pageBg }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <ProfileHeader user={user} fileRef={fileRef} onChangePhoto={onAvatarChange} />

          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1, borderColor: "divider",
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
                  <AddressCard
                    address={address}
                    onEdit={() => openEditAddress(address)}
                    onDelete={() => askDelete("address", address.id)}
                    onSetDefault={() => setDefaultAddress(address.id)}
                  />
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
                  <PaymentCard
                    payment={payment}
                    onEdit={() => openEditPayment(payment)}
                    onDelete={() => askDelete("payment", payment.id)}
                    onSetDefault={() => setDefaultPayment(payment.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </SectionCard>
        </TabPanel>

        {/* Preferences */}
        <TabPanel value={tabValue} index={3}>
          <SectionCard title="Notification Preferences" dense>
            <PreferencesList
              prefs={user.preferences}
              onChange={(prefs) => setUser({ ...user, preferences: prefs })}
            />
          </SectionCard>
        </TabPanel>

        {/* Favorites */}
        <TabPanel value={tabValue} index={4}>
          <SectionCard title="Favorite Restaurants">
            <FavoritesList favorites={user.favoriteRestaurants} />
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
          onSave={dialog.type === "address" ? (a)=>{ upsertAddress(a); setSnack({ open:true, message:"Address saved.", severity:"success" }); }
                                              : (p)=>{ upsertPayment(p); setSnack({ open:true, message:"Payment method saved.", severity:"success" }); }}
        />
        <ConfirmDialog
          open={confirm.open}
          title="Confirm deletion"
          message="This action cannot be undone."
          onCancel={closeConfirm}
          onConfirm={doDelete}
        />

        {/* Toast */}
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
