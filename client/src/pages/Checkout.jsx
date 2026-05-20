import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { saveAddress } from "../app/features/cart/addressSlice";
import "./forms.css";

const Checkout = () => {
  const user = useSelector((state) => state.user.data);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !address.street ||
      !address.city ||
      !address.state ||
      !address.postalCode ||
      !address.country
    ) {
      toast.error("Please fill out all fields.");
      return;
    }
    dispatch(saveAddress(address));
    toast.success("Address saved successfully!");
    navigate("/order-summary");
  };

  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        state: user.state,
        country: user.country,
        city: user.district,
      }));
    }
  }, [user]);

  return (
    <section className="product-form-page">
      <Container style={{ maxWidth: 600 }}>
        <div className="content-card">
          <div className="card-header-bar">
            <ion-icon name="location-outline"></ion-icon>
            <h2>Shipping Address</h2>
          </div>

          <div className="card-body-inner">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="ss-form-label" htmlFor="street">
                  Street address <span className="required-star">*</span>
                </label>
                <input
                  id="street"
                  className="ss-input form-control"
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  placeholder="123 Main Street, Apt 4B"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="mb-3">
                  <label className="ss-form-label" htmlFor="city">
                    City <span className="required-star">*</span>
                  </label>
                  <input
                    id="city"
                    className="ss-input form-control"
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="ss-form-label" htmlFor="co-state">
                    State <span className="required-star">*</span>
                  </label>
                  <input
                    id="co-state"
                    className="ss-input form-control"
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="mb-3">
                  <label className="ss-form-label" htmlFor="postalCode">
                    Postal code <span className="required-star">*</span>
                  </label>
                  <input
                    id="postalCode"
                    className="ss-input form-control"
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleChange}
                    placeholder="400001"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="ss-form-label" htmlFor="country">
                    Country <span className="required-star">*</span>
                  </label>
                  <input
                    id="country"
                    className="ss-input form-control"
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    placeholder="India"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="ss-btn-primary mt-2">
                Continue to Order Summary
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Checkout;
