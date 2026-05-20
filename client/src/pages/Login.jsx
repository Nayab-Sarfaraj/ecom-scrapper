import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../app/features/userSlice";
import "./forms.css";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.user.isLogin);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await dispatch(loginUser(formData));
    if (res.payload.success) {
      toast.success("Welcome back");
      navigate("/");
    } else {
      toast.error(res.payload.message || "Something went wrong");
    }
    setIsLoading(false);
    setFormData({ email: "", password: "" });
  };

  useEffect(() => {
    if (isLogin) navigate("/");
  }, [isLogin]);

  return (
    <div className="form-page">
      <div className="auth-card">
        <div className="brand-bar">
          <ion-icon name="bag"></ion-icon>
          <span>ShopSync</span>
        </div>

        <h2>Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="ss-form-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
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
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="ss-form-label mb-0" htmlFor="password">
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{ fontSize: "12px", color: "#0f3460", fontWeight: 600 }}
              >
                Forgot password?
              </Link>
            </div>
            <div className="ss-password-wrapper">
              <input
                id="password"
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

          <button
            type="submit"
            className="ss-btn-primary mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="ss-helper-text">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
