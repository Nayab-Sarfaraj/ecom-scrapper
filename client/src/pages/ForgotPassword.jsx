import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { url } from "../utils/url";

const ForgotPassword = ({ onSubmit }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${url}/forgot-password`, { email }, { withCredentials: true }) // 
            //  `onSubmit` handles the API request
            console.log(res.data)
            if (res.data.success) {


                toast.success("Password reset link sent to your email.");
                setEmail(""); // Clear the email field after success
            } else {
                toast.error(res.data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error sending reset link:", error);
            toast.error(error.response.data.message || "Failed to send reset link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-4">
            <Card className="p-4 shadow-sm">
                <h2>Forgot Password</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default ForgotPassword;
