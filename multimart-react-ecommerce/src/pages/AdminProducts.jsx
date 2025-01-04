import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVendorProduct } from '../app/features/admin/fetchVendorProducts'
import { Button, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { deleteProduct } from '../app/features/admin/productSlice'
import { toast } from 'react-toastify'

const AdminProducts = () => {
    const products = useSelector(state => state.vendorProducts?.data.product)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleProductDelete = async (id) => {
        const res = await dispatch(deleteProduct(id))
        toast(res.payload?.message || "Something went wrong")
    }
    useEffect(() => {
        dispatch(fetchVendorProduct())
    }, [])
    return (
        <div className="p-4">
            <h2 className="mb-4">Your Products</h2>
            {products?.length !== 0 ? (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id.slice(-5)}</td>
                                <td className="text-capitalize">{product.name}</td>
                                <td className="text-capitalize">{product.category}</td>
                                <td>₹{product.price}</td>
                                <td>{product.stock}</td>
                                <td>{product.rating > 0 ? product.rating : "No"}</td>
                                <td>
                                    <Button variant="info" size="sm" className="me-2"
                                        onClick={() => navigate(`/vendor/product/view/${product._id}`)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right " viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
                                            <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
                                        </svg>
                                    </Button>
                                    <Button variant="success" size="sm" className="me-2 text-center " onClick={() => navigate(`/vendor/product/edit/${product._id}`)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                        </svg>
                                    </Button>
                                    <Button variant='danger' onClick={() => handleProductDelete(product._id)} size='sm'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                        </svg>
                                    </Button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <div className="text-center p-5">
                    <h3>No Products Found</h3>
                    <p className="text-muted">You currently have no products listed. Please add a product to start selling.</p>
                    <Button variant="primary" href="/vendor/product/create">
                        Add Product
                    </Button>
                </div>
            )}
        </div>
    );

}

export default AdminProducts