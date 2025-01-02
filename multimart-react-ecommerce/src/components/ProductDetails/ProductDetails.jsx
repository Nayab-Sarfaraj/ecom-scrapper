import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../app/features/cart/cartSlice";
import "./product-details.css";
import { fetchSelectedProduct } from "../../app/features/selectedProductSlice";
import { useParams } from "react-router-dom";

const ProductDetails = ({ selectedProduct }) => {

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };
  const handelAdd = (selectedProduct, quantity) => {
    console.log(quantity)
    dispatch(addToCart({ product: selectedProduct, num: quantity }));
    toast.success("Product has been added to cart!");
  };
  const product = useSelector((state) => state.selectedProduct.data)


  return (
    <section className="product-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <img loading="lazy" src={selectedProduct?.coverImage} alt="" />
          </Col>
          <Col md={6}>
            <h2>{selectedProduct?.name}</h2>
            <div className="rate">
              <div className="stars">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
              </div>
              <span>{selectedProduct?.rating} ratings</span>
            </div>
            <div className="info">
              <span className="price">${selectedProduct?.price}</span>
              <span>category:{selectedProduct?.category}</span>
            </div>
            <p>{selectedProduct?.description}</p>
            <input
              className="qty-input"
              type="number"
              placeholder="Qty"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <button
              aria-label="Add"
              type="submit"
              className="add"
              onClick={() => handelAdd(selectedProduct, quantity)}
            >
              Add To Cart
            </button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductDetails;
