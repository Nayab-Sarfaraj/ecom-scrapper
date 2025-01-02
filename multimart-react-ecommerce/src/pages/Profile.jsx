// Import necessary modules from React Bootstrap
import React from 'react';
import { Card, Row, Col, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../app/features/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
    const userName = "Shahnewaz Sakil"; // Example user name
    const userImage = "https://via.placeholder.com/150"; // Placeholder image URL
    const user = useSelector(state => state.user.data)
    // const navigate=useNavigate
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const handleLogout = async () => {
        const res = await dispatch(logoutUser())
        if (res.payload.success) {
            navigate("/")
            toast.success("Logged out successfully")
        }
    }
    return (
        <div className="p-4 bg-light">
            {/* User Information */}
            <div className="text-center mb-4">
                <Image
                    src={"https://avatar.iran.liara.run/public/"}
                    roundedCircle
                    width={150}
                    height={150}
                    alt="User Profile"
                    className="mb-3"
                />
                <h3 className='text-capitalize'>{user.name}</h3>
                <Button onClick={() => { navigate("/vendor/dashboard") }}>Go to Dashboard</Button>
            </div>

            {/* User Options */}
            <Row className="g-4">
                {/* Orders Card */}
                <Col md={4}>
                    <Card className="h-100">
                        <Card.Body className="text-center">
                            <Card.Title>My Orders</Card.Title>
                            <Card.Text>
                                View and manage your past and current orders.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate('/order')}>View Orders</Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Wishlist Card */}
                <Col md={4}>
                    <Card className="h-100">
                        <Card.Body className="text-center">
                            <Card.Title>Wishlist</Card.Title>
                            <Card.Text>
                                Browse and manage items you’ve saved to your wishlist.
                            </Card.Text>
                            <Button variant="secondary">View Wishlist</Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* User Details Card */}
                <Col md={4}>
                    <Card className="h-100">
                        <Card.Body className="text-center">
                            <Card.Title>Profile Details</Card.Title>
                            <Card.Text>
                                Update your profile information and settings.
                            </Card.Text>
                            <Button variant="outline-primary">Edit Profile</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div className="text-center mt-4">
                <Button variant="danger" className="me-3" onClick={handleLogout}>Logout</Button>
                <Button variant="warning" onClick={() => navigate("/password/update")}>Update Password</Button>
            </div>
        </div>
    );
};

export default Profile;
