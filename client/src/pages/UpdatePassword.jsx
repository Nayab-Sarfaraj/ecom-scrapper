import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../app/features/userSlice";

const UpdatePassword = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.oldPassword || !formData.newPassword) {
            toast.error("Please fill in both fields.");
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            return;
        }


        setLoading(true);
        try {
            const res = await dispatch(updatePassword(formData))
            if (!res.payload?.success) toast.error(res.payload?.message || "Something went wrong")
            else {
                toast.success("Password updated successfully.");
                setFormData({ oldPassword: "", newPassword: "" });
                navigate("/")
            }

        } catch (error) {
            toast.error("Failed to update password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-4">
            <Card className="p-4 shadow-sm">
                <h2>Update Password</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleInputChange}
                            placeholder="Enter your old password"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="Enter a new password"
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

export default UpdatePassword;
