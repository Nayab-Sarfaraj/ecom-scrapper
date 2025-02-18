import { Fragment, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Banner from "../components/Banner/Banner";
import SearchBar from "../components/SeachBar/SearchBar";
import ShopList from "../components/ShopList";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
import { useSelector } from "react-redux";
import ScrappedShopList from "../components/ScrappedShopList";
import PaginationComponent from "../components/PaginationComponent";

const Shop = () => {
  const [filterList, setFilterList] = useState([]);

  // const [products, setProducts] = useState([])
  // const [amazonProducts, setAmazonProducts] = useState([])
  const products = useSelector(state => state.searchedProducts.data?.products) || []
  const amazonProducts = useSelector(state => state.searchedProducts.data?.amazonProducts) || []
  const flipkartProducts = useSelector(state => state.searchedProducts.data?.flipkartProducts) || []

  useWindowScrollToTop();

  return (
    <Fragment>
      <Banner title="product" />
      <section className="filter-bar">
        <Container className="filter-bar-contianer">
          <Row className="justify-content-center">
            {/* <Col md={4}>
              <FilterSelect setFilterList={setFilterList} />
            </Col> */}
            <Col md={8}>
              <SearchBar setFilterList={setFilterList} />
            </Col>
          </Row>
        </Container>
        <Container>
          <ShopList productItems={products} />
          <ScrappedShopList productItems={amazonProducts} title={"Amazon"} />
          <ScrappedShopList productItems={flipkartProducts} title={"Flipkart"} />
        </Container>
      </section>
    </Fragment>
  );
};

export default Shop;
