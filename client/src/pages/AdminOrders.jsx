import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVendorOrders } from '../app/features/admin/fetchOrders'
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
    const orders = useSelector(state => state.vendorOrders.data?.orders)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(fetchVendorOrders())
    }, [])

    return (
        <div className="p-4">
            <h2 className="mb-4">All Orders</h2>
            {
                orders?.length !== 0 ? (<Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id.slice(-5)}</td>
                                <td className='text-capitalize'>{order.buyer.name}</td>
                                <td className='text-capitalize'>{order.product.name}</td>
                                <td>{order.quantity}</td>
                                <td>{order.totalPrice}</td>
                                <td>{order.orderStatus}</td>
                                <td>
                                    <Button variant="info" size="sm" className="me-2" onClick={() => navigate(`/vendor/order/details/${order._id}`)}>
                                        View
                                    </Button>


                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>) : (<div className="text-center p-5">
                    <h3>No Orders Found</h3>
                    <p className="text-muted">You currently have no orders. Please check back later or browse our products to place an order.</p>
                    <Button variant="primary" href="/shop">
                        Go to Shop
                    </Button>
                </div>)
            }
        </div>
    );
}

export default AdminOrders