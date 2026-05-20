import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  editOrderStatus,
  editPaymentStatus,
  getOrderById,
} from "../app/features/admin/orderSlice";
import "../pages/forms.css";
import "./vendor.css";

const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

const statusClass = (s = "") => {
  const map = {
    processing: "processing",
    shipped: "shipped",
    delivered: "delivered",
    cancelled: "cancelled",
    pending: "pending",
    paid: "paid",
    failed: "failed",
    refunded: "refunded",
  };
  return map[s.toLowerCase()] || "processing";
};

const AdminOrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector((state) => state.selectedOrder.data?.order);

  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    dispatch(getOrderById(id));
  }, [id]);

  useEffect(() => {
    if (order) {
      setOrderStatus(order.orderStatus);
      setPaymentStatus(order.paymentStatus);
    }
  }, [order]);

  const handleOrderStatus = async (e) => {
    e.preventDefault();
    const res = await dispatch(editOrderStatus({ id, orderStatus }));
    if (!res.payload?.success) {
      toast.error(res.payload?.message || "Something went wrong");
    } else {
      toast.success("Order status updated");
    }
  };

  const handlePaymentStatus = async (e) => {
    e.preventDefault();
    const res = await dispatch(editPaymentStatus({ id, paymentStatus }));
    if (!res.payload?.success) {
      toast.error(res.payload?.message || "Something went wrong");
    } else {
      toast.success("Payment status updated");
    }
  };

  if (!order) return null;

  return (
    <div className="vendor-page">
      <Container>
        <div className="vendor-page-header">
          <div>
            <h1>Order Details</h1>
            <p>Order #{order._id.slice(-8)}</p>
          </div>
          <button
            className="vendor-btn outline"
            onClick={() => navigate("/vendor/orders")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Orders
          </button>
        </div>

        <Row className="g-3">
          {/* Left — order info */}
          <Col lg={8}>
            {/* Customer & product */}
            <div className="order-detail-card mb-3">
              <div className="odc-header">
                <ion-icon name="person-outline"></ion-icon>
                <h2>Customer &amp; Product</h2>
              </div>
              <div className="odc-body">
                <div className="detail-row">
                  <span className="detail-label">Order ID</span>
                  <span className="detail-value" style={{ fontFamily: "monospace" }}>
                    {order._id}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Customer name</span>
                  <span className="detail-value text-capitalize">
                    {order.buyer.name}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Customer email</span>
                  <span className="detail-value">{order.buyer.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Product</span>
                  <span className="detail-value text-capitalize">
                    {order.product.name}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Quantity</span>
                  <span className="detail-value">{order.quantity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Price per unit</span>
                  <span className="detail-value">₹{order.product.price}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total price</span>
                  <span className="detail-value" style={{ fontWeight: 600, color: "#0f3460" }}>
                    ₹{order.totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="order-detail-card mb-3">
              <div className="odc-header">
                <ion-icon name="location-outline"></ion-icon>
                <h2>Shipping Address</h2>
              </div>
              <div className="odc-body">
                <div className="detail-row">
                  <span className="detail-label">Street</span>
                  <span className="detail-value">
                    {order.shippingAddress.street}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">City</span>
                  <span className="detail-value">
                    {order.shippingAddress.city}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">State</span>
                  <span className="detail-value">
                    {order.shippingAddress.state}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Postal code</span>
                  <span className="detail-value">
                    {order.shippingAddress.postalCode}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Country</span>
                  <span className="detail-value">
                    {order.shippingAddress.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="order-detail-card">
              <div className="odc-header">
                <ion-icon name="time-outline"></ion-icon>
                <h2>Timeline</h2>
              </div>
              <div className="odc-body">
                <div className="detail-row">
                  <span className="detail-label">Order status</span>
                  <span className="detail-value">
                    <span className={`status-badge ${statusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Payment status</span>
                  <span className="detail-value">
                    <span className={`status-badge ${statusClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Placed at</span>
                  <span className="detail-value">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last updated</span>
                  <span className="detail-value">
                    {new Date(order.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Col>

          {/* Right — status controls */}
          <Col lg={4}>
            <div className="status-panel">
              <h3>Update Order Status</h3>
              <form onSubmit={handleOrderStatus}>
                <div className="mb-3">
                  <label className="ss-form-label" htmlFor="orderStatus">
                    Order status
                  </label>
                  <select
                    id="orderStatus"
                    className="ss-select form-select"
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="ss-btn-primary">
                  Update Order Status
                </button>
              </form>
            </div>

            <div className="status-panel">
              <h3>Update Payment Status</h3>
              <form onSubmit={handlePaymentStatus}>
                <div className="mb-3">
                  <label className="ss-form-label" htmlFor="paymentStatus">
                    Payment status
                  </label>
                  <select
                    id="paymentStatus"
                    className="ss-select form-select"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="ss-btn-primary">
                  Update Payment Status
                </button>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminOrderDetails;
