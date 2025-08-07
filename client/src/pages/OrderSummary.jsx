import axios from "axios";
import React from "react";
import { Card, Container, Row, Col, Table, Image, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteProduct } from "../app/features/cart/cartSlice";
import { url } from "../utils/url";

const OrderSummary = () => {
    const cartList = useSelector((state) => state.cart.cartList);
    const address = useSelector((state) => state.address.address);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Calculate total price
    const calculateTotal = () => {
        return cartList.reduce((acc, product) => acc + product.price * product.qty, 0);
    };

    // Handle payment button click
    const handlePayment = async () => {
        if (!window.Razorpay) {
            console.error("Razorpay SDK not loaded");
            return;
        }
        console.log("Proceeding to payment...");
        const { data } = await axios.post(`${url}/payment/order`, { amount: calculateTotal() }, { withCredentials: true });
        // console.log(res.data)
        console.log(data)
        // Add payment logic here
        const options = {
            key: "rzp_test_KamgQe04JzGUrM",
            amount: data.data.amount,
            currency: data.data.currency,
            name: "Test",
            description: "Test Mode",
            order_id: data.data.id,
            handler: async (response) => {
                console.log("response", response)
                try {
                    const res = await fetch(`${url}/payment/verify`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                    })
                    const items = []
                    cartList.forEach(ele => {
                        items.push({
                            product: ele._id,
                            quantity: ele.qty,
                            price: ele.price
                        })
                    });
                    const shippingAddress = {
                        ...address
                    }
                    const verifyData = await res.json();



                    if (verifyData.message) {
                        toast.success(verifyData.message)
                    }
                    const result = await axios.post(`${url}/order/new`, { items, shippingAddress }, { withCredentials: true })
                    cartList?.forEach((item) => {
                        dispatch(deleteProduct(item))
                    })
                    navigate("/")

                } catch (error) {
                    console.log(error);
                    toast.error(error?.response?.data?.message || "Something went wrong")
                }
            },
            theme: {
                color: "#5f63b8"
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
        if (window.Razorpay) {
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } else console.log("not load");
    };

    return (
        <Container className="my-4">
            <h1>Order Summary</h1>
            <Row>
                {/* Shipping Address */}
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Shipping Address</Card.Title>
                            <p>
                                <strong>Street:</strong> {address.street}
                            </p>
                            <p>
                                <strong>City:</strong> {address.city}
                            </p>
                            <p>
                                <strong>State:</strong> {address.state}
                            </p>
                            <p>
                                <strong>Postal Code:</strong> {address.postalCode}
                            </p>
                            <p>
                                <strong>Country:</strong> {address.country}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Order Details */}
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Order Details</Card.Title>
                            <p>
                                <strong>Order ID:</strong> {cartList.length > 0 ? cartList[0]._id : "N/A"}
                            </p>
                            <p>
                                <strong>Total Items:</strong> {cartList.length}
                            </p>
                            <p>
                                <strong>Total Price:</strong> ₹{calculateTotal()}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Product List */}
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Products</Card.Title>
                    <Table responsive bordered>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartList.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <Image
                                            src={product.coverImage}
                                            alt={product.name}
                                            rounded
                                            style={{ width: "50px", height: "50px" }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>₹{product.price}</td>
                                    <td>{product.qty}</td>
                                    <td>₹{product.price * product.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Payment Button */}
            <div className="d-flex justify-content-end mt-4">
                <Button variant="primary" size="lg" onClick={handlePayment}>
                    Proceed to Payment
                </Button>
            </div>
        </Container>
    );
};

export default OrderSummary;
