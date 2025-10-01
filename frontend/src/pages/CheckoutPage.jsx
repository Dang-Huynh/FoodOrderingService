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

/** ---------------- UI tokens ---------------- */
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

/** ✅ Inline mocks */
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
  {
    id: "addr-work",
    label: "Work",
    line1: "77 Hudson Blvd",
    line2: "Floor 19",
    city: "New York",
    state: "NY",
    zip: "10018",
    isDefault: false,
  },
];

const mockPayments = [
  { id: "pm-visa", brand: "Visa", last4: "4242", exp: "04/28", isDefault: true },
  { id: "pm-amex", brand: "Amex", last4: "0005", exp: "11/27", isDefault: false },
];

/** Promo codes inline (type: PCT or ABS) */
const promoCodes = [
  { code: "WELCOME20", type: "PCT", value: 0.2, label: "20% off" },
  { code: "FREESHIP", type: "ABS", value: 2.99, label: "Free delivery" },
  { code: "SAVE10", type: "ABS", value: 10, label: "$10 off" },
];

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
  const { cart, inc, dec, remove, clear } = useCart();

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

  /** Load mock addresses/payments */
  useEffect(() => {
    const a = mockAddresses;
    const p = mockPayments;
    setAddresses(a);
    setPayments(p);
    const defAddr = a.find((x) => x.isDefault) || a[0];
    const defPay = p.find((x) => x.isDefault) || p[0];
    setAddressId(defAddr?.id || "");
    setPaymentId(defPay?.id || "");
  }, []);

  /** Totals (cart from context) */
  const { subtotal, deliveryFee, serviceFee, tax, tip, discount, total } =
    useMemo(() => {
      const sub = (cart || []).reduce(
        (sum, i) => sum + (i.price || 0) * (i.qty || 1),
        0
      );
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
      return {
        subtotal: sub,
        deliveryFee: delivery,
        serviceFee: service,
        tax: t,
        tip: tipVal,
        discount: disc,
        total: tot,
      };
    }, [cart, tipPct, appliedPromo]);

  const canPlace =
    !placing &&
    (cart?.length ?? 0) > 0 &&
    addressId &&
    paymentId &&
    (deliveryTime === "ASAP" ||
      (deliveryTime === "SCHEDULED" && scheduledTime));

  /** Promo (uses inline codes) */
  const applyPromo = () => {
    setError("");
    const code = promo.trim().toUpperCase();
    if (!code) return;
    const hit = promoCodes.find((x) => x.code === code);
    if (hit) {
      setAppliedPromo(hit);
      setPromo("");
    } else {
      setAppliedPromo(null);
      setError("Promo code is invalid or expired.");
    }
  };

  /** Place order */
  const handlePlaceOrder = async () => {
    if (!canPlace) return;
    setPlacing(true);
    setError("");
    try {
      let restaurantId = cart?.[0]?.restaurantId;
      if (!restaurantId) {
        const fallback = localStorage.getItem("lastRestaurantId");
        if (fallback) restaurantId = parseInt(fallback);
      }
      if (!restaurantId) {
        setError("Missing restaurant reference. Please add items again.");
        return;
      }

      const items = (cart || []).map((it) => ({
        menu_item_id: it.id,
        name: it.name,
        unit_price: String(it.price),
        quantity: it.qty ?? it.quantity ?? 1,
        image: it.image || "",
      }));

      const payload = { restaurant_id: restaurantId, items };
      const placed = await placeOrder(payload);

      clear();
      navigate(`/order/${placed.id}`);
    } catch (e) {
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

  const loading = addresses === null || payments === null;

  return (
    <Box
      sx={{
        bgcolor: ui.pageBg,
        minHeight: "100vh",
        pb: { xs: 10, md: 4 },
        pt: 3,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, mb: 2, letterSpacing: -0.2 }}
        >
          Checkout
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Left column */}
          <Grid item xs={12} md={10}>
            {/* Order summary */}
            <Card sx={{ ...ui.card, mb: 3 }}>
              <CardContent>
                <Typography
                  variant="overline"
                  sx={{
                    color: "text.secondary",
                    letterSpacing: 1,
                    fontWeight: 700,
                  }}
                >
                  ORDER SUMMARY
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Review your items
                </Typography>

                {loading ? (
                  <Skeleton variant="rectangular" height={120} />
                ) : (cart?.length ?? 0) === 0 ? (
                  <Typography color="text.secondary">
                    Your cart is empty.
                  </Typography>
                ) : (
                  <>
                    <List>
                      {cart.map((item) => (
                        <ListItem
                          key={item.id}
                          sx={{
                            px: 0,
                            pr: { xs: 10, sm: 20 },
                            py: 1,
                            "&:not(:last-of-type)": {
                              borderBottom: "1px solid #f0f2f4",
                            },
                          }}
                          secondaryAction={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                minWidth: 120,
                                justifyContent: "flex-end",
                                flexShrink: 0,
                              }}
                            >
                              <Typography
                                sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                              >
                                {fmt((item.price || 0) * (item.qty || 1))}
                              </Typography>
                              <IconButton
                                edge="end"
                                aria-label="Remove item"
                                onClick={() => remove(item.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          }
                        >
                          {/* Thumbnail */}
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            sx={{
                              width: 96,
                              height: 64,
                              borderRadius: 1,
                              objectFit: "cover",
                              mr: 1.5,
                              flexShrink: 0,
                              border: "1px solid #eef0f2",
                            }}
                          />

                          {/* Name + desc + qty chips */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{ fontWeight: 700, lineHeight: 1.2 }}
                              noWrap
                            >
                              {item.name}
                              {item.qty > 1 ? ` × ${item.qty}` : ""}
                            </Typography>
                            {item.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                              >
                                {item.description}
                              </Typography>
                            )}

                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              sx={{ mt: 1 }}
                            >
                              <Chip
                                label="-"
                                onClick={() => dec(item.id)}
                                variant="outlined"
                                size="small"
                                sx={{
                                  height: 28,
                                  borderRadius: "999px",
                                  px: 0.5,
                                }}
                              />
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  minWidth: 24,
                                  textAlign: "center",
                                }}
                              >
                                {item.qty || 1}
                              </Typography>
                              <Chip
                                label="+"
                                onClick={() => inc(item.id)}
                                variant="outlined"
                                size="small"
                                sx={{
                                  height: 28,
                                  borderRadius: "999px",
                                  px: 0.5,
                                }}
                              />
                            </Stack>
                          </Box>
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
                <Typography
                  variant="overline"
                  sx={{
                    color: "text.secondary",
                    letterSpacing: 1,
                    fontWeight: 700,
                  }}
                >
                  DELIVERY ADDRESS
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Choose where we’re heading
                </Typography>

                {loading ? (
                  <Skeleton variant="rectangular" height={68} />
                ) : (addresses || []).length === 0 ? (
                  <Typography color="text.secondary">
                    No addresses yet.
                  </Typography>
                ) : (
                  <List>
                    {addresses.map((a) => (
                      <ListItemButton
                        key={a.id}
                        selected={addressId === a.id}
                        onClick={() => setAddressId(a.id)}
                        sx={{ borderRadius: 1 }}
                      >
                        <Radio
                          edge="start"
                          checked={addressId === a.id}
                          tabIndex={-1}
                        />
                        <ListItemText
                          primary={<b>{a.label}</b>}
                          secondary={`${a.line1}${
                            a.line2 ? `, ${a.line2}` : ""
                          }, ${a.city}`}
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
                    <Link
                      component="button"
                      onClick={() => navigate("/profile")}
                    >
                      Edit
                    </Link>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Payment selection */}
            <Card sx={{ ...ui.card, mb: 3 }}>
              <CardContent>
                <Typography
                  variant="overline"
                  sx={{
                    color: "text.secondary",
                    letterSpacing: 1,
                    fontWeight: 700,
                  }}
                >
                  PAYMENT METHOD
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  How would you like to pay?
                </Typography>

                {loading ? (
                  <Skeleton variant="rectangular" height={68} />
                ) : (payments || []).length === 0 ? (
                  <Typography color="text.secondary">
                    No payment methods yet.
                  </Typography>
                ) : (
                  <List>
                    {payments.map((p) => (
                      <ListItemButton
                        key={p.id}
                        selected={paymentId === p.id}
                        onClick={() => setPaymentId(p.id)}
                        sx={{ borderRadius: 1 }}
                      >
                        <Radio
                          edge="start"
                          checked={paymentId === p.id}
                          tabIndex={-1}
                        />
                        <ListItemText
                          primary={`${p.brand} •••• ${p.last4}`}
                          secondary={`Expires ${p.exp}`}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                )}

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Link component="button" onClick={() => navigate("/profile")}>
                    Add new payment
                  </Link>
                  {paymentId && (
                    <Link
                      component="button"
                      onClick={() => navigate("/profile")}
                    >
                      Edit
                    </Link>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Delivery options: time + tip */}
            <Card sx={{ ...ui.card, mb: 3 }}>
              <CardContent>
                <Typography
                  variant="overline"
                  sx={{
                    color: "text.secondary",
                    letterSpacing: 1,
                    fontWeight: 700,
                  }}
                >
                  DELIVERY OPTIONS
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Time & tip
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
          <Grid item xs={12} md={2}>
            <Card
              sx={{ ...ui.card, position: { md: "sticky" }, top: { md: 24 } }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Total
                </Typography>

                {loading ? (
                  <Skeleton variant="rectangular" height={160} />
                ) : (
                  <>
                    <Row label="Subtotal" value={fmt(subtotal)} />
                    {discount > 0 && (
                      <Row
                        label="Promo discount"
                        value={`- ${fmt(discount)}`}
                      />
                    )}
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
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 1 }}
                      >
                        Select address, payment, and ensure your cart isn’t
                        empty.
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
          <Button
            variant="contained"
            disabled={!canPlace}
            onClick={handlePlaceOrder}
            sx={ui.blackBtn}
          >
            {placing ? "Placing..." : "Place order"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
