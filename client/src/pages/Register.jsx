// Import necessary modules from React Bootstrap
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../app/features/userSlice";

const Register = () => {
  const [showPass, setShowPass] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    state: "",
    district: "",
    isVendor: false,
    businessName: "",
    contactNumber: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLogin = useSelector((state) => state.user.isLogin);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    // Form submission logic here
    const res = await dispatch(registerUser(formData));

    if (res.payload.success) {
      toast.success("Registration successful");
      navigate("/login");
    } else {
      toast.error(res.payload.message || "Something went wrong");
    }
    setIsLoading(false);


  };
  useEffect(() => {
    if (isLogin) navigate("/");
  }, []);

  return (
    <div className="p-4 border rounded bg-light">
      {/* Heading */}
      <h2 className="text-center mb-3">Register</h2>
      <p className="text-center mb-4">
        Please fill out the details for a seamless experience
      </p>

      <Form onSubmit={handleSubmit}>
        {/* Name Input */}
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Your Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Shahnewaz Sakil"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

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
              style={{ cursor: "pointer" }}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>
        </Form.Group>

        {/* Country Input */}
        <Form.Group controlId="country" className="mb-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your Country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* State Input */}
        <Form.Group controlId="state" className="mb-3">
          <Form.Label>State</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your State"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* District Input */}
        <Form.Group controlId="district" className="mb-3">
          <Form.Label>District</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your District"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        {/* Vendor Checkbox */}
        <Form.Group controlId="isVendor" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Are you a vendor?"
            name="isVendor"
            checked={formData.isVendor}
            onChange={handleInputChange}
          />
        </Form.Group>

        {/* Business Name Input (Conditional) */}
        {formData.isVendor && (
          <Form.Group controlId="businessName" className="mb-3">
            <Form.Label>Business Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your Business Name (if applicable)"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
            />
          </Form.Group>
        )}

        {/* Contact Number Input (Conditional) */}
        {formData.isVendor && (
          <Form.Group controlId="contactNumber" className="mb-3">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Your Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
            />
          </Form.Group>
        )}
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-100"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </Button>
      </Form>
    </div>
  );
};

export default Register;
