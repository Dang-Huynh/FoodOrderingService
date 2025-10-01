import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/accounts/register/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.detail || "Registration failed");
        setLoading(false);
        return;
      }

      // store JWT token (unchanged behavior)
      localStorage.setItem("token", data.access);
      navigate("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fafafa",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 2,
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          border: "1px solid #eef0f2",
        }}
      >
        <Typography variant="h5" fontWeight={800} mb={2}>
          Create your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            type="email"
            label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              bgcolor: "black",
              fontWeight: 700,
              py: 1.25,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Sign Up"}
          </Button>
        </Box>

        <Box
          sx={{
            my: 2,
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            columnGap: 1.5,
            color: "text.secondary",
            fontSize: 14,
          }}
        >
          <Divider />
          <span>or</span>
          <Divider />
        </Box>

        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderColor: "#ddd",
            py: 1.1,
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "#fefefe",
          }}
        >
          Continue with Google
        </Button>

        <Typography variant="body2" mt={2}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" underline="hover">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
