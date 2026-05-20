import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../app/features/userSlice";
import "./vendor.css";

const Profile = () => {
  const user = useSelector((state) => state.user.data);
  const isVendor = useSelector((state) => state.user.isVendor);
  const wishlistCount = useSelector((state) => state.wishlist.wishlist.length);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // inline profile details panel
  const [showDetails, setShowDetails] = useState(false);

  const handleLogout = async () => {
    const res = await dispatch(logoutUser());
    if (res.payload.success) {
      navigate("/");
      toast.success("Logged out successfully");
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("")
    : "U";

  return (
    <div className="vendor-page">
      <Container style={{ maxWidth: 860 }}>

        {/* ── Profile header ── */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 10,
            boxShadow: "0 2px 12px rgba(15,52,96,0.07)",
            padding: "28px 28px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: "#0f3460",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "#ffffff",
              flexShrink: 0,
              letterSpacing: 1,
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                fontSize: 19,
                fontWeight: 700,
                color: "#1a1a2e",
                margin: "0 0 3px",
                textTransform: "capitalize",
              }}
            >
              {user?.name}
            </h2>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              {user?.email}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {isVendor && (
              <button
                className="vendor-btn outline"
                onClick={() => navigate("/vendor/dashboard")}
              >
                <i className="bi bi-speedometer2"></i>
                Dashboard
              </button>
            )}
            <button
              className="vendor-btn"
              style={{ background: "#dc2626" }}
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right"></i>
              Sign out
            </button>
          </div>
        </div>

        {/* ── Quick-action cards ── */}
        <Row className="g-3 mb-3">
          {/* My Orders */}
          <Col md={4}>
            <div className="action-card">
              <div className="action-icon">
                <i className="bi bi-bag-check"></i>
              </div>
              <h3>My Orders</h3>
              <p>View and track your past and current orders.</p>
              <button
                className="vendor-btn"
                onClick={() => navigate("/order")}
              >
                View Orders
              </button>
            </div>
          </Col>

          {/* Wishlist */}
          <Col md={4}>
            <div className="action-card">
              <div className="action-icon">
                <i className="bi bi-heart"></i>
              </div>
              <h3>
                Wishlist
                {wishlistCount > 0 && (
                  <span
                    style={{
                      marginLeft: 8,
                      background: "#0f3460",
                      color: "#fff",
                      borderRadius: 10,
                      fontSize: 11,
                      padding: "1px 7px",
                      fontWeight: 600,
                      verticalAlign: "middle",
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </h3>
              <p>Browse items you've saved for later.</p>
              <button
                className="vendor-btn outline"
                onClick={() => navigate("/wishlist")}
              >
                View Wishlist
              </button>
            </div>
          </Col>

          {/* Profile Details */}
          <Col md={4}>
            <div className="action-card">
              <div className="action-icon">
                <i className="bi bi-person"></i>
              </div>
              <h3>Profile Details</h3>
              <p>View your account information and location.</p>
              <button
                className="vendor-btn outline"
                onClick={() => setShowDetails((v) => !v)}
              >
                {showDetails ? "Hide Details" : "View Details"}
              </button>
            </div>
          </Col>
        </Row>

        {/* ── Inline profile details panel ── */}
        {showDetails && (
          <div className="vendor-card mb-3">
            <div className="vendor-card-header">
              <h2>Account Information</h2>
            </div>
            <div style={{ padding: "0 0 4px" }}>
              {[
                ["Full name", user?.name],
                ["Email", user?.email],
                ["Country", user?.country],
                ["State", user?.state],
                ["District", user?.district],
                ["Account type", isVendor ? "Vendor" : "Customer"],
              ].map(([label, value]) =>
                value ? (
                  <div className="detail-row" key={label}
                    style={{ padding: "12px 24px", borderBottom: "1px solid #f0f2f5", display: "flex", gap: 8, fontSize: 14 }}>
                    <span style={{ fontWeight: 600, color: "#374151", minWidth: 140, flexShrink: 0 }}>
                      {label}
                    </span>
                    <span style={{ color: "#6b7280", textTransform: "capitalize" }}>
                      {value}
                    </span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* ── Update password ── */}
        <div style={{ textAlign: "center" }}>
          <button
            className="vendor-btn outline"
            onClick={() => navigate("/password/update")}
          >
            <i className="bi bi-lock"></i>
            Update Password
          </button>
        </div>

      </Container>
    </div>
  );
};

export default Profile;
