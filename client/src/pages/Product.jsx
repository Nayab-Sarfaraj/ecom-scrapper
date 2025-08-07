import { Fragment, useEffect, useState } from "react";
import Banner from "../components/Banner/Banner";
import { Container } from "react-bootstrap";
import ShopList from "../components/ShopList";
import { products } from "../utils/products";
import { useParams } from "react-router-dom";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import ProductReviews from "../components/ProductReviews/ProductReviews";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedProduct } from "../app/features/selectedProductSlice";

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch()
  // const [selectedProduct, setSelectedProduct] = useState(
  //   useSelector(state => state.selectedProduct.data)
  // );
  // // setSelectedProduct(useSelector(state => state.selectedProduct.data))
  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
    // setSelectedProduct(
    //   products.filter((item) => parseInt(item.id) === parseInt(id))[0]
    // );

  }, [id]);
  const selectedProduct = useSelector(state => state?.selectedProduct?.data)
  const products = useSelector(state => state.products?.data)
  useEffect(() => { dispatch(fetchSelectedProduct(id)) }, [id])

  useWindowScrollToTop();

  return (
    <Fragment>
      <Banner title={selectedProduct?.name} className="capitalize" />
      <ProductDetails selectedProduct={selectedProduct} />
      <ProductReviews selectedProduct={selectedProduct} />
      <section className="related-products">
        <Container>
          <h3>You might also like</h3>
        </Container>
        <ShopList productItems={products} />
      </section>
    </Fragment>
  );
};

export default Product;
