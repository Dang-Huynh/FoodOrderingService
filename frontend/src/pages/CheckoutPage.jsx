import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Container, Grid, Box, Alert, Typography } from "@mui/material";
import { placeOrder } from "../api";

// Components
import OrderSummary from "../components/checkout/OrderSummary";
import AddressSelection from "../components/checkout/AddressSelection";
import PaymentSelection from "../components/checkout/PaymentSelection";
import DeliveryOptions from "../components/checkout/DeliveryOptions";
import TotalsCard from "../components/checkout/TotalsCard";
import { usePromoCodes } from "../hooks/usePromoCodes";
import { ui } from "../utils/ui";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, inc, dec, remove, clear } = useCart();

  // state
  const [addressId, setAddressId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("ASAP");
  const [scheduledTime, setScheduledTime] = useState("");
  const [tipPct, setTipPct] = useState(0.1);
  const [promo, setPromo] = useState("");
  const {
    appliedPromo,
    applyPromo,
    error: promoError,
    clearPromo,
  } = usePromoCodes();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  // Totals
  const { subtotal, deliveryFee, serviceFee, tax, tip, discount, total } =
    useMemo(() => {
      const sub = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
      const delivery = sub > 40 ? 0 : 2.99;
      const service = sub * 0.05;
      const t = (sub + delivery + service) * 0.08875;
      const tipVal = (sub + delivery + service) * tipPct;
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
    cart.length > 0 &&
    addressId &&
    paymentId &&
    (deliveryTime === "ASAP" ||
      (deliveryTime === "SCHEDULED" && scheduledTime));

  const handlePlaceOrder = async () => {
    if (!canPlace) return;
    setPlacing(true);
    setError("");
    try {
      const restaurantId =
        cart[0]?.restaurantId || localStorage.getItem("lastRestaurantId");
      if (!restaurantId) throw new Error("Missing restaurant reference.");

      const items = cart.map((it) => ({
        menu_item_id: it.id,
        name: it.name,
        unit_price: String(it.price),
        quantity: it.qty,
        image: it.image || "",
      }));
      const placed = await placeOrder({ restaurant_id: restaurantId, items });
      clear();
      navigate(`/order/${placed.id}`);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#fafbfc", minHeight: "100vh", pb: 6, pt: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Checkout
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {promoError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {promoError}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={10}>
            <OrderSummary
              cart={cart}
              inc={inc}
              dec={dec}
              remove={remove}
              promo={promo}
              setPromo={setPromo}
              appliedPromo={appliedPromo}
              applyPromo={applyPromo}
              clearPromo={clearPromo}
            />
            <AddressSelection
              addressId={addressId}
              setAddressId={setAddressId}
              ui={ui}
            />
            <PaymentSelection
              paymentId={paymentId}
              setPaymentId={setPaymentId}
              ui={ui}
            />
            <DeliveryOptions
              deliveryTime={deliveryTime}
              setDeliveryTime={setDeliveryTime}
              scheduledTime={scheduledTime}
              setScheduledTime={setScheduledTime}
              tipPct={tipPct}
              setTipPct={setTipPct}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TotalsCard
              subtotal={subtotal}
              discount={discount}
              deliveryFee={deliveryFee}
              serviceFee={serviceFee}
              tax={tax}
              tip={tip}
              total={total}
              canPlace={canPlace}
              placing={placing}
              onPlace={handlePlaceOrder}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
