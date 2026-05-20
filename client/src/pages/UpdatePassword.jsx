import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updatePassword } from "../app/features/userSlice";
import "./forms.css";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(updatePassword(formData));
      if (!res.payload?.success) {
        toast.error(res.payload?.message || "Something went wrong");
      } else {
        toast.success("Password updated successfully.");
        setFormData({ oldPassword: "", newPassword: "" });
        navigate("/");
      }
    } catch {
      toast.error("Failed to update password. Please try again.");
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

        <h2>Update password</h2>
        <p className="auth-subtitle">
          Keep your account secure with a strong password
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="ss-form-label" htmlFor="oldPassword">
              Current password
            </label>
            <div className="ss-password-wrapper">
              <input
                id="oldPassword"
                className="ss-input form-control"
                type={showOld ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                placeholder="Your current password"
                required
              />
              <span
                className="ss-password-toggle"
                onClick={() => setShowOld(!showOld)}
                aria-label={showOld ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showOld ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>
            </div>
          </div>

          <div className="mb-4">
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
                placeholder="Min. 6 characters"
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

          <button type="submit" className="ss-btn-primary" disabled={loading}>
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
