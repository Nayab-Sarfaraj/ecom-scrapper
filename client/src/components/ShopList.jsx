import { Row } from "react-bootstrap";
import { memo, useEffect } from "react";
import ProductCard from "./ProductCard/ProductCard";
import { STATUSES } from "../app/features/productSlice";
import Loader from "./Loader/Loader";

const ShopList = ({ productItems, status }) => {
  // useEffect(() => {}, [productItems]);
  if (status === STATUSES.LOADING)
    return (
      <div className="text-center py-4">
        <h3 className="text-black fw-bold">Searching...</h3>
      </div>
    );
  if (status === STATUSES.SUCCESS && productItems.length === 0) {
    return <h1 className="not-found">No Local Vendor Found !!</h1>;
  }
  return (
    <Row className="justify-content-center">
      {productItems.map((productItem) => {
        return (
          <ProductCard
            key={productItem.id}
            title={null}
            productItem={productItem}
          />
        );
      })}
    </Row>
  );
};
export default memo(ShopList);
