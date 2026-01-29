"use client";
import React, { useState, useEffect } from "react";
import { products as initialProducts } from "./ProductData";
import ProductList from "./ProductList";
import ProductFilter from "./ProductFilter";
import { heroTitle, heroSubtitle } from "./Product.styles";

const HeroBanner = () => (
  <section className="relative bg-gray-900 text-white py-24 px-6 md:px-12 flex flex-col justify-center items-start">
    <h1 className={heroTitle}>Powering Innovation, Driving Industry</h1>
    <p className={heroSubtitle}>
      Discover cutting-edge energy solutions and machinery designed for
      industrial efficiency and sustainable growth.
    </p>
    <a
      href="#products"
      className="bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded hover:bg-yellow-400 transition"
    >
      Explore Products
    </a>
  </section>
);

const IndustryHighlights = () => (
  <section className="py-20 px-6 md:px-12 bg-gray-100">
    <h2 className="text-3xl font-bold text-center mb-12">
      Why Choose Konark Energy Solutions?
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {[
        {
          icon: "/icons/efficiency.svg",
          title: "High Efficiency",
          desc: "Our machinery is optimized for maximum energy output with minimal waste.",
        },
        {
          icon: "/icons/safety.svg",
          title: "Safety First",
          desc: "Industry-standard safety protocols ensure reliable and safe operations.",
        },
        {
          icon: "/icons/sustainability.svg",
          title: "Sustainable Solutions",
          desc: "Eco-friendly energy systems designed to reduce carbon footprint.",
        },
      ].map((item, idx) => (
        <div key={idx} className="text-center">
          <img src={item.icon} alt={item.title} className="mx-auto mb-4 h-16" />
          <h3 className="font-bold text-xl mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const categories = [...new Set(initialProducts.map((p) => p.category))];

  useEffect(() => {
    setProducts(initialProducts);
    setFilteredProducts(initialProducts);
  }, []);

  const handleFilter = (category) => {
    if (!category || category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  return (
    <div>
      <HeroBanner />
      <section id="products" className="px-6 md:px-12 py-12">
        <h2 className="text-3xl font-bold text-center mb-6">
          Our Industrial Products
        </h2>
        <ProductFilter onFilter={handleFilter} />
        <ProductList products={filteredProducts} />
      </section>
      <IndustryHighlights />
    </div>
  );
};

export default ProductPage;
