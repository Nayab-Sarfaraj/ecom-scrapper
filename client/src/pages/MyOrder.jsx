import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders, STATUSES } from "../app/features/orderSlice";
import "./vendor.css";

const statusClass = (s = "") => {
  const map = {
    processing: "processing",
    shipped: "shipped",
    delivered: "delivered",
    cancelled: "cancelled",
  };
  return map[s.toLowerCase()] || "processing";
};

const MyOrder = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.myOrders.status);
  const orders = useSelector((state) => state.myOrders.data?.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, []);

  if (status === STATUSES.LOADING) {
    return (
      <div className="vendor-page">
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "80px 0",
            }}
          >
            <div
              className="spinner-border"
              style={{ color: "#0f3460" }}
              role="status"
            >
              <span className="visually-hidden">Loading…</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="vendor-page">
      <Container>
        <div className="vendor-page-header">
          <div>
            <h1>My Orders</h1>
            <p>Track your purchases and order history</p>
          </div>
        </div>

        <div className="vendor-card">
          {orders?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="td-id">#{order._id.slice(-5)}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <img
                            src={order.product.coverImage}
                            alt={order.product.name}
                            style={{
                              width: 44,
                              height: 44,
                              objectFit: "contain",
                              borderRadius: 6,
                              background: "#f6f9fc",
                              border: "1px solid #e9ecef",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontWeight: 500,
                              color: "#1a1a2e",
                              textTransform: "capitalize",
                            }}
                          >
                            {order.product.name}
                          </span>
                        </div>
                      </td>
                      <td>{order.quantity}</td>
                      <td style={{ fontWeight: 600, color: "#0f3460" }}>
                        ₹{order.totalPrice}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${statusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="vendor-empty">
              <div className="empty-icon">
                <i className="bi bi-bag-x"></i>
              </div>
              <h3>No orders yet</h3>
              <p>
                You haven't placed any orders. Start shopping to see your
                orders here.
              </p>
              <a href="/shop" className="vendor-btn">
                <i className="bi bi-bag"></i>
                Browse Shop
              </a>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default MyOrder;
