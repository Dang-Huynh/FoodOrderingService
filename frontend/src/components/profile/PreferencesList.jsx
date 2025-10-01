import { List, ListItem, ListItemIcon, ListItemText, Switch } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SecurityIcon from "@mui/icons-material/Security";

export default function PreferencesList({ prefs, onChange }) {
  return (
    <List sx={{ p: 0 }}>
      <ListItem sx={{ px: 0 }} secondaryAction={
        <Switch edge="end" checked={prefs.notifications} onChange={(e)=>onChange({ ...prefs, notifications: e.target.checked })}/>
      }>
        <ListItemIcon><NotificationsIcon /></ListItemIcon>
        <ListItemText primary="Push Notifications" secondary="Receive order updates and promotions" />
      </ListItem>

      <ListItem sx={{ px: 0 }} secondaryAction={
        <Switch edge="end" checked={prefs.marketingEmails} onChange={(e)=>onChange({ ...prefs, marketingEmails: e.target.checked })}/>
      }>
        <ListItemIcon><CreditCardIcon /></ListItemIcon>
        <ListItemText primary="Email Notifications" secondary="Get order receipts and promos via email" />
      </ListItem>

      <ListItem sx={{ px: 0 }} secondaryAction={
        <Switch edge="end" checked={prefs.smsUpdates} onChange={(e)=>onChange({ ...prefs, smsUpdates: e.target.checked })}/>
      }>
        <ListItemIcon><SecurityIcon /></ListItemIcon>
        <ListItemText primary="SMS Updates" secondary="Text messages for order status" />
      </ListItem>
    </List>
  );
}
