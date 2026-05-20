import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../app/features/cart/cartSlice";
import { removeFromWishlist } from "../app/features/wishlistSlice";
import "./vendor.css";

const Wishlist = () => {
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ product, num: 1 }));
    dispatch(removeFromWishlist(product));
    toast.success("Moved to cart");
  };

  const handleRemove = (product) => {
    dispatch(removeFromWishlist(product));
    toast.info("Removed from wishlist");
  };

  return (
    <div className="vendor-page">
      <Container>
        <div className="vendor-page-header">
          <div>
            <h1>Wishlist</h1>
            <p>
              {wishlist.length} saved{" "}
              {wishlist.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            className="vendor-btn outline"
            onClick={() => navigate("/shop")}
          >
            <i className="bi bi-bag"></i>
            Continue Shopping
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div className="vendor-card">
            <div className="vendor-empty">
              <div className="empty-icon">
                <i className="bi bi-heart"></i>
              </div>
              <h3>Your wishlist is empty</h3>
              <p>
                Save items you love by tapping the heart on any product.
              </p>
              <button
                className="vendor-btn"
                onClick={() => navigate("/shop")}
              >
                <i className="bi bi-bag"></i>
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <Row className="g-3">
            {wishlist.map((product) => (
              <Col md={3} sm={6} xs={12} key={product._id}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 10,
                    boxShadow: "0 2px 12px rgba(15,52,96,0.07)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      background: "#f6f9fc",
                      height: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      padding: 12,
                    }}
                    onClick={() => navigate(`/shop/${product._id}`)}
                  >
                    <img
                      src={product.coverImage}
                      alt={product.name}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div
                    style={{
                      padding: "14px 16px",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1a1a2e",
                        margin: 0,
                        textTransform: "capitalize",
                        cursor: "pointer",
                        lineHeight: 1.4,
                      }}
                      onClick={() => navigate(`/shop/${product._id}`)}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#0f3460",
                        margin: 0,
                      }}
                    >
                      ₹{product.price}
                    </p>

                    {/* Actions */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: "auto",
                        paddingTop: 10,
                      }}
                    >
                      <button
                        className="vendor-btn"
                        style={{ flex: 1, height: 34, fontSize: 12 }}
                        onClick={() => handleMoveToCart(product)}
                      >
                        <i className="bi bi-bag-plus"></i>
                        Add to Cart
                      </button>
                      <button
                        className="tbl-btn delete"
                        title="Remove from wishlist"
                        onClick={() => handleRemove(product)}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Wishlist;
