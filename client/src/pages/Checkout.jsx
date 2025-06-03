import React, { useEffect, useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { saveAddress } from "../app/features/cart/addressSlice";
import { useNavigate } from "react-router-dom";

const Checkout = ({ onSubmit }) => {
    const user = useSelector(state => state.user.data)
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    });
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!address.street || !address.city || !address.state || !address.postalCode || !address.country) {
            toast.error("Please fill out all fields.");
            return;
        }
        // Pass the address to the parent or handle it here
        dispatch(saveAddress(address))
        toast.success("Address saved successfully!");
        navigate("/order-summary")
    };
    useEffect(() => {
        
        if (user) {
            setAddress({ ...address, state: user.state, country: user.country, city: user.district })
        }
    }, [user])

    return (
        <Container className="my-4">
            <Card className="p-4 shadow-sm">
                <h2>Shipping Address</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Street</Form.Label>
                        <Form.Control
                            type="text"
                            name="street"
                            value={address.street}
                            onChange={handleChange}
                            placeholder="Enter street address"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            type="text"
                            name="city"
                            value={address.city}
                            onChange={handleChange}
                            placeholder="Enter city"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                            type="text"
                            name="state"
                            value={address.state}
                            onChange={handleChange}
                            placeholder="Enter state"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                            type="text"
                            name="postalCode"
                            value={address.postalCode}
                            onChange={handleChange}
                            placeholder="Enter postal code"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            type="text"
                            name="country"
                            value={address.country}
                            onChange={handleChange}
                            placeholder="Enter country"
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Save Address
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default Checkout;
