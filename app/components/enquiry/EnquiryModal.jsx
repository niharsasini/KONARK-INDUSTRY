"use client";
import React from "react";
import { X } from "lucide-react";

export default function EnquiryModal({ open, onClose, product }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center">
      {/* Modal */}
      <div
        className="
          w-full sm:max-w-4xl
          bg-white
          rounded-t-2xl sm:rounded-2xl
          shadow-[0_30px_80px_rgba(0,0,0,0.6)]
          animate-scaleIn
          max-h-[92vh] sm:max-h-[95vh]
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-2xl font-bold text-white">
              Product Enquiry
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mt-1">
              {product.name} • {product.category}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-300 hover:text-yellow-400 transition p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form className="px-4 sm:px-6 py-4 sm:py-5 space-y-5 overflow-y-auto max-h-[calc(92vh-64px)] sm:max-h-[calc(95vh-80px)]">
          {/* Product Info */}
          <section className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Product Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Product Name</label>
                <input
                  value={product.name}
                  readOnly
                  className="input bg-gray-100"
                />
              </div>

              <div>
                <label className="label">Category</label>
                <input
                  value={product.category}
                  readOnly
                  className="input bg-gray-100"
                />
              </div>
            </div>
          </section>

          {/* Customer Info */}
          <section className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Full Name</label>
                <input className="input" required />
              </div>

              <div>
                <label className="label">Mobile Number</label>
                <input className="input" required />
              </div>

              <div>
                <label className="label">Email</label>
                <input type="email" className="input" />
              </div>

              <div>
                <label className="label">Quantity</label>
                <input type="number" min="1" className="input" />
              </div>
            </div>

            <div className="mt-3">
              <label className="label">Delivery Address</label>
              <textarea rows={3} className="input resize-none" />
            </div>
          </section>

          {/* Payment Info */}
          <section className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              Payment Details
            </h3>

            {/* QR Section */}
            <div className="bg-white border rounded-xl p-4 mb-4 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              <div className="w-36 h-36 border rounded-lg overflow-hidden">
                <img
                  src="/payment-qr.png"
                  alt="Konark Industry Payment QR"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-center sm:text-left">
                <p className="font-semibold text-gray-900 text-sm">
                  Scan & Pay to Konark Industry
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Use any UPI app (GPay, PhonePe, Paytm, etc.). After payment,
                  fill details below and upload screenshot.
                </p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Payer Name</label>
                <input className="input" />
              </div>

              <div>
                <label className="label">Transaction / UTR ID</label>
                <input className="input" />
              </div>

              <div>
                <label className="label">Paid Amount (₹)</label>
                <input type="number" className="input" />
              </div>

              <div>
                <label className="label">Payment Date</label>
                <input type="date" className="input" />
              </div>

              <div className="sm:col-span-2">
                <label className="label">Payment Time</label>
                <input type="time" className="input" />
              </div>
            </div>

            {/* Screenshot */}
            <div className="mt-4">
              <label className="label">Payment Screenshot</label>
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-md border border-dashed border-gray-400 p-3 text-sm bg-white"
              />
            </div>
          </section>

          {/* Submit */}
          <div className="pb-3">
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl transition active:scale-[0.98]"
            >
              Submit Enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
