import React, { useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createProduct } from "../app/features/admin/productSlice";
import "./forms.css";

const CATEGORIES = ["Electronics", "Fashion", "Home", "Books", "Other"];

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    brand: "",
    stock: 0,
    coverImage: null,
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "coverImage") {
      setFormData({ ...formData, coverImage: files[0] });
    } else if (name === "images") {
      setFormData({ ...formData, images: Array.from(files) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.coverImage) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("brand", formData.brand);
    data.append("stock", formData.stock);
    data.append("coverImage", formData.coverImage);
    data.append("images", formData.images);

    const res = await dispatch(createProduct(data));
    setLoading(false);

    if (res.payload?.success) {
      toast.success("Product created successfully!");
      navigate("/vendor/dashboard");
    } else {
      toast.error(res.payload?.message || "Something went wrong, please try again.");
    }
  };

  return (
    <section className="product-form-page">
      <Container style={{ maxWidth: 700 }}>
        <div className="content-card">
          <div className="card-header-bar">
            <ion-icon name="add-circle-outline"></ion-icon>
            <h2>Create New Product</h2>
          </div>

          <div className="card-body-inner">
            <form onSubmit={handleSubmit} encType="multipart/form-data">

              {/* Basic info */}
              <p className="ss-section-label">Basic information</p>

              <div className="mb-3">
                <label className="ss-form-label" htmlFor="prod-name">
                  Product name <span className="required-star">*</span>
                </label>
                <input
                  id="prod-name"
                  className="ss-input form-control"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="ss-form-label" htmlFor="prod-desc">
                  Description
                </label>
                <textarea
                  id="prod-desc"
                  className="ss-textarea form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your product — features, materials, dimensions…"
                />
              </div>

              {/* Pricing & inventory */}
              <p className="ss-section-label">Pricing &amp; inventory</p>

              <div className="form-grid-2">
                <div className="mb-3">
                  <label className="ss-form-label" htmlFor="prod-price">
                    Price (₹) <span className="required-star">*</span>
                  </label>
                  <input
                    id="prod-price"
                    className="ss-input form-control"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="ss-form-label" htmlFor="prod-stock">
                    Stock quantity
                  </label>
                  <input
                    id="prod-stock"
                    className="ss-input form-control"
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="mb-3">
                  <label className="ss-form-label" htmlFor="prod-category">
                    Category
                  </label>
                  <select
                    id="prod-category"
                    className="ss-select form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="ss-form-label" htmlFor="prod-brand">
                    Brand
                  </label>
                  <input
                    id="prod-brand"
                    className="ss-input form-control"
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g. Sony, Nike…"
                  />
                </div>
              </div>

              {/* Images */}
              <p className="ss-section-label">Images</p>

              <div className="mb-3">
                <label className="ss-form-label" htmlFor="prod-cover">
                  Cover image <span className="required-star">*</span>
                </label>
                <input
                  id="prod-cover"
                  className="ss-file-input form-control"
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                <small style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, display: "block" }}>
                  This will be the main product thumbnail
                </small>
              </div>

              <div className="mb-4">
                <label className="ss-form-label" htmlFor="prod-images">
                  Additional images
                </label>
                <input
                  id="prod-images"
                  className="ss-file-input form-control"
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
                <small style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, display: "block" }}>
                  You can select multiple files
                </small>
              </div>

              <button
                type="submit"
                className="ss-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating…
                  </>
                ) : (
                  "Create Product"
                )}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CreateProduct;
