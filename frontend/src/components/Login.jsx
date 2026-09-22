import { useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sprout,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { API_BASE_URL } from "../config";
import "./Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to sign in."
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      onLogin(data.user);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Background decoration */}
      <div className="login-background">
        <div className="background-orb orb-one"></div>
        <div className="background-orb orb-two"></div>
        <div className="background-grid"></div>
      </div>

      <main className="login-container">

        {/* Left branding panel */}
        <section className="login-brand">

          <div className="brand-icon">
            <Sprout size={28} strokeWidth={2.2} />
          </div>

          <div className="brand-badge">
            <span className="status-dot"></span>
            REMOTE SENSING PLATFORM
          </div>

          <h1>
            Sugarcane
            <span>Water Stress</span>
            Monitoring
          </h1>

          <p className="brand-description">
            A GIS-enabled platform for detecting,
            classifying and monitoring water stress
            in sugarcane fields using SAR observations.
          </p>

          <div className="brand-features">

            <div className="feature">
              <div className="feature-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>Secure access</strong>
                <span>Role-based monitoring</span>
              </div>
            </div>

            <div className="feature">
              <div className="feature-icon">
                <Sprout size={18} />
              </div>

              <div>
                <strong>Field intelligence</strong>
                <span>Plot-level stress analysis</span>
              </div>
            </div>

          </div>

          <div className="brand-footer">
            Betul Agricultural Monitoring • Prototype
          </div>

        </section>

        {/* Login card */}
        <section className="login-panel">

          <div className="login-card">

            <div className="login-header">

              <div className="mobile-brand-icon">
                <Sprout size={24} />
              </div>

              <h2>Welcome back</h2>

              <p>
                Sign in to access your monitoring portal.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="form-group">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="input-wrapper">

                  <Mail
                    size={18}
                    className="input-icon"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* Password */}
              <div className="form-group">

                <div className="password-label-row">
                  <label htmlFor="password">
                    Password
                  </label>
                </div>

                <div className="input-wrapper">

                  <LockKeyhole
                    size={18}
                    className="input-icon"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* Error */}
              {error && (
                <div className="login-error">
                  <strong>Sign in failed</strong>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >

                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="spinner"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={19} />
                  </>
                )}

              </button>

            </form>

            {/* Demo accounts */}
            <div className="demo-access">

              <div className="demo-title">
                Prototype access
              </div>

              <div className="demo-account">
                <span>Admin</span>
                <code>
                  admin@sugarcane.local
                </code>
              </div>

              <div className="demo-account">
                <span>Farmer</span>
                <code>
                  farmer1@sugarcane.local
                </code>
              </div>

            </div>

            <div className="login-security">
              <LockKeyhole size={14} />
              Protected by role-based access control
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Login;