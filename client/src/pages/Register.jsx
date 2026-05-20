import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../app/features/userSlice";
import "./forms.css";

const Register = () => {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    state: "",
    district: "",
    isVendor: false,
    businessName: "",
    contactNumber: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.user.isLogin);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await dispatch(registerUser(formData));
    if (res.payload.success) {
      toast.success("Registration successful");
      navigate("/login");
    } else {
      toast.error(res.payload.message || "Something went wrong");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLogin) navigate("/");
  }, []);

  return (
    <div className="form-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="brand-bar">
          <ion-icon name="bag"></ion-icon>
          <span>ShopSync</span>
        </div>

        <h2>Create your account</h2>
        <p className="auth-subtitle">Join ShopSync and start shopping today</p>

        <form onSubmit={handleSubmit}>
          <p className="ss-section-label">Personal details</p>

          <div className="mb-3">
            <label className="ss-form-label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="ss-input form-control"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="ss-form-label" htmlFor="reg-email">
              Email address
            </label>
            <input
              id="reg-email"
              className="ss-input form-control"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="ss-form-label" htmlFor="reg-password">
              Password
            </label>
            <div className="ss-password-wrapper">
              <input
                id="reg-password"
                className="ss-input form-control"
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Min. 8 characters"
                minLength="8"
                required
              />
              <span
                className="ss-password-toggle"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>
            </div>
          </div>

          <p className="ss-section-label">Location</p>

          <div className="form-grid-2">
            <div className="mb-3">
              <label className="ss-form-label" htmlFor="country">
                Country
              </label>
              <input
                id="country"
                className="ss-input form-control"
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Your country"
                required
              />
            </div>

            <div className="mb-3">
              <label className="ss-form-label" htmlFor="state">
                State
              </label>
              <input
                id="state"
                className="ss-input form-control"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Your state"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="ss-form-label" htmlFor="district">
              District
            </label>
            <input
              id="district"
              className="ss-input form-control"
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              placeholder="Your district"
              required
            />
          </div>

          <div className="vendor-toggle-section mb-3">
            <div className="form-check mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="isVendor"
                name="isVendor"
                checked={formData.isVendor}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="isVendor">
                I want to sell on ShopSync (vendor account)
              </label>
            </div>
          </div>

          {formData.isVendor && (
            <div className="vendor-fields mb-3">
              <p className="ss-section-label" style={{ marginTop: 0 }}>
                Business details
              </p>
              <div className="mb-3">
                <label className="ss-form-label" htmlFor="businessName">
                  Business name
                </label>
                <input
                  id="businessName"
                  className="ss-input form-control"
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Your business name"
                />
              </div>
              <div className="mb-0">
                <label className="ss-form-label" htmlFor="contactNumber">
                  Contact number
                </label>
                <input
                  id="contactNumber"
                  className="ss-input form-control"
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="ss-btn-primary mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="ss-helper-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
