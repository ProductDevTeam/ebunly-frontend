"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { useVerifyPayment } from "@/hooks/use-payments";

/*
 * Where Paystack sends the customer back to. It appends `?reference=` (and
 * `trxref=`, the same value) to whichever callback URL the backend registered,
 * so that callback has to point here for a payment to be settled in the UI.
 *
 * There is no Figma export for this screen — it is a transaction result, built
 * from the existing account tokens rather than a design.
 */
const BRAND = "#D85A30";
const INK = "#24201C";
const MUTED = "#6E6659";

const STATE = {
  pending: {
    Icon: Loader2,
    color: MUTED,
    title: "Confirming your payment…",
    body: "This only takes a moment. Please don't close this tab.",
  },
  success: {
    Icon: CheckCircle2,
    color: "#2F6B4F",
    title: "Payment confirmed",
    body: "Thank you — your order is paid and on its way.",
  },
  failed: {
    Icon: XCircle,
    color: "#D90101",
    title: "We couldn't confirm this payment",
    body: "If you were charged, it will show on your order shortly. Otherwise you can try paying again from your orders.",
  },
};

function isPaid(result) {
  const status = String(
    result?.status ?? result?.data?.status ?? "",
  ).toLowerCase();
  return status === "success" || status === "paid" || result?.paid === true;
}

function VerifyInner() {
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("reference") ?? searchParams.get("trxref") ?? "";

  const { data, isLoading, isError } = useVerifyPayment(reference);

  const key =
    !reference || isError
      ? "failed"
      : isLoading
        ? "pending"
        : isPaid(data)
          ? "success"
          : "failed";

  const { Icon, color, title, body } = STATE[key];

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-115 flex-col items-center justify-center px-4 text-center">
      <Icon
        size={40}
        strokeWidth={1.5}
        style={{ color }}
        className={key === "pending" ? "animate-spin" : undefined}
      />

      <h1 className="mt-5 text-[20px] font-medium" style={{ color: INK }}>
        {title}
      </h1>
      <p className="mt-2 text-[14px] leading-5" style={{ color: MUTED }}>
        {body}
      </p>

      {reference && (
        <p className="mt-3 text-[12px]" style={{ color: MUTED }}>
          Reference {reference}
        </p>
      )}

      {key !== "pending" && (
        <Link
          href="/profile/orders"
          className="mt-8 flex h-11.5 w-full items-center justify-center rounded-lg text-[14px] text-white"
          style={{ backgroundColor: BRAND }}
        >
          View my orders
        </Link>
      )}
    </main>
  );
}

export default function VerifyClient() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}
