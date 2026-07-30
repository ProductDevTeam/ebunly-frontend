"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ImageGallery from "@/components/shared/dashboard/product-detail/gallery";
import ProductOptions from "@/components/shared/dashboard/product-detail/options";
import ProductPersonalization from "@/components/shared/dashboard/product-detail/personalization";
import ProductAddOns from "@/components/shared/dashboard/product-detail/add-ons";
import WishlistModal from "@/components/shared/dashboard/product-detail/wishlist-modal";
import ProductKeyInfo from "@/components/shared/dashboard/product-detail/info";
import ProductDescription from "@/components/shared/dashboard/product-detail/description";
import RelatedProducts from "@/components/shared/dashboard/product-detail/related";
import AddToCartDesktop from "@/components/shared/dashboard/product-detail/desktop-cart";
import Breadcrumb from "@/components/common/breadcrumb";

export default function ProductDetailClient({ product, breadcrumb = [] }) {
  const router = useRouter();

  const resolvedImages = (product.images ?? [])
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);
  const images = resolvedImages.length > 0 ? resolvedImages : ["/product.png"];
  const variantDefaults = {};
  product.variants?.forEach((variant) => {
    if (variant.options?.length > 0) {
      variantDefaults[variant.name.toLowerCase()] = variant.options[0];
    }
  });

  const [selectedOptions, setSelectedOptions] = useState({
    quantity: product.minQuantity || 1,
    ...variantDefaults,
  });

  const [personalization, setPersonalization] = useState({
    type: null,
    text: "",
    confirmed: false,
  });

  // COMPLETE THE GIFT selections, keyed by add-on (card / flowers / teddy).
  const [addOns, setAddOns] = useState({});

  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Category line above the title — the breadcrumb's parent entry.
  const categoryLabel =
    product.coreCategory ??
    product.category ??
    breadcrumb?.[breadcrumb.length - 2]?.label ??
    null;

  const handleOptionChange = (option, value) => {
    setSelectedOptions((prev) => ({ ...prev, [option]: value }));
  };

  // Personalization data passed to the cart — only once it's been confirmed.
  const personalizationData =
    personalization.confirmed && personalization.type
      ? { text: personalization.text, type: personalization.type }
      : null;

  const getDeliveryDate = (extraDays = 0) => {
    if (!product.estimatedDeliveryDays) return null;
    const days = parseInt(product.estimatedDeliveryDays.split("-")[0]);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days + extraDays);
    return deliveryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const deliveryDate = getDeliveryDate();

  // Personalization pushes delivery out, so the estimate shows both dates.
  const personalizationDays =
    (personalization.confirmed &&
      product.personalizationTypes?.find(
        (t) => t.name === personalization.type,
      )?.extraDays) ||
    (personalization.confirmed ? 2 : 0);
  const personalizedDeliveryDate =
    personalizationDays > 0 ? getDeliveryDate(personalizationDays) : null;

  // Key Info — prefer backend keyInfo[]; otherwise derive from real product fields
  const keyInfoRows =
    product.keyInfo?.length > 0
      ? product.keyInfo
      : [
          product.weight && {
            label: "Weight",
            value: String(product.weight),
          },
          product.color && { label: "Color", value: product.color },
          product.materials?.length > 0 && {
            label: "Materials",
            value: product.materials.join(", "),
          },
        ].filter(Boolean);

  return (
    <div className="font-sans">
      {/* Breadcrumb — hidden for now (kept for later use) */}
      <div className="hidden bg-white border-b border-gray-200">
        <div className="lg:max-w-7xl lg:mx-auto px-4 lg:px-8 py-3">
          <Breadcrumb items={breadcrumb} />
        </div>
      </div>

      {/*
       * Main content. The export draws a 1200px content column centered in a
       * 1440 frame (120px margins): max-w-[1232px] + px-4 lands exactly there
       * and keeps the 16px mobile gutter. Inside it the gallery is 763px, the
       * info column 420px, split by a 17px gap — 763 + 17 + 420 = 1200.
       */}
      <main className="pt-6 pb-10 flex flex-col lg:flex-row lg:items-start lg:gap-4.25 px-4 max-w-308 mx-auto">
        {/* Image Gallery — scrolls with the page */}
        <div className="lg:flex-1 lg:min-w-0">
          <ImageGallery images={images} product={product} />
        </div>

        {/* Product Info — pinned while the gallery scrolls */}
        <div className="lg:w-105 lg:shrink-0 bg-transparent mt-6 lg:mt-0 lg:sticky lg:top-6">
          {/* Badges & Title */}
          <div className="pb-4">
            {/* The export leads with the category, not promo badges. */}
            {categoryLabel && (
              <p className="text-[13px] text-[#6E6659]">{categoryLabel}</p>
            )}

            <h1 className="mt-1.5 text-[20px] font-semibold leading-[130%] text-[#24201C]">
              {product.name}
            </h1>

            {product.basePrice != null && (
              <p className="mt-2 text-[18px] font-normal text-[#24201C]">
                ₦{Number(product.basePrice).toLocaleString()}
              </p>
            )}
          </div>

          {/* Info Sections */}
          <div className="py-2 pb-8 md:pb-0 space-y-0">
            <ProductOptions
              product={product}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
            />

            <div className="space-y-3">
              {product.isPersonalizable && (
                <ProductPersonalization
                  types={product.personalizationTypes}
                  value={personalization}
                  onChange={setPersonalization}
                />
              )}

              <ProductAddOns
                addons={product.addOns}
                value={addOns}
                onChange={setAddOns}
              />
            </div>

            {/* ── Buy row ── */}
            <div className="py-5">
              <AddToCartDesktop
                product={product}
                selectedOptions={selectedOptions}
                personalization={personalizationData}
                onOptionChange={handleOptionChange}
                deliveryDate={deliveryDate}
                personalizedDeliveryDate={personalizedDeliveryDate}
                onOpenWishlist={() => setWishlistOpen(true)}
              />
            </div>

            <div className="h-px bg-[#EBE5E0] mb-5" />

            {keyInfoRows.length > 0 && <ProductKeyInfo keyInfo={keyInfoRows} />}

            {(product.description || product.shortDescription) && (
              <div className="mt-4">
                <ProductDescription
                  description={product.description || product.shortDescription}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {product.relatedProducts?.length > 0 && (
        <RelatedProducts products={product.relatedProducts} />
      )}

      {/* The dialog loads the user's lists itself; it only needs the product. */}
      <WishlistModal
        open={wishlistOpen}
        productId={product._id ?? product.id}
        onClose={() => setWishlistOpen(false)}
      />
    </div>
  );
}
