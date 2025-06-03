import React from "react";
import { Dropdown, Pagination } from "react-bootstrap";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    const handleSelect = (selectedPage) => {
        onPageChange(Number(selectedPage));
    };

    return (
        <Dropdown className="my-3">
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Page {currentPage} of {totalPages}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Dropdown.Item
                        key={index + 1}
                        eventKey={index + 1}
                        active={currentPage === index + 1}
                        onClick={() => handleSelect(index + 1)}
                    >
                        Page {index + 1}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );

};

export default PaginationComponent;
