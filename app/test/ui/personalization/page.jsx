"use client";

import { useState } from "react";
import ProductPersonalization from "@/components/shared/dashboard/product-detail/personalization";

const INITIAL = {
  enabled: false,
  type: null,
  extraPrice: 0,
  text: "",
  textColor: "Black",
};

export default function PersonalizationUiTest() {
  const [value, setValue] = useState(INITIAL);

  return (
    <main className="max-w-md mx-auto px-4 py-12 font-sans">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Personalization
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Add → choose a type → edit the summary inline. Mock data, no login.
      </p>

      <ProductPersonalization value={value} onChange={setValue} />

      {/* Live state, for reference */}
      <pre className="mt-8 rounded-xl bg-gray-50 border border-gray-100 p-4 text-xs text-gray-600 overflow-x-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    </main>
  );
}
