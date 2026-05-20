import axios from "axios";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteProduct } from "../app/features/cart/cartSlice";
import { url } from "../utils/url";
import "./vendor.css";
import "./forms.css";

const OrderSummary = () => {
  const cartList = useSelector((state) => state.cart.cartList);
  const address = useSelector((state) => state.address.address);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calculateTotal = () =>
    cartList.reduce((acc, p) => acc + p.price * p.qty, 0);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      toast.error("Payment service unavailable. Please refresh and try again.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${url}/payment/order`,
        { amount: calculateTotal() },
        { withCredentials: true }
      );

      const options = {
        key: "rzp_test_KamgQe04JzGUrM",
        amount: data.data.amount,
        currency: data.data.currency,
        name: "ShopSync",
        description: "Order Payment",
        order_id: data.data.id,
        handler: async (response) => {
          try {
            const res = await fetch(`${url}/payment/verify`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await res.json();
            if (verifyData.message) toast.success(verifyData.message);

            const items = cartList.map((ele) => ({
              product: ele._id,
              quantity: ele.qty,
              price: ele.price,
            }));

            await axios.post(
              `${url}/order/new`,
              { items, shippingAddress: { ...address } },
              { withCredentials: true }
            );

            cartList.forEach((item) => dispatch(deleteProduct(item)));
            navigate("/");
          } catch (error) {
            toast.error(
              error?.response?.data?.message || "Something went wrong"
            );
          }
        },
        theme: { color: "#0f3460" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not initiate payment");
    }
  };

  return (
    <div className="vendor-page">
      <Container>
        <div className="vendor-page-header">
          <div>
            <h1>Order Summary</h1>
            <p>Review your order before payment</p>
          </div>
        </div>

        <Row className="g-3">
          {/* Left column */}
          <Col lg={8}>
            {/* Products */}
            <div className="vendor-card mb-3">
              <div className="vendor-card-header">
                <h2>
                  <i
                    className="bi bi-bag me-2"
                    style={{ color: "#0f3460" }}
                  ></i>
                  Items ({cartList.length})
                </h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="vendor-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartList.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <img
                              src={product.coverImage}
                              alt={product.name}
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
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td>₹{product.price}</td>
                        <td>{product.qty}</td>
                        <td style={{ fontWeight: 600, color: "#0f3460" }}>
                          ₹{product.price * product.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipping address */}
            <div className="order-detail-card">
              <div className="odc-header">
                <ion-icon name="location-outline"></ion-icon>
                <h2>Shipping Address</h2>
              </div>
              <div className="odc-body">
                {[
                  ["Street", address.street],
                  ["City", address.city],
                  ["State", address.state],
                  ["Postal code", address.postalCode],
                  ["Country", address.country],
                ].map(([label, value]) => (
                  <div className="detail-row" key={label}>
                    <span className="detail-label">{label}</span>
                    <span className="detail-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Right column — price summary */}
          <Col lg={4}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: 10,
                boxShadow: "0 2px 12px rgba(15,52,96,0.07)",
                padding: 24,
                position: "sticky",
                top: 90,
              }}
            >
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  marginBottom: 16,
                  paddingBottom: 12,
                  borderBottom: "1px solid #f0f2f5",
                }}
              >
                Price Breakdown
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    color: "#6b7280",
                  }}
                >
                  <span>
                    Subtotal ({cartList.length}{" "}
                    {cartList.length === 1 ? "item" : "items"})
                  </span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    color: "#6b7280",
                  }}
                >
                  <span>Shipping</span>
                  <span style={{ color: "#065f46", fontWeight: 600 }}>
                    Free
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  paddingTop: 14,
                  borderTop: "1px solid #f0f2f5",
                  marginBottom: 20,
                }}
              >
                <span>Total</span>
                <span style={{ color: "#0f3460" }}>₹{calculateTotal()}</span>
              </div>

              <button
                className="ss-btn-primary"
                onClick={handlePayment}
              >
                <i className="bi bi-lock me-2"></i>
                Proceed to Payment
              </button>

              <p
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  textAlign: "center",
                  marginTop: 10,
                  marginBottom: 0,
                }}
              >
                Secured by Razorpay
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderSummary;
