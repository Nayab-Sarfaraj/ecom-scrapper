import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteProduct } from "../app/features/admin/productSlice";
import { fetchVendorProduct } from "../app/features/admin/fetchVendorProducts";
import "./vendor.css";

const AdminProducts = () => {
  const products = useSelector((state) => state.vendorProducts?.data.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const res = await dispatch(deleteProduct(id));
    if (res?.payload?.success) {
      toast.success("Product deleted successfully");
    } else {
      toast.error(res.payload?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    dispatch(fetchVendorProduct());
  }, []);

  return (
    <div className="vendor-page">
      <Container>
        <div className="vendor-page-header">
          <div>
            <h1>Products</h1>
            <p>Manage your store inventory</p>
          </div>
          <button
            className="vendor-btn"
            onClick={() => navigate("/vendor/product/create")}
          >
            <i className="bi bi-plus-lg"></i>
            Add Product
          </button>
        </div>

        <div className="vendor-card">
          {products?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table className="vendor-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="td-id">#{product._id.slice(-5)}</td>
                      <td className="text-capitalize">{product.name}</td>
                      <td className="text-capitalize">{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock}</td>
                      <td>
                        {product.rating > 0 ? (
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <i className="bi bi-star-fill" style={{ color: "#ffcd4e", fontSize: 12 }}></i>
                            {product.rating}
                          </span>
                        ) : (
                          <span style={{ color: "#9ca3af", fontSize: 12 }}>None</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            className="tbl-btn view"
                            title="View product"
                            onClick={() =>
                              navigate(`/vendor/product/view/${product._id}`)
                            }
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="tbl-btn edit"
                            title="Edit product"
                            onClick={() =>
                              navigate(`/vendor/product/edit/${product._id}`)
                            }
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="tbl-btn delete"
                            title="Delete product"
                            onClick={() => handleDelete(product._id)}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="vendor-empty">
              <div className="empty-icon">
                <i className="bi bi-box-seam"></i>
              </div>
              <h3>No products yet</h3>
              <p>
                You haven't listed any products. Add your first product to start
                selling.
              </p>
              <button
                className="vendor-btn"
                onClick={() => navigate("/vendor/product/create")}
              >
                <i className="bi bi-plus-lg"></i>
                Add Product
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default AdminProducts;
