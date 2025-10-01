import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // unchanged logic

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password); // same function call as before
      navigate("/"); // redirect home
    } catch (err) {
      setError(err?.message || "Failed to sign in.");
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
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
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
            {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Sign In"}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" my={2}>
          or
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderColor: "#ddd",
            py: 1.1,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Continue with Google
        </Button>

        <Typography variant="body2" mt={2}>
          Don’t have an account?{" "}
          <Link component={RouterLink} to="/register" underline="hover">
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
