import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { url } from "../utils/url";
import "./forms.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${url}/forgot-password`,
        { email },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Password reset link sent to your email.");
        setEmail("");
      } else {
        toast.error(res.data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="auth-card">
        <div className="brand-bar">
          <ion-icon name="bag"></ion-icon>
          <span>ShopSync</span>
        </div>

        <h2>Forgot your password?</h2>
        <p className="auth-subtitle">
          Enter your email and we'll send you a reset link
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="ss-form-label" htmlFor="fp-email">
              Email address
            </label>
            <input
              id="fp-email"
              className="ss-input form-control"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="ss-btn-primary"
            disabled={loading}
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        <p className="ss-helper-text">
          Remembered it? <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
