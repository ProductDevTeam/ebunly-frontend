"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

import { useCheckout } from "@/hooks/use-orders";
import { useInitializePayment } from "@/hooks/use-payments";
import { useDeliveryCost } from "@/hooks/use-deliveries";
import { useAddress } from "@/hooks/use-address";
import { useMe } from "@/hooks/use-profile";
import { useNotification } from "@/components/common/notification-provider";

const naira = (n) => `₦${Number(n ?? 0).toLocaleString()}`;

const FIELDS = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "Adeoluwa Haastrup",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "0701234567",
    required: true,
  },
  {
    name: "street",
    label: "Street Address",
    placeholder: "12 Allen Avenue",
    required: true,
    full: true,
  },
  { name: "city", label: "City", placeholder: "Ikeja", required: true },
  { name: "state", label: "State", placeholder: "Lagos", required: true },
  {
    name: "zipCode",
    label: "Zip Code",
    placeholder: "100001",
    required: false,
  },
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

export default function CheckoutModal({
  open,
  onClose,
  onSuccess,
  subtotal = 0,
  vendorCount = 1,
}) {
  const { mutateAsync: checkout, isPending } = useCheckout();
  const { mutateAsync: initializePayment, isPending: isPaying } =
    useInitializePayment();
  const { success: notifySuccess, error: notifyError } = useNotification();

  const [address, setAddress] = useState(EMPTY);
  const [notes, setNotes] = useState("");

  // Prefill from the saved profile address, otherwise the Addresses screen is
  // write-only. Done during render rather than in an effect, so it does not
  // cascade; `prefilled` resets on close so a reopen picks up a newer address.
  const { address: saved, exists: hasSaved } = useAddress();
  const { data: me } = useMe();
  const [prefilled, setPrefilled] = useState(false);

  if (open && !prefilled && (hasSaved || me)) {
    setPrefilled(true);
    setAddress((prev) => ({
      ...prev,
      fullName:
        prev.fullName ||
        [me?.firstName, me?.lastName].filter(Boolean).join(" "),
      phone: prev.phone || me?.phone || "",
      street: prev.street || saved.street || "",
      city: prev.city || saved.city || "",
      state: prev.state || saved.state || "",
      zipCode: prev.zipCode || saved.zipCode || "",
      country: prev.country || saved.country || "",
    }));
  }
  if (!open && prefilled) setPrefilled(false);

  // Quoted from the state as soon as it is typed. The endpoint is often down
  // (see use-deliveries.js), so `unavailable` is an expected state, not a bug.
  const delivery = useDeliveryCost(address.state, vendorCount);

  const busy = isPending || isPaying;

  const handleChange = (e) =>
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    const missing = FIELDS.filter((f) => f.required && !address[f.name].trim());
    if (missing.length) {
      notifyError(
        `Please fill in: ${missing.map((f) => f.label).join(", ")}.`,
        "Missing details",
      );
      return;
    }

    let order;
    try {
      order = await checkout({
        shippingAddress: address,
        billingAddress: {},
        notes,
      });
    } catch (err) {
      notifyError(err.message || "Checkout failed.", "Error");
      return;
    }

    // The order exists from here on, so a payment failure must not read as a
    // failed checkout — it is an unpaid order the customer can still settle.
    try {
      const { authorizationUrl } = await initializePayment(order.id);
      if (!authorizationUrl) throw new Error("No payment URL returned.");
      onSuccess?.(order);
      window.location.href = authorizationUrl;
    } catch (err) {
      notifySuccess(
        "Order placed. We could not open the payment page — you can pay from your orders.",
        "Order placed",
      );
      console.error("[checkout] payment initialize failed:", err);
      onSuccess?.(order);
    }
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
              <h2 className="text-lg font-bold text-gray-900">
                Shipping Address
              </h2>
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
                    className={
                      field.full ? "col-span-2" : "col-span-2 sm:col-span-1"
                    }
                  >
                    <label className="block text-sm text-gray-500 mb-1.5">
                      {field.label}
                      {field.required && (
                        <span className="text-primary"> *</span>
                      )}
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

              {/* Order total, once a state is known well enough to quote. */}
              <dl className="space-y-1.5 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between text-gray-500">
                  <dt>Subtotal</dt>
                  <dd>{naira(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-gray-500">
                  <dt>Delivery</dt>
                  <dd>
                    {delivery.isLoading
                      ? "Checking…"
                      : delivery.cost != null
                        ? naira(delivery.cost)
                        : "Calculated after checkout"}
                  </dd>
                </div>
                <div className="flex justify-between pt-1 font-semibold text-gray-900">
                  <dt>Total</dt>
                  <dd>{naira(subtotal + (delivery.cost ?? 0))}</dd>
                </div>
              </dl>

              <button
                type="submit"
                disabled={busy}
                className="w-full h-13 rounded-full bg-primary text-white font-semibold disabled:opacity-60 hover:brightness-105 transition flex items-center justify-center gap-2 py-3.5"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isPending ? "Placing order…" : "Opening payment…"}
                  </>
                ) : (
                  "Place Order & Pay"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
