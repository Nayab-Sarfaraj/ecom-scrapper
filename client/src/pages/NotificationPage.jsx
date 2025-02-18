import React, { useEffect } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSelectedNotification } from "../app/features/admin/SelectedNotificationSlice";
import { STATUSES } from "../app/features/userSlice";
import Loader from "../components/Loader/Loader";

const NotificationPage = () => {
    const { id } = useParams()
    const dispatch = useDispatch()

    const notification = useSelector(state => state.selectedNotification.data?.notification)
    const status = useSelector(state => state.selectedNotification.status)

    useEffect(() => {

        dispatch(fetchSelectedNotification(id))
    }, [id])
    return (
        <div
            className="d-flex align-items-center justify-content-center bg-light"
            style={{ minHeight: "100vh", padding: "20px" }}
        >
            <Container>
                {
                    notification ? <Card className="shadow-lg border-0">
                        <Card.Body>
                            <Card.Title className="text-center mb-4 fs-3 text-primary">
                                User Inquiry: Product Request in Your Area
                            </Card.Title>
                            <Card.Text className="mb-4">
                                <strong>Hello {notification.content.user.name},</strong>
                            </Card.Text>
                            <Card.Text className="mb-4">
                                A user is interested in a product that matches your inventory and is located in your area!
                            </Card.Text>
                            <hr />

                            <h5 className="mb-3 text-secondary">Product Details:</h5>
                            <Row>
                                <Col md={6}>
                                    <p>
                                        <strong>Product Name:</strong> {notification.content.product.name}
                                    </p>
                                    <p>
                                        <strong>Category:</strong> {notification.content.product.category}
                                    </p>
                                    <p>
                                        <strong>Price Range:</strong> ₹{notification.content.product.price}
                                    </p>
                                </Col>
                            </Row>
                            <hr />

                            <h5 className="mb-3 text-secondary">User Details:</h5>
                            <Row>
                                <Col md={6}>
                                    <p>
                                        <strong>Name:</strong> {notification.content.user.name}
                                    </p>
                                    <p>
                                        <strong>Location:</strong> {notification.content.user.state}, {notification.content.user.district}
                                    </p>
                                    <p>
                                        <strong>Preferred Contact:</strong> {notification.content.user.email}
                                    </p>
                                </Col>
                            </Row>

                            <hr />
                            <p>
                                Please respond promptly to fulfill the user's request and potentially make a sale!
                            </p>

                            <div className="text-center mt-4">
                                <Button variant="primary" size="lg">
                                    Contact User
                                </Button>
                            </div>
                        </Card.Body>
                        <Card.Footer className="text-center text-muted">
                            <small>
                                Best regards, <strong>Shop Sync</strong>
                            </small>
                        </Card.Footer>
                    </Card> : status === STATUSES.LOADING ? <Loader /> : <></>
                }
            </Container>
        </div>
    );
};

export default NotificationPage;
