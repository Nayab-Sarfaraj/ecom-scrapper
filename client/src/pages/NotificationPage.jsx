import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSelectedNotification } from "../app/features/admin/SelectedNotificationSlice";
import { STATUSES } from "../app/features/userSlice";
import Loader from "../components/Loader/Loader";
import "./vendor.css";

const NotificationPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notification = useSelector(
    (state) => state.selectedNotification.data?.notification
  );
  const status = useSelector(
    (state) => state.selectedNotification.status
  );

  useEffect(() => {
    dispatch(fetchSelectedNotification(id));
  }, [id]);

  if (status === STATUSES.LOADING) return <Loader />;
  if (!notification) return null;

  const { user, product } = notification.content;

  return (
    <div className="vendor-page">
      <Container>
        <div className="vendor-page-header">
          <div>
            <h1>Notification</h1>
            <p>Customer product inquiry</p>
          </div>
          <button
            className="vendor-btn outline"
            onClick={() => navigate("/vendor/notifications")}
          >
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
        </div>

        <div className="notif-detail-card">
          <div className="ndc-header">
            <ion-icon name="notifications-outline"></ion-icon>
            <h2>Product Request in Your Area</h2>
          </div>

          <div className="ndc-body">
            <p style={{ fontSize: 14, color: "#374151", marginBottom: 20 }}>
              A customer is looking for a product that matches your inventory
              and is located in your area. Reach out to make a sale.
            </p>

            <p className="notif-section-title">Product details</p>
            <div className="notif-detail-grid">
              <div className="notif-detail-item">
                <span>Product name</span>
                <strong className="text-capitalize">{product.name}</strong>
              </div>
              <div className="notif-detail-item">
                <span>Category</span>
                <strong className="text-capitalize">{product.category}</strong>
              </div>
              <div className="notif-detail-item">
                <span>Price range</span>
                <strong>₹{product.price}</strong>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #f0f2f5",
                margin: "20px 0",
              }}
            />

            <p className="notif-section-title">Customer details</p>
            <div className="notif-detail-grid">
              <div className="notif-detail-item">
                <span>Name</span>
                <strong className="text-capitalize">{user.name}</strong>
              </div>
              <div className="notif-detail-item">
                <span>Location</span>
                <strong>
                  {user.state}, {user.district}
                </strong>
              </div>
              <div className="notif-detail-item">
                <span>Contact</span>
                <strong>{user.email}</strong>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid #f0f2f5",
                margin: "20px 0",
              }}
            />

            <p
              style={{
                fontSize: 13,
                color: "#6b7280",
                marginBottom: 20,
              }}
            >
              Respond promptly to fulfil the customer's request and close the
              sale.
            </p>

            <a
              href={`mailto:${user.email}`}
              className="vendor-btn"
              style={{ display: "inline-flex" }}
            >
              <i className="bi bi-envelope"></i>
              Contact Customer
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotificationPage;
