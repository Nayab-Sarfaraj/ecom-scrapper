import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import { editOrderStatus, editPaymentStatus, getOrderById } from '../app/features/admin/orderSlice';
import { toast } from "react-toastify"
const AdminOrderDetails = () => {
    const { id } = useParams()
    // const order = useSelector(state => state.vendorOrders.data.orders?.find(item => item._id.toString() === id.toString()))
    const order = useSelector(state => state.selectedOrder.data?.order)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getOrderById(id))
    }, [id])

    const [orderStatus, setOrderStatus] = useState(order?.orderStatus);
    const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus);

    const handleOrderStatusChange = (e) => {
        setOrderStatus(e.target.value);
    };

    const handlePaymentStatusChange = (e) => {
        console.log(e.target.value)
        setPaymentStatus(e.target.value);
    };

    const handleOrderStatus = async (e) => {
        e.preventDefault()
        const res = await dispatch(editOrderStatus({ id, orderStatus }))
        if (!res.payload?.success) {
            toast.error(res.payload?.message || "Something went wrong")
        } else {
            toast.success("Updated Successfully")
        }

    }
    const handlePaymentStatus = async (e) => {
        e.preventDefault()
        dispatch(editPaymentStatus({ id, paymentStatus }))


    }
    if (!order) return <></>
    return (
        <Container className="mt-4 mb-4">
            <Row className="gy-4 justify-content-center">
                {
                    order ? (<Col lg={8} md={12}>
                        <Card className="p-4 shadow-sm">
                            <h2 className="mb-4">Order Details</h2>
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Customer Name:</strong> {order.buyer.name}</p>
                            <p><strong>Customer Email:</strong> {order.buyer.email}</p>
                            <p><strong>Product Name:</strong> {order.product.name}</p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                            <p><strong>Price per Unit:</strong> ${order.product.price}</p>
                            <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                            <p><strong>Shipping Address:</strong></p>
                            <p>
                                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            <p><strong>Order Status:</strong> {order.orderStatus}</p>
                            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                            <p><strong>Order Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Last Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
                        </Card>
                    </Col>) : <Loader />
                }
                <Col lg={4} md={12} className=''>
                    <Card className="p-4 shadow-sm mb-4">
                        <Form onSubmit={handleOrderStatus}>
                            <Form.Group controlId="orderStatus" className="mb-3">
                                <Form.Label>Order Status</Form.Label>
                                <Form.Select value={orderStatus} onChange={handleOrderStatusChange}>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </Form.Select>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Update Status
                            </Button>
                        </Form>
                    </Card>
                    <Card className="p-4 shadow-sm">

                        <Form onSubmit={handlePaymentStatus}>
                            <Form.Group controlId="paymentStatus" className="mb-3">
                                <Form.Label>Payment Status</Form.Label>
                                <Form.Select value={paymentStatus} onChange={handlePaymentStatusChange}>
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Failed">Failed</option>
                                    <option value="Refunded">Refunded</option>

                                </Form.Select>
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Update Status
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminOrderDetails;
