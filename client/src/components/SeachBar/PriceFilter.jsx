import React from "react";
import PaginationComponent from "../PaginationComponent";
import "./pricefilter.css";

const PriceFilter = ({
  minPrice,
  maxPrice,
  setMaxPrice,
  setMinPrice,
  currentPage,
  onPageChange,
}) => {
  return (
    <div className="price-filter-bar">
      <div className="price-filter-inputs">
        <div className="price-input-group">
          <span className="price-prefix">Min ₹</span>
          <input
            className="price-input"
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />
        </div>
        <div className="price-input-group">
          <span className="price-prefix">Max ₹</span>
          <input
            className="price-input"
            type="number"
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
          />
        </div>
      </div>

      <PaginationComponent
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={5}
      />
    </div>
  );
};

export default PriceFilter;
