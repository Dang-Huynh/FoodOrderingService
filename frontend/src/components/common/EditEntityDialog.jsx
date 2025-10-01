import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button } from "@mui/material";

const ui = { blackBtn: { bgcolor: "black", color: "white", "&:hover": { bgcolor: "#333" } } };

export default function EditEntityDialog({ open, type, initialData, onClose, onSave }) {
  const [data, setData] = useState(initialData || {});
  useEffect(() => setData(initialData || {}), [initialData, open]);

  const isAddress = type === "address";
  const isPayment = type === "payment";

  const validate = () => {
    if (isAddress) return !!(data.label && data.line1 && data.city && data.state && data.zip);
    if (isPayment) {
      return !!data.brand && /^[0-9]{4}$/.test(data.last4 || "") && /^([0-1][0-9])\/([0-9]{2})$/.test(data.exp || "");
    }
    return false;
  };

  const idOrNew = () => data.id || (crypto?.randomUUID?.() ?? `id_${Date.now()}`);
  const handleSave = () => { if (validate()) onSave({ ...data, id: idOrNew() }); };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isAddress ? (data.id ? "Edit Address" : "Add Address") : data.id ? "Edit Payment Method" : "Add Payment Method"}
      </DialogTitle>
      <DialogContent>
        {isAddress && (
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}><TextField label="Label" fullWidth value={data.label || ""} onChange={(e)=>setData({ ...data, label: e.target.value })}/></Grid>
            <Grid item xs={12} sm={6}><TextField label="Instructions" fullWidth value={data.instructions || ""} onChange={(e)=>setData({ ...data, instructions: e.target.value })}/></Grid>
            <Grid item xs={12}><TextField label="Address line 1" fullWidth value={data.line1 || ""} onChange={(e)=>setData({ ...data, line1: e.target.value })}/></Grid>
            <Grid item xs={12}><TextField label="Address line 2" fullWidth value={data.line2 || ""} onChange={(e)=>setData({ ...data, line2: e.target.value })}/></Grid>
            <Grid item xs={12} sm={4}><TextField label="City" fullWidth value={data.city || ""} onChange={(e)=>setData({ ...data, city: e.target.value })}/></Grid>
            <Grid item xs={12} sm={4}><TextField label="State" fullWidth value={data.state || ""} onChange={(e)=>setData({ ...data, state: e.target.value })}/></Grid>
            <Grid item xs={12} sm={4}><TextField label="Postal Code" fullWidth value={data.zip || ""} onChange={(e)=>setData({ ...data, zip: e.target.value })}/></Grid>
          </Grid>
        )}

        {isPayment && (
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}><TextField label="Brand" placeholder="Visa / Mastercard" fullWidth value={data.brand || ""} onChange={(e)=>setData({ ...data, brand: e.target.value })}/></Grid>
            <Grid item xs={12} sm={6}><TextField label="Last 4 digits" fullWidth inputProps={{ maxLength: 4 }} value={data.last4 || ""} onChange={(e)=>setData({ ...data, last4: e.target.value.replace(/\D/g,"") })}/></Grid>
            <Grid item xs={12} sm={6}><TextField label="Expiry (MM/YY)" placeholder="04/28" fullWidth value={data.exp || ""} onChange={(e)=>setData({ ...data, exp: e.target.value })}/></Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={!validate()} sx={ui.blackBtn}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
