import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { editProduct } from "../app/features/admin/productSlice";
import "./forms.css";

const CATEGORIES = ["Electronics", "Fashion", "Home", "Books", "Other"];

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector((state) =>
    state.vendorProducts.data?.product.find(
      (item) => item._id.toString() === id.toString()
    )
  );

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

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        category: product.category || "Electronics",
        brand: product.brand || "",
        stock: product.stock || 0,
        coverImage: null,
        images: [],
      });
    }
  }, [product]);

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
    setLoading(true);

    const data = new FormData();
    if (formData.name !== product.name) data.append("name", formData.name);
    if (formData.description !== product.description)
      data.append("description", formData.description);
    if (formData.price !== product.price) data.append("price", formData.price);
    if (formData.category !== product.category)
      data.append("category", formData.category);
    if (formData.brand !== product.brand) data.append("brand", formData.brand);
    if (formData.stock !== product.stock) data.append("stock", formData.stock);
    if (formData.coverImage) data.append("coverImage", formData.coverImage);
    if (formData.images.length > 0)
      formData.images.forEach((img, i) => data.append(`images[${i}]`, img));

    try {
      const res = await dispatch(editProduct({ id, data }));
      if (res.payload?.success) {
        toast.success("Product updated successfully!");
        navigate("/vendor/products");
      } else {
        toast.error(res.payload?.message || "Failed to update product");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="form-page">
        <Spinner animation="border" style={{ color: "#0f3460" }} />
      </div>
    );
  }

  return (
    <section className="product-form-page">
      <Container style={{ maxWidth: 700 }}>
        <div className="content-card">
          <div className="card-header-bar">
            <ion-icon name="create-outline"></ion-icon>
            <h2>Edit Product</h2>
          </div>

          <div className="card-body-inner">
            <form onSubmit={handleSubmit} encType="multipart/form-data">

              {/* Basic info */}
              <p className="ss-section-label">Basic information</p>

              <div className="mb-3">
                <label className="ss-form-label" htmlFor="edit-name">
                  Product name <span className="required-star">*</span>
                </label>
                <input
                  id="edit-name"
                  className="ss-input form-control"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Product name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="ss-form-label" htmlFor="edit-desc">
                  Description
                </label>
                <textarea
                  id="edit-desc"
                  className="ss-textarea form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your product…"
                />
              </div>

              {/* Pricing & inventory */}
              <p className="ss-section-label">Pricing &amp; inventory</p>

              <div className="form-grid-2">
                <div className="mb-3">
                  <label className="ss-form-label" htmlFor="edit-price">
                    Price (₹) <span className="required-star">*</span>
                  </label>
                  <input
                    id="edit-price"
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
                  <label className="ss-form-label" htmlFor="edit-stock">
                    Stock quantity
                  </label>
                  <input
                    id="edit-stock"
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
                  <label className="ss-form-label" htmlFor="edit-category">
                    Category
                  </label>
                  <select
                    id="edit-category"
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
                  <label className="ss-form-label" htmlFor="edit-brand">
                    Brand
                  </label>
                  <input
                    id="edit-brand"
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
                <label className="ss-form-label" htmlFor="edit-cover">
                  Cover image
                </label>
                <input
                  id="edit-cover"
                  className="ss-file-input form-control"
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <small style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, display: "block" }}>
                  Leave empty to keep the current cover image
                </small>
              </div>

              <div className="mb-4">
                <label className="ss-form-label" htmlFor="edit-images">
                  Additional images
                </label>
                <input
                  id="edit-images"
                  className="ss-file-input form-control"
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
                <small style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, display: "block" }}>
                  Leave empty to keep existing images
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
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default EditProduct;
