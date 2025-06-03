import React from "react";
import { Col, Card } from 'react-bootstrap';
// import { FaExternalLinkAlt } from "react-icons/fa";
import "./scrapped-product.css"
import { Link, useNavigate } from "react-router-dom";

const ScrapperProductCard = ({ productItem }) => {
    const navigate = useNavigate()
    return (
        <Col md={3} sm={5} xs={10} className="product mtop">
            <Card className="product-card" onClick={() => { }}>
                <Card.Img variant="top" src={productItem?.image} alt={productItem.title} />
                <div className="product-like">
                    <a href={productItem.url} target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cursor" viewBox="0 0 16 16">
                            <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103zM2.25 8.184l3.897 1.67a.5.5 0 0 1 .262.263l1.67 3.897L12.743 3.52z" />
                        </svg>
                    </a>
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
