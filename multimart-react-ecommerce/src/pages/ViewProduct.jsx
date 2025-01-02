import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Container, Spinner } from "react-bootstrap";
import { getProductById } from "../app/features/admin/productSlice"; // Assuming this action exists

const ViewProduct = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { product } = useSelector((state => state.product.data))

    useEffect(() => {
        dispatch(getProductById(id));
        // Fetch the product when the component loads
        console.log(product)
    }, [dispatch, id]);

    const handleEdit = () => {
        navigate(`/vendor/product/edit/${id}`); // Navigate to the edit page
    };

    if (!product) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" />
            </Container>
        );
    }



    return (
        <Container className="my-4">
            <Card className="p-4 shadow-sm">
                <h2>Product Details</h2>
                <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text><strong>Description:</strong> {product.description || "No description available."}</Card.Text>
                    <Card.Text><strong>Price:</strong> ${product.price}</Card.Text>
                    <Card.Text><strong>Category:</strong> {product.category}</Card.Text>
                    <Card.Text><strong>Brand:</strong> {product.brand || "N/A"}</Card.Text>
                    <Card.Text><strong>Stock:</strong> {product.stock}</Card.Text>

                    {product.coverImage && (
                        <div className="my-3">
                            <h5>Cover Image:</h5>
                            <img
                                src={product.coverImage} // Assuming it's a URL
                                alt={product.name}
                                style={{ maxWidth: "500px", height: "auto" }}
                            />
                        </div>
                    )}

                    {product.images?.length > 0 && (
                        <div className="my-3">
                            <h5>Additional Images:</h5>
                            <div className="d-flex flex-wrap">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image} // Assuming each image is a URL
                                        alt={`${product.name} - ${index + 1}`}
                                        style={{
                                            maxWidth: "150px",
                                            height: "auto",
                                            margin: "5px",
                                            border: "1px solid #ddd",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            Back
                        </Button>
                        <Button variant="primary" onClick={handleEdit}>
                            Edit Product
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ViewProduct;
