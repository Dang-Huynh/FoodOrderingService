import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Radio,
  Stack,
  TextField,
  Typography,
  Skeleton,
  Alert,
  Link,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { placeOrder } from "../api";

/** ---------------- UI tokens (keeps styling consistent across pages) ---------------- */
const ui = {
  pageBg: "#fafbfc",
  card: {
    borderRadius: 3,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    border: "1px solid #eef0f2",
  },
  blackBtn: {
    bgcolor: "black",
    "&:hover": { bgcolor: "#333" },
  },
};

/** ---------------- Helpers ---------------- */
const fmt = (n) => `$${n.toFixed(2)}`;

const fromLocalProfile = () => {
  try {
    const raw = localStorage.getItem("userProfile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Fallbacks if no profile exists yet
const mockAddresses = [
  {
    id: "addr-default",
    label: "Home",
    line1: "123 Main Street",
    line2: "Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    isDefault: true,
    instructions: "Ring bell twice",
  },
];
const mockPayments = [{ id: "pm-default", brand: "Visa", last4: "4242", exp: "04/28", isDefault: true }];

/** Normalize legacy cart where items had no qty */
function normalizeCart(list) {
  if (!Array.isArray(list)) return [];
  // If already has qty, keep as-is
  const lastRestaurantId = localStorage.getItem("lastRestaurantId");
  if (list.length && typeof list[0].qty === "number") {
    // backfill restaurantId if missing
    return list.map((it) =>
      it.restaurantId || !lastRestaurantId
        ? it
        : { ...it, restaurantId: Number(lastRestaurantId) }
    );
  }
  // legacy cart where each click pushed a duplicate item without qty
  const map = new Map();
  list.forEach((it) => {
    const key = it.id;
    const base = {
      ...it,
      restaurantId:
        it.restaurantId || (lastRestaurantId ? Number(lastRestaurantId) : undefined),
    };
    if (!map.has(key)) map.set(key, { ...base, qty: 1 });
    else map.get(key).qty += 1;
  });
  return Array.from(map.values());
}

/** Chip group control */
function ChipGroup({ value, onChange, options }) {
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

/** Row for totals */
function Row({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", my: 0.75 }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  );
}

/** ---------------- Main Component ---------------- */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { clear } = useCart();

  const [cart, setCart] = useState(null); // null = loading, [] = empty
  const [addresses, setAddresses] = useState(null);
  const [payments, setPayments] = useState(null);

  const [addressId, setAddressId] = useState("");
  const [paymentId, setPaymentId] = useState("");

  const [deliveryTime, setDeliveryTime] = useState("ASAP"); // ASAP | SCHEDULED
  const [scheduledTime, setScheduledTime] = useState("");

  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const [tipPct, setTipPct] = useState(0.1);

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  /** Load cart */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(normalizeCart(saved));
    } catch {
      setCart([]);
    }
  }, []);

  /** Load addresses/payments from profile or fallback mocks */
  useEffect(() => {
    const profile = fromLocalProfile();
    const a = (profile?.addresses || []).length ? profile.addresses : mockAddresses;
    const p = (profile?.paymentMethods || []).length ? profile.paymentMethods : mockPayments;
    setAddresses(a);
    setPayments(p);
    const defAddr = a.find((x) => x.isDefault) || a[0];
    const defPay = p.find((x) => x.isDefault) || p[0];
    setAddressId(defAddr?.id || "");
    setPaymentId(defPay?.id || "");
  }, []);

  /** Cart ops */
  const removeFromCart = (id) => {
    const next = (cart || []).filter((i) => i.id !== id);
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  /** Totals */
  const { subtotal, deliveryFee, serviceFee, tax, tip, discount, total } = useMemo(() => {
    const sub = (cart || []).reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);
    const delivery = sub > 40 ? 0 : 2.99;
    const service = sub * 0.05;
    const t = (sub + delivery + service) * 0.08875; // NYC-ish example
    const tipBase = sub + delivery + service;
    const tipVal = tipBase * tipPct;
    const disc =
      appliedPromo?.type === "PCT"
        ? sub * appliedPromo.value
        : appliedPromo?.type === "ABS"
        ? appliedPromo.value
        : 0;
    const tot = Math.max(0, sub - disc) + delivery + service + t + tipVal;
    return { subtotal: sub, deliveryFee: delivery, serviceFee: service, tax: t, tip: tipVal, discount: disc, total: tot };
  }, [cart, tipPct, appliedPromo]);

  const canPlace =
    !placing &&
    (cart?.length ?? 0) > 0 &&
    addressId &&
    paymentId &&
    (deliveryTime === "ASAP" || (deliveryTime === "SCHEDULED" && scheduledTime));

  /** Promo */
  const applyPromo = () => {
    setError("");
    const code = promo.trim().toUpperCase();
    if (!code) return;
    if (code === "WELCOME20") {
      setAppliedPromo({ code, type: "PCT", value: 0.2, label: "20% off" });
      setPromo("");
    } else if (code === "FREESHIP") {
      setAppliedPromo({ code, type: "ABS", value: 2.99, label: "Free delivery" });
      setPromo("");
    } else {
      setAppliedPromo(null);
      setError("Promo code is invalid or expired.");
    }
  };

  /** Place order (stub) */
  const handlePlaceOrder  = async () => {
    if (!canPlace) return;
    setPlacing(true);
    setError("");
    try {
      // we must know which restaurant this cart belongs to
      let restaurantId = cart?.[0]?.restaurantId;

      // fallback if missing
      if (!restaurantId) {
        const fallback = localStorage.getItem("lastRestaurantId");
        if (fallback) {
          restaurantId = parseInt(fallback);
          // patch all cart items if needed
          setCart(cart.map(i => ({ ...i, restaurantId })));
        }
      }
      if (!restaurantId) {
        setError("Missing restaurant reference. Please add items again.");
        return;
      }

      // Map cart -> backend items (snapshot required fields)
      const items = (cart || []).map((it) => ({
        menu_item_id: it.id,           // MenuItem PK
        name: it.name,                 // snapshot
        unit_price: String(it.price),  // snapshot
        quantity: it.qty ?? it.quantity ?? 1,
        image: it.image || "",
      }));

      const payload = {
        restaurant_id: restaurantId,
        items,
      };

      const placed = await placeOrder(payload);
      clear();
      navigate(`/order/${placed.id}`); // go to order details
    } catch (e) {
      // surface server detail if present
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        "Something went wrong placing your order.";
      setError(msg);
    } finally {
      setPlacing(false);
    }
  };

  const loading = cart === null || addresses === null || payments === null;

  return (
    <Box sx={{ bgcolor: ui.pageBg, minHeight: "100vh", pb: { xs: 10, md: 4 }, pt: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, letterSpacing: -0.2 }}>
          Checkout
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left column */}
          <Grid item xs={12} md={8}>
            {/* Order summary */}
            <Card sx={{ ...ui.card, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Order Summary
                </Typography>

                {loading ? (
                  <Skeleton variant="rectangular" height={120} />
                ) : (cart?.length ?? 0) === 0 ? (
                  <Typography color="text.secondary">Your cart is empty.</Typography>
                ) : (
                  <>
                    <List>
                      {cart.map((item) => (
                        <ListItem
                          key={item.id}
                          secondaryAction={
                            <IconButton edge="end" aria-label="Remove item" onClick={() => removeFromCart(item.id)}>
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography sx={{ fontWeight: 600 }}>
                                  {item.name}
                                  {item.qty > 1 ? ` × ${item.qty}` : ""}
                                </Typography>
                                <Typography>{fmt((item.price || 0) * (item.qty || 1))}</Typography>
                              </Box>
                            }
                            secondary={item.description}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        label="Promo code"
                        size="small"
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                      />
                      <Button variant="outlined" onClick={applyPromo}>
                        Apply
                      </Button>
                      {appliedPromo && (
                        <Chip
                          label={`${appliedPromo.label} (${appliedPromo.code})`}
                          onDelete={() => setAppliedPromo(null)}
                        />
                      )}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Address selection */}
            <Card sx={{ ...ui.card, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Delivery Address
                </Typography>

                {loading ? (
                  <Skeleton variant="rectangular" height={68} />
                ) : (addresses || []).length === 0 ? (
                  <Typography color="text.secondary">No addresses yet.</Typography>
                ) : (
                  <List>
                    {addresses.map((a) => (
                      <ListItemButton
                        key={a.id}
                        selected={addressId === a.id}
                        onClick={() => setAddressId(a.id)}
                        sx={{ borderRadius: 1 }}
                      >
                        <Radio edge="start" checked={addressId === a.id} tabIndex={-1} />
                        <ListItemText
                          primary={<b>{a.label}</b>}
                          secondary={`${a.line1}${a.line2 ? `, ${a.line2}` : ""}, ${a.city}`}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                )}

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Link component="button" onClick={() => navigate("/profile")}>
                    Add new address
                  </Link>
                  {addressId && (
                    <Link component="button" onClick={() => navigate("/profile")}>
                      Edit
                    </Link>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Payment selection */}
            <Card sx={{ ...ui.card, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Payment Method
                </Typography>

                {loading ? (
                  <Skeleton variant="rectangular" height={68} />
                ) : (payments || []).length === 0 ? (
                  <Typography color="text.secondary">No payment methods yet.</Typography>
                ) : (
                  <List>
                    {payments.map((p) => (
                      <ListItemButton
                        key={p.id}
                        selected={paymentId === p.id}
                        onClick={() => setPaymentId(p.id)}
                        sx={{ borderRadius: 1 }}
                      >
                        <Radio edge="start" checked={paymentId === p.id} tabIndex={-1} />
                        <ListItemText primary={`${p.brand} •••• ${p.last4}`} secondary={`Expires ${p.exp}`} />
                      </ListItemButton>
                    ))}
                  </List>
                )}

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Link component="button" onClick={() => navigate("/profile")}>
                    Add new payment
                  </Link>
                  {paymentId && (
                    <Link component="button" onClick={() => navigate("/profile")}>
                      Edit
                    </Link>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Delivery options: time + tip */}
            <Card sx={{ ...ui.card, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Delivery Options
                </Typography>

                <Typography sx={{ mb: 1, fontWeight: 600 }}>Time</Typography>
                <ChipGroup
                  value={deliveryTime}
                  onChange={setDeliveryTime}
                  options={[
                    { value: "ASAP", label: "ASAP" },
                    { value: "SCHEDULED", label: "Schedule" },
                  ]}
                />
                {deliveryTime === "SCHEDULED" && (
                  <Box sx={{ mt: 1 }}>
                    <TextField
                      type="datetime-local"
                      size="small"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography sx={{ mb: 1, fontWeight: 600 }}>Tip</Typography>
                <ChipGroup
                  value={tipPct}
                  onChange={(v) => setTipPct(Number(v))}
                  options={[
                    { value: 0, label: "No tip" },
                    { value: 0.1, label: "10%" },
                    { value: 0.15, label: "15%" },
                    { value: 0.2, label: "20%" },
                  ]}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Right column: totals & CTA */}
          <Grid item xs={12} md={4}>
            <Card sx={{ ...ui.card, position: { md: "sticky" }, top: { md: 24 } }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Total
                </Typography>

                {loading ? (
                  <Skeleton variant="rectangular" height={160} />
                ) : (
                  <>
                    <Row label="Subtotal" value={fmt(subtotal)} />
                    {discount > 0 && <Row label="Promo discount" value={`- ${fmt(discount)}`} />}
                    <Row label="Delivery fee" value={fmt(deliveryFee)} />
                    <Row label="Service fee" value={fmt(serviceFee)} />
                    <Row label="Tax" value={fmt(tax)} />
                    <Row label="Tip" value={fmt(tip)} />
                    <Divider sx={{ my: 1.5 }} />
                    <Row label={<b>To pay</b>} value={<b>{fmt(total)}</b>} />
                    <Button
                      fullWidth
                      sx={{ mt: 2, ...ui.blackBtn }}
                      variant="contained"
                      disabled={!canPlace}
                      onClick={handlePlaceOrder}
                    >
                      {placing ? "Placing..." : "Place order"}
                    </Button>
                    {!canPlace && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                        Select address, payment, and ensure your cart isn’t empty.
                      </Typography>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Sticky bottom bar (mobile) */}
      {!loading && (
        <Box
          sx={{
            position: { xs: "fixed", md: "static" },
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "white",
            borderTop: "1px solid #eee",
            p: 2,
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              To pay
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {fmt(total)}
            </Typography>
          </Box>
          <Button variant="contained" disabled={!canPlace} onClick={handlePlaceOrder} sx={ui.blackBtn}>
            {placing ? "Placing..." : "Place order"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
