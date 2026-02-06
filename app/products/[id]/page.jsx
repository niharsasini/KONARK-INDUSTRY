"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { products } from "../ProductData";
import { Star } from "lucide-react";
import EnquiryModal from "../../components/enquiry/EnquiryModal";


export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [openEnquiry, setOpenEnquiry] = useState(false);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <p className="text-xl font-semibold">Product not found</p>
      </div>
    );
  }

  const formattedPrice =
    typeof product.price === "number" && product.price > 0
      ? `₹${product.price.toLocaleString()}`
      : "Price on Request";

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* DARK HEADER */}
      <div className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold">{product.name}</h1>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            {product.shortDescription ||
              "High-quality industrial solution engineered for performance and reliability."}
          </p>
        </div>
      </div>

      {/* BACK BUTTON */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <button
          onClick={() => router.push("/products")}
          className="text-sm text-gray-700 hover:text-yellow-500 font-medium"
        >
          ← Back to Products
        </button>
      </div>

      {/* MAIN SECTION */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
        {/* IMAGE */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900/40 rounded-xl p-6 shadow-lg flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[420px] object-contain"
          />
        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          {/* CATEGORY + RATING */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-yellow-500 font-bold uppercase">
              {product.category}
            </span>

            {product.rating && (
              <div className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1 rounded-full text-sm">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                {product.rating}
              </div>
            )}
          </div>

          {/* TITLE */}
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            {product.name}
          </h2>

          {/* PRICE */}
          <p className="text-2xl font-bold text-yellow-600 mb-4">
            {formattedPrice}
          </p>

          {/* DESCRIPTION */}
          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* KEY HIGHLIGHTS */}
          {product.specifications && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Key Highlights
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                {Object.entries(product.specifications)
                  .slice(0, 6)
                  .map(([key, value]) => (
                    <li key={key} className="flex gap-2">
                      <span className="font-medium capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>
                      <span>{value}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => setOpenEnquiry(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow"
            >
              Enquire Now
            </button>

            <button className="border-2 border-gray-800 hover:bg-gray-800 hover:text-white text-gray-800 px-6 py-3 rounded-lg font-semibold transition">
              Download Brochure
            </button>
          </div>
        </div>
      </div>

      {/* FULL SPECIFICATIONS */}
      {product.specifications && (
        <div className="max-w-6xl mx-auto px-6 mt-14 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
            Technical Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between border-b pb-2 text-gray-700"
              >
                <span className="capitalize">{key.replace(/_/g, " ")}</span>
                <span className="font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="max-w-6xl mx-auto px-6 mt-16 py-6 text-center text-gray-500 text-sm border-t">
        Designed for Industrial Professionals © {new Date().getFullYear()}
      </div>

      {/* ENQUIRY MODAL */}
      <EnquiryModal
        open={openEnquiry}
        onClose={() => setOpenEnquiry(false)}
        product={product}
      />
    </div>
  );
}
