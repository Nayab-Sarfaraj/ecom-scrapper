import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchVendorOrders } from "../app/features/admin/fetchOrders";
import { fetchVendorProduct } from "../app/features/admin/fetchVendorProducts";
import { fetchNotifications } from "../app/features/admin/notificationSlice";
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

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const orders = useSelector((state) => state.vendorOrders.data?.orders);
  const products = useSelector((state) => state.vendorProducts.data?.product);
  const notifications = useSelector(
    (state) => state.notifications.data?.notifications
  );

  useEffect(() => {
    dispatch(fetchVendorProduct());
    dispatch(fetchVendorOrders());
    dispatch(fetchNotifications());
  }, []);

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="vendor-page">
      <Container>
        {/* Header */}
        <div className="vendor-page-header">
          <div>
            <h1>
              Welcome back
              {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p>Here's what's happening in your store today</p>
          </div>
          <button
            className="vendor-btn"
            onClick={() => navigate("/vendor/notifications")}
          >
            <i className="bi bi-bell"></i>
            Notifications
            {notifications?.length > 0 && (
              <span
                style={{
                  background: "#e53e3e",
                  color: "#fff",
                  borderRadius: "10px",
                  fontSize: "11px",
                  padding: "1px 6px",
                  marginLeft: 2,
                }}
              >
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Stat cards */}
        <Row className="g-3 mb-4">
          <Col md={4} sm={6}>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-box-seam"></i>
              </div>
              <div className="stat-body">
                <h3>{products?.length ?? "—"}</h3>
                <p>Total products</p>
              </div>
            </div>
          </Col>
          <Col md={4} sm={6}>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-receipt"></i>
              </div>
              <div className="stat-body">
                <h3>{orders?.length ?? "—"}</h3>
                <p>Total orders</p>
              </div>
            </div>
          </Col>
          <Col md={4} sm={6}>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-check2-circle"></i>
              </div>
              <div className="stat-body">
                <h3>
                  {orders?.filter((o) => o.orderStatus === "Delivered")
                    .length ?? "—"}
                </h3>
                <p>Delivered</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Quick actions */}
        <Row className="g-3 mb-4">
          <Col md={4}>
            <div className="action-card">
              <div className="action-icon">
                <i className="bi bi-plus-lg"></i>
              </div>
              <h3>Add Product</h3>
              <p>List a new product in your store for customers to discover.</p>
              <button
                className="vendor-btn"
                onClick={() => navigate("/vendor/product/create")}
              >
                Add Product
              </button>
            </div>
          </Col>
          <Col md={4}>
            <div className="action-card">
              <div className="action-icon">
                <i className="bi bi-grid"></i>
              </div>
              <h3>Manage Products</h3>
              <p>View, edit, or remove products from your inventory.</p>
              <button
                className="vendor-btn outline"
                onClick={() => navigate("/vendor/products")}
              >
                View Products
              </button>
            </div>
          </Col>
          <Col md={4}>
            <div className="action-card">
              <div className="action-icon">
                <i className="bi bi-bag-check"></i>
              </div>
              <h3>View Orders</h3>
              <p>Track and manage orders placed by your customers.</p>
              <button
                className="vendor-btn outline"
                onClick={() => navigate("/vendor/orders")}
              >
                View Orders
              </button>
            </div>
          </Col>
        </Row>

        {/* Recent orders table */}
        {recentOrders.length > 0 && (
          <div className="vendor-card">
            <div className="vendor-card-header">
              <h2>Recent Orders</h2>
              <button
                className="vendor-btn outline"
                style={{ height: 32, fontSize: 12 }}
                onClick={() => navigate("/vendor/orders")}
              >
                View all
              </button>
            </div>
            <div className="vendor-card-body">
              <div style={{ overflowX: "auto" }}>
                <table className="vendor-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((item, idx) => (
                      <tr key={item._id}>
                        <td className="td-id">#{item._id.slice(-5)}</td>
                        <td className="text-capitalize">{item.buyer.name}</td>
                        <td className="text-capitalize">
                          {item.product?.name || "—"}
                        </td>
                        <td>
                          <span
                            className={`status-badge ${statusClass(
                              item.orderStatus
                            )}`}
                          >
                            {item.orderStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            className="tbl-btn view"
                            title="View order"
                            onClick={() =>
                              navigate(`/vendor/order/details/${item._id}`)
                            }
                          >
                            <i className="bi bi-arrow-right"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
