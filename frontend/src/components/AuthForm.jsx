// AuthForm.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

function AuthForm({ isLogin = true, onSubmit }) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          {isLogin ? "Sign in to your account" : "Create your account"}
        </h1>

        <form className="auth-form" onSubmit={onSubmit}>
          {!isLogin && <input type="text" placeholder="Full Name" required />}
          <input type="email" placeholder="Email address" required />
          <input type="password" placeholder="Password" required />
          {!isLogin && (
            <input type="password" placeholder="Confirm Password" required />
          )}

          {isLogin && (
            <div className="auth-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>
          )}

          <button type="submit" className="auth-btn">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <button className="google-btn">Continue with Google</button>

        <p className="auth-footer">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link to={isLogin ? "/register" : "/login"} className="auth-link">
            {isLogin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;