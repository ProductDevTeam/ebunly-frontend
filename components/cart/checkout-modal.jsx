"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

import { useCheckout } from "@/hooks/use-orders";
import { useNotification } from "@/components/common/notification-provider";

const FIELDS = [
  { name: "fullName", label: "Full Name", placeholder: "Adeoluwa Haastrup", required: true },
  { name: "phone", label: "Phone Number", placeholder: "0701234567", required: true },
  { name: "street", label: "Street Address", placeholder: "12 Allen Avenue", required: true, full: true },
  { name: "city", label: "City", placeholder: "Ikeja", required: true },
  { name: "state", label: "State", placeholder: "Lagos", required: true },
  { name: "zipCode", label: "Zip Code", placeholder: "100001", required: false },
  { name: "country", label: "Country", placeholder: "Nigeria", required: true },
];

const EMPTY = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

export default function CheckoutModal({ open, onClose, onSuccess }) {
  const { mutate: checkout, isPending } = useCheckout();
  const { success: notifySuccess, error: notifyError } = useNotification();

  const [address, setAddress] = useState(EMPTY);
  const [notes, setNotes] = useState("");

  const handleChange = (e) =>
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const missing = FIELDS.filter((f) => f.required && !address[f.name].trim());
    if (missing.length) {
      notifyError(
        `Please fill in: ${missing.map((f) => f.label).join(", ")}.`,
        "Missing details",
      );
      return;
    }

    checkout(
      { shippingAddress: address, billingAddress: {}, notes },
      {
        onSuccess: () => {
          notifySuccess("Order placed successfully!", "Thank you");
          onSuccess?.();
        },
        onError: (err) =>
          notifyError(err.message || "Checkout failed.", "Error"),
      },
    );
  };

  const inputClass =
    "w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary/60 transition-colors";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-0 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {FIELDS.map((field) => (
                  <div
                    key={field.name}
                    className={field.full ? "col-span-2" : "col-span-2 sm:col-span-1"}
                  >
                    <label className="block text-sm text-gray-500 mb-1.5">
                      {field.label}
                      {field.required && <span className="text-primary"> *</span>}
                    </label>
                    <input
                      name={field.name}
                      value={address[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1.5">
                  Order Notes <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Delivery instructions, gift message…"
                  className={`${inputClass} h-auto py-3 resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full h-13 rounded-full bg-primary text-white font-semibold disabled:opacity-60 hover:brightness-105 transition flex items-center justify-center gap-2 py-3.5"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Placing order…
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
