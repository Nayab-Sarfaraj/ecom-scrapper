import React from "react";
import "./pagination.css";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="ss-pagination">
      <button
        className="ss-page-btn nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`ss-page-btn${currentPage === page ? " active" : ""}`}
          onClick={() => onPageChange(page)}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        className="ss-page-btn nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
};

export default PaginationComponent;
