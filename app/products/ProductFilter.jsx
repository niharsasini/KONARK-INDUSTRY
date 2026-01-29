"use client";
import React from "react";
import { categoryButton } from "./Product.styles";

const categories = ["All", "Electronics", "Clothing", "Books"];

const ProductFilter = ({ onFilter }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onFilter(cat)}
          className={categoryButton}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default ProductFilter;
