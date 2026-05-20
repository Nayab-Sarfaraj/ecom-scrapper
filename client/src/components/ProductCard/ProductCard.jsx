import { Col } from "react-bootstrap";
import "./product-card.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../app/features/cart/cartSlice";
import { toggleWishlist } from "../../app/features/wishlistSlice";

const ProductCard = ({ title, productItem }) => {
  const dispatch = useDispatch();
  const router = useNavigate();

  const isWishlisted = useSelector((state) =>
    state.wishlist.wishlist.some((item) => item._id === productItem._id)
  );

  const handelClick = () => {
    router(`/shop/${productItem._id}`);
  };

  const handelAdd = (productItem) => {
    dispatch(addToCart({ product: productItem, num: 1 }));
    toast.success("Added to cart");
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(productItem));
    if (isWishlisted) {
      toast.info("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  return (
    <Col md={3} sm={5} xs={10} className="product mtop">
      <img
        loading="lazy"
        onClick={handelClick}
        src={productItem.coverImage}
        alt={productItem.name}
      />
      <div className="product-like">
        <ion-icon
          name={isWishlisted ? "heart" : "heart-outline"}
          onClick={handleWishlist}
          style={{
            cursor: "pointer",
            color: isWishlisted ? "#e53e3e" : "inherit",
            fontSize: 20,
          }}
        ></ion-icon>
      </div>
      <div className="product-details">
        <h3 onClick={handelClick}>{productItem.name}</h3>
        <div className="rate">
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
        </div>
        <div className="price">
          <h4>₹{productItem.price}</h4>
          <button
            aria-label="Add to cart"
            type="button"
            className="add"
            onClick={() => handelAdd(productItem)}
          >
            <ion-icon name="add"></ion-icon>
          </button>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
