"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import ProductOptions from "@/components/shared/dashboard/product-detail/options";
import ProductPersonalization from "@/components/shared/dashboard/product-detail/personalization";
import ProductAddOns from "@/components/shared/dashboard/product-detail/add-ons";
import WishlistModal from "@/components/shared/dashboard/product-detail/wishlist-modal";

/*
 * States board for `Components - Personalization Feature Key Info.png` — every
 * state the sheet draws, side by side, so the whole matrix can be shot in one
 * pass. The sheet lays the cards out at 420px, which is the product page's
 * right column, so each cell is fixed at that width.
 */
const PRODUCT = {
  variants: [{ name: "Length", options: ['16"', '18"', '20"'] }],
};

const WISHLISTS = [
  { id: "1", name: "Sarah's Birthday Wishlist", itemCount: 5 },
  { id: "2", name: "Housewarming List", itemCount: 3 },
];

function Cell({ label, children }) {
  return (
    <div data-cell={label} className="w-full max-w-105">
      <p className="mb-2 text-[10px] tracking-[0.08em] text-[#B6B0A8] uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

/*
 * The dialog is fixed-position, so its states cannot sit side by side — shoot
 * one at a time with `?wl=list`, `?wl=create` or `?wl=empty`.
 */
function WishlistStage() {
  const stage = useSearchParams().get("wl");
  const [open, setOpen] = useState(true);

  if (!stage) return null;

  return (
    <WishlistModal
      open={open}
      wishlists={stage === "empty" ? [] : WISHLISTS}
      defaultCreating={stage === "create"}
      onClose={() => setOpen(false)}
    />
  );
}

export default function PersonalizationStatesUiTest() {
  const [length, setLength] = useState({ length: '18"' });
  const [live, setLive] = useState({ type: null, text: "", confirmed: false });
  const [liveAddons, setLiveAddons] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FDFBF9] px-10 py-10 font-sans">
      <div className="flex flex-wrap gap-10">
        <Cell label="variation">
          <ProductOptions
            product={PRODUCT}
            selectedOptions={length}
            onOptionChange={(k, v) => setLength({ [k]: v })}
          />
        </Cell>

        <Cell label="personalization-empty">
          <ProductPersonalization
            value={{ type: "Engraving", text: "", confirmed: false }}
            onChange={() => {}}
          />
        </Cell>

        <Cell label="personalization-filled">
          <ProductPersonalization
            value={{
              type: "Engraving",
              text: "To the best sister",
              confirmed: false,
            }}
            onChange={() => {}}
          />
        </Cell>

        <Cell label="personalization-idle">
          <ProductPersonalization
            value={{ type: null, text: "", confirmed: false }}
            onChange={() => {}}
          />
        </Cell>

        <Cell label="personalization-confirmed">
          <ProductPersonalization
            value={{
              type: "Engraving",
              text: "To the best sister",
              confirmed: true,
            }}
            onChange={() => {}}
          />
        </Cell>

        <Cell label="addons-card">
          <ProductAddOns defaultOpenKey="card" value={{}} onChange={() => {}} />
        </Cell>

        <Cell label="addons-flowers">
          <ProductAddOns defaultOpenKey="flowers" value={{}} onChange={() => {}} />
        </Cell>

        <Cell label="addons-teddy">
          <ProductAddOns defaultOpenKey="teddy" value={{}} onChange={() => {}} />
        </Cell>

        <Cell label="addons-idle">
          <ProductAddOns value={{}} onChange={() => {}} />
        </Cell>

        <Cell label="addons-confirmed">
          <ProductAddOns
            value={{
              flowers: { designId: "f3", name: "Rose bouquet", price: 5000 },
              card: { designId: "c1", name: "Birthday card 1", price: 1500 },
              teddy: {
                designId: "t2",
                name: "Classic brown teddy",
                price: 6000,
              },
            }}
            onChange={() => {}}
          />
        </Cell>

        {/* The live copies are here so the interactive paths stay testable. */}
        <Cell label="personalization-live">
          <ProductPersonalization value={live} onChange={setLive} />
        </Cell>

        <Cell label="addons-live">
          <ProductAddOns value={liveAddons} onChange={setLiveAddons} />
        </Cell>
      </div>

      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="mt-10 rounded-lg bg-[#D85A30] px-4 py-2 text-[13px] text-white"
      >
        Open wishlist modal
      </button>

      <WishlistModal
        open={modalOpen}
        wishlists={WISHLISTS}
        onClose={() => setModalOpen(false)}
      />

      <Suspense fallback={null}>
        <WishlistStage />
      </Suspense>
    </main>
  );
}
