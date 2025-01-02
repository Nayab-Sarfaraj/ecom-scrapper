import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyOrders, STATUSES } from '../app/features/orderSlice'
import { Container, Card, Table, Image, Spinner, Alert } from "react-bootstrap";

const MyOrder = () => {
    const dispatch = useDispatch()
    const status = useSelector(state => state.myOrders.status)
    const orders = useSelector(state => state.myOrders.data?.orders)
    useEffect(() => {
        dispatch(fetchMyOrders())
    }, [])
    if (status === STATUSES.LOADING) {
        return <div>Loading ....</div>
    }


    return (
        <Container className="my-4">
            <h1>My Orders</h1>
            {status === STATUSES.LOADING && (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            )}
            {/* {error && <Alert variant="danger">{error}</Alert>} */}
            {status !== STATUSES.LOADING && status !== STATUSES.ERROR && orders?.length === 0 && (
                <Alert variant="info">You have no orders yet.</Alert>
            )}
            {status !== STATUSES.LOADING && status !== STATUSES.ERROR && orders?.length > 0 && (
                <Card className="mb-2">
                    <Card.Body>
                        <Card.Title>Order History</Card.Title>
                        <Table responsive bordered>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id.slice(-5)}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <Image
                                                    src={order.product.coverImage}
                                                    alt={order.product.name}
                                                    rounded
                                                    style={{ width: "50px", height: "50px", marginRight: "10px" }}
                                                />
                                                <span>{order.product.name}</span>
                                            </div>
                                        </td>
                                        <td>{order.quantity}</td>
                                        <td>₹{order.totalPrice}</td>
                                        <td>
                                            <span
                                                className={`badge ${order.orderStatus === "Delivered"
                                                    ? "bg-success"
                                                    : order.orderStatus === "Processing"
                                                        ? "bg-warning"
                                                        : "bg-secondary"
                                                    }`}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </Container>
    )
}

export default MyOrder