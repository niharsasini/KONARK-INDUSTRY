"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { PRODUCTS } from "./products.data";
import { carouselResponsive } from "./carousel.config";
import ProductCard from "./ProductCard";

const ProductCarousel = () => {
  return (
    <div className="px-12 py-6">
      <Carousel
        responsive={carouselResponsive}
        infinite
        arrows
        draggable
        swipeable
        keyBoardControl
        itemClass="px-3"
        containerClass="pb-4"
      >
        {PRODUCTS.map((item) => (
          <ProductCard key={item.title} item={item} />
        ))}
      </Carousel>
    </div>
  );
};

export default ProductCarousel;
