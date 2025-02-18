import React, { useState } from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import PaginationComponent from "../PaginationComponent";

const PriceFilter = ({ minPrice, maxPrice, setMaxPrice, setMinPrice, currentPage, onPageChange }) => {




    return (
        <div className="my-4">
            <h5>Filter by Price</h5>
            <Form>
                <Row className="align-items-center">
                    <Col xs={6} md={4}>
                        <InputGroup>
                            <InputGroup.Text>Min ₹</InputGroup.Text>
                            <Form.Control
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={6} md={4}>
                        <InputGroup>
                            <InputGroup.Text>Max ₹</InputGroup.Text>
                            <Form.Control
                                type="number"
                                placeholder="10000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col xs={12} md={4} className="mt-2 mt-md-0">
                        <PaginationComponent currentPage={currentPage} onPageChange={onPageChange} totalPages={5} />

                    </Col>

                </Row>
            </Form>
        </div>
    );
};

export default PriceFilter;
