import { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Banner from "../components/Banner/Banner";
import SearchBar from "../components/SeachBar/SearchBar";
import ShopList from "../components/ShopList";
import ScrappedShopList from "../components/ScrappedShopList";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
import { STATUSES } from "../app/features/productSlice";

const Shop = () => {
  // All products fetched on app load
  const allProducts = useSelector((state) => state.products.data) || [];

  // Search results — only populated after a search is submitted
  const searchedProducts =
    useSelector((state) => state.searchedProducts.data?.products) || [];
  const amazonProducts =
    useSelector((state) => state.searchedProducts.data?.amazonProducts) || [];
  const flipkartProducts =
    useSelector((state) => state.searchedProducts.data?.flipkartProducts) || [];
  const searchStatus = useSelector((state) => state.searchedProducts.status);

  // Show search results when a search has been performed, otherwise show all products
  const hasSearched = searchStatus !== STATUSES.IDLE;
  const displayProducts = hasSearched ? searchedProducts : allProducts;

  useWindowScrollToTop();

  return (
    <Fragment>
      <Banner title="Products" />
      <section className="filter-bar">
        <Container className="filter-bar-contianer">
          <Row className="justify-content-center">
            <Col md={8}>
              <SearchBar />
            </Col>
          </Row>
        </Container>
        <Container>
          <ShopList productItems={displayProducts} status={searchStatus} />

          {/* External results only shown after a search */}
          {hasSearched && (
            <>
              <ScrappedShopList
                productItems={amazonProducts}
                title="Amazon"
                status={searchStatus}
              />
              <ScrappedShopList
                productItems={flipkartProducts}
                title="Flipkart"
                status={searchStatus}
              />
            </>
          )}
        </Container>
      </section>
    </Fragment>
  );
};

export default Shop;
