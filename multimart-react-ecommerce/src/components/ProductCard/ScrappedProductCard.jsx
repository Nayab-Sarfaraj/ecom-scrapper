import React from "react";
import { Col, Card } from 'react-bootstrap';
// import { FaExternalLinkAlt } from "react-icons/fa";
import "./scrapped-product.css"

const ScrapperProductCard = ({ productItem }) => {
    return (
        <Col md={3} sm={5} xs={10} className="product mtop">
            <Card className="product-card" onClick={() => { }}>
                <Card.Img variant="top" src={productItem?.image} alt={productItem.title} />
                <div className="product-like">
                    <ion-icon name="heart-outline"></ion-icon>
                </div>
                <Card.Body>
                    <Card.Title>{productItem.title}</Card.Title>
                    <div className="rating-text">
                        Rating: {productItem?.rating || 0} / 5
                    </div>
                    <div className="price">
                        <h4>{productItem.price}</h4>
                        <button
                            aria-label="Add"
                            type="button"
                            className="add"
                            onClick={() => { }}
                        >
                            <ion-icon name="add"></ion-icon>
                        </button>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ScrapperProductCard;
