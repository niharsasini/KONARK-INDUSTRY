"use client";
import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Page() {
  return (
    <div className="bg-white text-gray-900">
      {/* ================= HERO ================= */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm uppercase tracking-widest text-gray-400"
          >
            Contact Us
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold leading-snug sm:leading-tight"
          >
            We’d Love to Hear From You
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 sm:mt-6 max-w-xl sm:max-w-2xl mx-auto text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed"
          >
            Whether you have a question about our products, pricing,
            partnerships, or support — our team is ready to help.
          </motion.p>
        </div>
      </section>

      {/* ================= CONTACT INFO + FORM ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* LEFT CONTENT */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Contact Information
            </h2>
            <p className="mt-4 sm:mt-6 text-gray-600 leading-relaxed text-sm sm:text-base">
              Reach out through any of the channels below. Our team typically
              responds within one business day.
            </p>

            <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-8 text-sm sm:text-base">
              <div>
                <p className="text-gray-500">General Inquiries</p>
                <p className="font-medium">info@yourcompany.com</p>
              </div>

              <div>
                <p className="text-gray-500">Sales & Partnerships</p>
                <p className="font-medium">sales@yourcompany.com</p>
              </div>

              <div>
                <p className="text-gray-500">Customer Support</p>
                <p className="font-medium">support@yourcompany.com</p>
              </div>

              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">+91 98765 43210</p>
              </div>

              <div>
                <p className="text-gray-500">Business Hours</p>
                <p className="font-medium">
                  Monday – Saturday : 9:30 AM – 6:30 PM
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-gray-50 p-6 sm:p-10 rounded-2xl border shadow-sm"
          >
            <h3 className="text-lg sm:text-xl font-semibold">
              Send Us a Message
            </h3>
            <p className="mt-1 sm:mt-2 text-sm text-gray-600">
              Fill out the form and we’ll get back to you shortly.
            </p>

            <form className="mt-4 sm:mt-6 space-y-4 sm:space-y-5">
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-gray-900 outline-none text-sm sm:text-base"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email Address</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-gray-900 outline-none text-sm sm:text-base"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Subject</label>
                <select className="mt-1 w-full rounded-lg border px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-gray-900 outline-none text-sm sm:text-base">
                  <option>General Inquiry</option>
                  <option>Sales</option>
                  <option>Support</option>
                  <option>Partnership</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Message</label>
                <textarea
                  rows="4"
                  className="mt-1 w-full rounded-lg border px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-gray-900 outline-none text-sm sm:text-base"
                  placeholder="Write your message here..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gray-900 py-2 sm:py-3 text-white font-medium hover:bg-gray-800 transition text-sm sm:text-base"
              >
                Submit Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ================= OFFICE LOCATIONS ================= */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-semibold text-center"
          >
            Our Office Location
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-2 sm:mt-4 text-gray-600 text-center text-sm sm:text-base"
          >
            Visit us at our corporate office.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 sm:mt-12 rounded-2xl overflow-hidden h-64 sm:h-96 bg-gray-300 flex items-center justify-center text-gray-600 text-sm sm:text-base"
          >
            Google Map Integration Here
          </motion.div>
        </div>
      </section>

      {/* ================= FOOT NOTE ================= */}
      <section className="py-12 sm:py-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 sm:px-6 text-center"
        >
          <p className="text-gray-600 text-sm sm:text-base">
            We value your time and privacy. All inquiries are handled securely
            and professionally.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
