import React, { useState, useEffect } from "react";
import { Form, Button, Card, Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { editProduct } from "../app/features/admin/productSlice"; // Assuming updateProduct exists
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
    const { id } = useParams(); // Get product ID from URL
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const product = useSelector((state) =>
        state.vendorProducts.data.product.find((item) => item._id.toString() === id.toString())
    ); // Assuming the product is stored in state.products.items

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

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(product)
        if (product) {
            setFormData({
                name: product.name,
                description: product.description || "",
                price: product.price,
                category: product.category || "Electronics",
                brand: product.brand || "",
                stock: product.stock || 0,
                coverImage: null, // Set to null for new uploads
                images: [], // Set to empty for new uploads
            });
        }
    }, [product]);

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
        setLoading(true);



        const data = new FormData();
        if (formData.name !== product.name)
            data.append("name", formData.name);
        if (formData.description !== product.description)
            data.append("description", formData.description);
        if (formData.price !== product.price)
            data.append("price", formData.price);
        if (formData.category !== product.category)
            data.append("category", formData.category);
        if (formData.brand !== product.brand)
            data.append("brand", formData.brand);
        if (formData.stock !== product.stock)
            data.append("stock", formData.stock);

        if (formData.coverImage) {
            data.append("coverImage", formData.coverImage); // Only add if a new file is uploaded
        }
        if (formData.images.length > 0)
            formData.images.forEach((image, index) =>
                data.append(`images[${index}]`, image)
            );

        try {
            const res = await dispatch(editProduct({ id, data }));

            if (res.payload?.success) {
                toast.success("Product updated successfully!");
                navigate("/vendor/products");
            } else {
                toast.error(res.payload.message || "Failed to update product");
            }
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-4">
            <Card className="p-4 shadow-sm">
                <h2>Edit Product</h2>
                {product ? (
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
                            <Form.Label>Cover Image (Upload a new image to replace)</Form.Label>
                            <Form.Control
                                type="file"
                                name="coverImage"
                                accept="image/*"
                                onChange={handleFileChange}
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

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : "Update Product"}
                        </Button>
                    </Form>
                ) : (
                    <Spinner animation="border" />
                )}
            </Card>
        </Container>
    );
};

export default EditProduct;
