// Import necessary modules from React Bootstrap
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../app/features/userSlice';

const Login = () => {

    const [showPass, setShowPass] = useState(false);
    const [isVendor, setIsVendor] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({

        email: '',
        password: '',

    });
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isLogin = useSelector(state => state.user.isLogin)

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
        // Form submission logic here
        const res = await dispatch(loginUser(formData))
        console.log(res);
        if (res.payload.success) {

            toast.success("Welcome back")
            navigate("/")
        } else toast.error(res.payload.message || "Something went wrong")
        setIsLoading(false);
        setFormData({
            email: '',
            password: '',
        });

    };
    useEffect(() => {
        if (isLogin) navigate("/")
    }, [isLogin])

    return (
        <div className="p-4 border rounded bg-light">
            {/* Heading */}
            <h2 className="text-center mb-3">Login</h2>
            {/* <p className="text-center mb-4">Please fill out the details for a seamless experience</p> */}

            <Form onSubmit={handleSubmit}>
                {/* Name Input */}


                {/* Email Input */}
                <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Your Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="shofy@mail.com"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </Form.Group>

                {/* Password Input */}
                <Form.Group controlId="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div className="position-relative">
                        <Form.Control
                            type={showPass ? "text" : "password"}
                            placeholder="Min. 8 characters"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            minLength="8"
                            required
                        />
                        <span
                            className="position-absolute top-50 end-0 translate-middle-y me-3"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowPass(!showPass)}
                        >
                            {showPass ? '🙈' : '👁️'}
                        </span>
                    </div>
                </Form.Group>
                <p className="text-center mt-3">
                    <Link to="/forgot-password">Forgot Password</Link>
                </p>

                <p className="text-center mt-3">
                    New user? <Link to="/register">Register Now</Link>
                </p>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Login'}
                </Button>
            </Form>
        </div>
    );
};

export default Login;
