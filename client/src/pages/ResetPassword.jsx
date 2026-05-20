import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { url } from "../utils/url";
import "./forms.css";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!token) return toast.error("Invalid or expired reset link.");

    setLoading(true);
    try {
      await axios.put(
        `${url}/resetPassword/${token}`,
        { password: newPassword },
        { withCredentials: true }
      );
      toast.success("Password updated successfully.");
      setFormData({ newPassword: "", confirmPassword: "" });
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update password. Please try again."
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

        <h2>Set a new password</h2>
        <p className="auth-subtitle">Choose a strong password for your account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="ss-form-label" htmlFor="newPassword">
              New password
            </label>
            <div className="ss-password-wrapper">
              <input
                id="newPassword"
                className="ss-input form-control"
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Min. 8 characters"
                minLength="8"
                required
              />
              <span
                className="ss-password-toggle"
                onClick={() => setShowNew(!showNew)}
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showNew ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="ss-form-label" htmlFor="confirmPassword">
              Confirm new password
            </label>
            <div className="ss-password-wrapper">
              <input
                id="confirmPassword"
                className="ss-input form-control"
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Repeat your new password"
                minLength="8"
                required
              />
              <span
                className="ss-password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>
            </div>
          </div>

          <button type="submit" className="ss-btn-primary" disabled={loading}>
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>

        <p className="ss-helper-text">
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
