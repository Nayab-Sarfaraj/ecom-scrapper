import { Row } from "react-bootstrap";
import { memo, useEffect } from "react";
import ProductCard from "./ProductCard/ProductCard";
import ScrapperProductCard from "./ProductCard/ScrappedProductCard";
import { STATUSES } from "../app/features/productSlice";

const ScrapperShopList = ({ productItems, title, status }) => {
  if (status === STATUSES.IDLE) return <></>;
  if (status === STATUSES.LOADING) return <></>;

  return (
    <>
      <header class="bg-dark text-white text-center py-5">
        <h1 class="display-4">{title} Products</h1>
      </header>

      <Row className="justify-content-center">
        {productItems.map((productItem, idx) => {
          return (
            <ScrapperProductCard
              key={idx}
              title={null}
              productItem={productItem}
            />
          );
        })}
        {status === STATUSES.SUCCESS && productItems.length === 0 && (
          <h1 className="not-found text-center mt-3">Not Found !!</h1>
        )}
      </Row>
    </>
  );
};
export default memo(ScrapperShopList);
