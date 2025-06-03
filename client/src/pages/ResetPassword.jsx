import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token")

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { newPassword, confirmPassword } = formData;

        // Validation
        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (!token || token === '') return toast.error("Invalid token")


        setLoading(true);
        try {
            const res = await axios.put(`/resetPassword/${token}`, { password: newPassword })
            console.log(res.data)
            toast.success("Password updated successfully.");
            setFormData({ newPassword: "", confirmPassword: "" }); // Clear form fields

            navigate("/login")
        } catch (error) {
            toast.error("Failed to update password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-4">
            <Card className="p-4 shadow-sm">
                <h2>Set New Password</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your new password"
                            minLength="8"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your new password"
                            minLength="8"
                            required
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default ResetPassword;
