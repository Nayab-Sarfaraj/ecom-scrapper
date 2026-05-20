import React, { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../app/features/admin/productSlice";
import "./vendor.css";

const ViewProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product } = useSelector((state) => state.product.data);

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  if (!product) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner animation="border" style={{ color: "#0f3460" }} />
      </div>
    );
  }

  return (
    <div className="vendor-page">
      <Container>
        <div className="vendor-page-header">
          <div>
            <h1 className="text-capitalize">{product.name}</h1>
            <p className="text-capitalize">{product.category}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="vendor-btn outline"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i>
              Back
            </button>
            <button
              className="vendor-btn"
              onClick={() => navigate(`/vendor/product/edit/${id}`)}
            >
              <i className="bi bi-pencil"></i>
              Edit Product
            </button>
          </div>
        </div>

        <div className="view-product-layout">
          {/* Images */}
          <div>
            {product.coverImage && (
              <img
                src={product.coverImage}
                alt={product.name}
                className="view-product-img"
              />
            )}
            {product.images?.length > 0 && (
              <div className="view-product-thumb-row">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="view-product-thumb"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="order-detail-card" style={{ alignSelf: "start" }}>
            <div className="odc-header">
              <ion-icon name="cube-outline"></ion-icon>
              <h2>Product Details</h2>
            </div>
            <div className="odc-body">
              <div className="detail-row">
                <span className="detail-label">Name</span>
                <span className="detail-value text-capitalize">
                  {product.name}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Description</span>
                <span className="detail-value">
                  {product.description || "No description available."}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Price</span>
                <span
                  className="detail-value"
                  style={{ fontWeight: 600, color: "#0f3460" }}
                >
                  ₹{product.price}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Category</span>
                <span className="detail-value text-capitalize">
                  {product.category}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Brand</span>
                <span className="detail-value">{product.brand || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Stock</span>
                <span className="detail-value">{product.stock}</span>
              </div>
              {product.rating > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Rating</span>
                  <span
                    className="detail-value"
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <i
                      className="bi bi-star-fill"
                      style={{ color: "#ffcd4e", fontSize: 13 }}
                    ></i>
                    {product.rating}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ViewProduct;
