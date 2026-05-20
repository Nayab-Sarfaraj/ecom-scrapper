import { Row } from "react-bootstrap";
import { memo } from "react";
import ProductCard from "./ProductCard/ProductCard";
import { STATUSES } from "../app/features/productSlice";

const ShopList = ({ productItems, status }) => {
  if (status === STATUSES.LOADING) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{ color: "#0f3460" }}
          role="status"
        >
          <span className="visually-hidden">Searching…</span>
        </div>
        <p style={{ marginTop: 12, color: "#6b7280", fontSize: 14 }}>
          Searching products…
        </p>
      </div>
    );
  }

  // After a search returned no results
  if (status === STATUSES.SUCCESS && productItems.length === 0) {
    return (
      <h1 className="not-found text-center">No products found</h1>
    );
  }

  // IDLE (initial load) or SUCCESS with results — just render the list
  if (!productItems || productItems.length === 0) return null;

  return (
    <Row className="justify-content-center">
      {productItems.map((productItem) => (
        <ProductCard
          key={productItem._id || productItem.id}
          title={null}
          productItem={productItem}
        />
      ))}
    </Row>
  );
};

export default memo(ShopList);
