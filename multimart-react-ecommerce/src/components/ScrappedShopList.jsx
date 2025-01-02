import { Row } from "react-bootstrap";
import { memo, useEffect } from "react";
import ProductCard from "./ProductCard/ProductCard";
import ScrapperProductCard from "./ProductCard/ScrappedProductCard";

const ScrapperShopList = ({ productItems, title }) => {
    useEffect(() => { }, [productItems]);
    if (productItems.length === 0) {

        return <h1 className="not-found">Product Not Found !!</h1>;
    }
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
            </Row>
        </>
    );
};
export default memo(ScrapperShopList);
