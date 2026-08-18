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
import RelatedToYourSearch from "@/components/shared/dashboard/product-detail/related-to-search";
import AddToCartDesktop from "@/components/shared/dashboard/product-detail/desktop-cart";
import Breadcrumb from "@/components/common/breadcrumb";
import { getProductPricing, formatNaira } from "@/lib/pricing";

export default function ProductDetailClient({ product, breadcrumb = [] }) {
  const router = useRouter();

  const resolvedVideos = product.videos ?? [];
  const mainVideo = resolvedVideos.find((v) => v.isMain);
  const otherVideos = resolvedVideos.filter((v) => !v.isMain);
  const resolvedImages = (product.images ?? [])
    .map((img) => (typeof img === "string" ? img : img?.url))
    .filter(Boolean);

  const rawMedia = [
    ...(mainVideo
      ? [
          {
            type: "video",
            url: mainVideo.url,
            thumbnail: mainVideo.thumbnail || null,
          },
        ]
      : []),
    ...resolvedImages.map((url) => ({ type: "image", url })),
    ...otherVideos.map((v) => ({
      type: "video",
      url: v.url,
      thumbnail: v.thumbnail || null,
    })),
  ];
  const galleryMedia =
    rawMedia.length > 0 ? rawMedia : [{ type: "image", url: "/product.png" }];

  // Variants start unselected — options.jsx's placeholder option and
  // desktop-cart.jsx's pre-submit check both depend on nothing being
  // silently pre-filled here.
  const [selectedOptions, setSelectedOptions] = useState({
    quantity: product.minQuantity || 1,
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
    product.subcategory ??
    product.subcategories?.[0] ??
    breadcrumb?.[breadcrumb.length - 2]?.label ??
    null;

  const { basePrice, hasDiscount, finalPrice } = getProductPricing(product);

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
    const businessDays =
      parseInt(product.estimatedDeliveryDays.split("-")[0]) + extraDays;
    const date = new Date();
    let added = 0;
    while (added < businessDays) {
      date.setDate(date.getDate() + 1);
      const dow = date.getDay();
      if (dow !== 0 && dow !== 6) added++;
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const deliveryDate = getDeliveryDate();

  // Personalization pushes delivery out, so the estimate shows both dates.
  const personalizationDays =
    (personalization.confirmed &&
      product.personalizationTypes?.find((t) => t.name === personalization.type)
        ?.extraDays) ||
    (personalization.confirmed ? 2 : 0);
  const personalizedDeliveryDate =
    personalizationDays > 0 ? getDeliveryDate(personalizationDays) : null;

  // Key Info — prefer backend keyInfo[]; otherwise derive from real product fields
  const keyInfoRows =
    product.keyInfo?.length > 0
      ? product.keyInfo
      : [
          (product.weightValue || product.weight) && {
            label: "Weight",
            value: product.weightValue
              ? `${product.weightValue}${product.weightUnit || ""}`
              : String(product.weight),
          },
          (product.colors?.length > 0 || product.color) && {
            label: "Color",
            value:
              product.colors?.length > 0
                ? product.colors.join(", ")
                : product.color,
          },
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
        {/* Image gallery — pinned while the info column scrolls past it.
            See .product-gallery-sticky in globals.css for why it is a rule
            rather than Tailwind variants. */}
        <div className="product-gallery-sticky lg:flex-1 lg:min-w-0">
          <ImageGallery media={galleryMedia} product={product} />
        </div>

        {/* Product info — the long column, and the only one that scrolls */}
        <div className="lg:w-105 lg:shrink-0 bg-transparent mt-6 lg:mt-0">
          {/* Badges & Title */}
          <div className="pb-4">
            {/* The export leads with the category, not promo badges. */}
            {categoryLabel && (
              <p className="text-[13px] text-[#6E6659]">{categoryLabel}</p>
            )}

            <h1 className="mt-1.5 text-[20px] font-bold leading-[130%] text-[#24201C]">
              {product.name}
            </h1>

            {product.basePrice != null && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {hasDiscount && (
                  <p className="text-[14px] text-text-gray line-through">
                    {formatNaira(basePrice)}
                  </p>
                )}
                <p className="text-[18px] font-normal text-[#993C1D]">
                  {formatNaira(finalPrice)}
                </p>
              </div>
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
              {product.isPersonalizable &&
                product.personalizationTypes?.length !== 0 && (
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
                deliveryRange={product.estimatedDeliveryDays || null}
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

      <RelatedProducts productId={product._id ?? product.id} />

      <RelatedToYourSearch />

      {/* The dialog loads the user's lists itself; it only needs the product. */}
      <WishlistModal
        open={wishlistOpen}
        productId={product._id ?? product.id}
        onClose={() => setWishlistOpen(false)}
      />
    </div>
  );
}
