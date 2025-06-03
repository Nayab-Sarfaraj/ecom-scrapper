import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVendorProduct } from '../app/features/admin/fetchVendorProducts'
import { fetchVendorOrders } from '../app/features/admin/fetchOrders'
import { Card, Row, Col, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications } from '../app/features/admin/notificationSlice';

const Dashboard = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.data)
  const orders = useSelector(state => state.vendorOrders.data?.orders)
  const products = useSelector(state => state.vendorProducts.data?.product)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchVendorProduct())
    dispatch(fetchVendorOrders())
    dispatch(fetchNotifications())
  }, [])
  return (
    <div className="p-4 bg-light ">
      {/* Dashboard Heading */}
      <div className="text-center mb-4">
        <h2 className='mb-4'>Dashboard</h2>
        <Button variant="primary" onClick={() => navigate("/vendor/notifications")}>View Notifications</Button>
      </div>

      {/* Vendor Options */}
      <Row className="g-4 mb-4">
        {/* Add Product */}
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>Add Product</Card.Title>
              <Card.Text>
                Add new products to your store for customers to view and purchase.
              </Card.Text>
              <Button variant="primary" onClick={() => navigate("/vendor/product/create")}>Add Product</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Manage Products */}
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>Manage Products</Card.Title>
              <Card.Text>
                View, edit, or remove existing products from your inventory.
              </Card.Text>
              <Button variant="secondary" onClick={() => navigate("/vendor/products")}>Manage Products</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* View Orders */}
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>View Orders</Card.Title>
              <Card.Text>
                Track and manage orders placed by customers.
              </Card.Text>
              <Button variant="success" onClick={() => navigate("/vendor/orders")}>View Orders</Button>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* Recent Orders Table */}
      {
        orders?.length > 0 && (
          <div className="mb-4">
            <h4>Recent Orders</h4>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  orders?.map((item, id) => (
                    <tr>
                      <td>{id + 1}</td>
                      <td>{item._id.slice(-5)}</td>
                      <td className='text-capitalize'>{item.buyer.name}</td>
                      <td>{item.orderStatus}</td>
                      <td>
                        <Button variant="info" size="sm" className="me-2">View</Button>
                        <Button variant="warning" size="sm">Update</Button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </div>

        )
      }
      {/* Additional Actions */}

    </div>
  )
}

export default Dashboard