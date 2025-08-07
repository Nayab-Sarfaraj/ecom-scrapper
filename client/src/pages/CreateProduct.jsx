import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createProduct } from "../app/features/admin/productSlice";
import { useNavigate } from "react-router-dom";

const CreateProduct = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Electronics",
        brand: "",
        stock: 0,
        coverImage: null, // Single file
        images: [], // Multiple files

    });
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "coverImage") {
            setFormData({ ...formData, coverImage: files[0] });
        } else if (name === "images") {
            setFormData({ ...formData, images: Array.from(files) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Check required fields
        if (!formData.name || !formData.price || !formData.coverImage) {
            toast.error("Please fill all required fields.")

            return;
        }

        // Prepare form data for submission
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("brand", formData.brand);
        data.append("stock", formData.stock);
        data.append("coverImage", formData.coverImage); // Single file
        console.log(formData.images)
        // formData.images.forEach((image, index) => data.append(`images[${index}]`, image)); 
        data.append("images", formData.images)

        data.forEach((item) => console.log(item))
        const res = await dispatch(createProduct(data))
        console.log(res)
        // Submit the form data
        if (res.payload?.success) {
            toast("Product added")
            navigate("/vendor/dashboard")

        } else {
            toast.error(res.payload.message || "Something went wrong, please try again later.")
        }
    };

    return (
        <Container className="my-4">
            <Card className="p-4 shadow-sm">
                <h2>Create New Product</h2>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Enter product description"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Price *</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter product price"
                            min="0"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                        >
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Home">Home</option>
                            <option value="Books">Books</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            placeholder="Enter brand name"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            placeholder="Enter stock quantity"
                            min="0"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Cover Image *</Form.Label>
                        <Form.Control
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Additional Images</Form.Label>
                        <Form.Control
                            type="file"
                            name="images"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Create Product
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default CreateProduct;
