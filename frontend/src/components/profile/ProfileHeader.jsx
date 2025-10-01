import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export default function ProfileHeader({ user, fileRef, onChangePhoto }) {
  const initials = user.name?.split(" ")?.map((n) => n[0])?.join("") || "U";
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={user.avatar}
          sx={{ width: 88, height: 88, border: "4px solid #fff", boxShadow: "0 6px 18px rgba(0,0,0,0.12)" }}
        >
          {initials}
        </Avatar>
        <Tooltip title="Change photo">
          <IconButton
            aria-label="Change profile photo"
            onClick={() => fileRef.current?.click()}
            size="small"
            sx={{ position: "absolute", bottom: -6, right: -6, bgcolor: "white", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <PhotoCameraIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onChangePhoto} />
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
  );
}
