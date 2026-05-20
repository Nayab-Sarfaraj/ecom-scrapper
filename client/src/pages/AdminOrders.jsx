import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchVendorOrders } from "../app/features/admin/fetchOrders";
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

const AdminOrders = () => {
  const orders = useSelector((state) => state.vendorOrders.data?.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchVendorOrders());
  }, []);

  return (
    <div className="vendor-page">
      <Container>
        <div className="vendor-page-header">
          <div>
            <h1>Orders</h1>
            <p>Track and manage customer orders</p>
          </div>
        </div>

        <div className="vendor-card">
          {orders?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="td-id">#{order._id.slice(-5)}</td>
                      <td className="text-capitalize">{order.buyer.name}</td>
                      <td className="text-capitalize">{order.product.name}</td>
                      <td>{order.quantity}</td>
                      <td>₹{order.totalPrice}</td>
                      <td>
                        <span
                          className={`status-badge ${statusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <button
                          className="tbl-btn view"
                          title="View order details"
                          onClick={() =>
                            navigate(`/vendor/order/details/${order._id}`)
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
          ) : (
            <div className="vendor-empty">
              <div className="empty-icon">
                <i className="bi bi-bag-check"></i>
              </div>
              <h3>No orders yet</h3>
              <p>
                You haven't received any orders. Share your store to start
                getting sales.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default AdminOrders;
