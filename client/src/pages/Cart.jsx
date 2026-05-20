import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseQty,
  deleteProduct,
} from "../app/features/cart/cartSlice";
import { useNavigate } from "react-router-dom"
const Cart = () => {
  const { cartList } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  // middlware to localStorage
  const totalPrice = cartList.reduce(
    (price, item) => price + item.qty * item.price,
    0
  );
  console.log(cartList)
  useEffect(() => {
    window.scrollTo(0, 0);
    // if(CartItem.length ===0) {
    //   const storedCart = localStorage.getItem("cartItem");
    //   setCartItem(JSON.parse(storedCart));
    // }
  }, []);
  return (
    <section className="cart-items">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            {cartList.length === 0 && (
              <h1 className="no-items product">No Items are add in Cart</h1>
            )}
            {cartList.map((item) => {
              const productQty = item.price * item.qty;
              return (
                <div className="cart-list" key={item._id}>
                  <Row>
                    <Col className="image-holder" sm={4} md={3}>
                      <img src={item.coverImage} alt="" />
                    </Col>
                    <Col sm={8} md={9}>
                      <Row className="cart-content justify-content-center">
                        <Col xs={12} sm={9} className="cart-details">
                          <h3>{item.name}</h3>
                          <h4>
                            ${item.price}.00 * {item.qty}
                            <span>${productQty}.00</span>
                          </h4>
                        </Col>
                        <Col xs={12} sm={3} className="cartControl">
                          <button
                            className="incCart"
                            onClick={() =>
                              dispatch(addToCart({ product: item, num: 1 }))
                            }
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                          <button
                            className="desCart"
                            onClick={() => dispatch(decreaseQty(item))}
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>
                        </Col>
                      </Row>
                    </Col>
                    <button
                      className="delete"
                      onClick={() => dispatch(deleteProduct(item))}
                    >
                      <ion-icon name="close"></ion-icon>
                    </button>
                  </Row>
                </div>
              );
            })}
          </Col>
          <Col md={4}>
            <div className="cart-total">
              <h2>Cart Summary</h2>
              <div className=" d_flex">
                <h4>Total Price :</h4>
                <h3>₹{totalPrice}.00</h3>
              </div>
            </div>
            <button
              className="mb-4"
              onClick={() => navigate("/checkout")}
              style={{
                width: "100%",
                height: 46,
                background: "#0f3460",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background-color 0.2s",
                fontFamily: "Lato, sans-serif",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0a2647")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0f3460")}
            >
              <i className="bi bi-bag-check"></i>
              Checkout
            </button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Cart;
