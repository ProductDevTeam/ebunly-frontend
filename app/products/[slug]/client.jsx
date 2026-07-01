"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ImageGallery from "@/components/shared/dashboard/product-detail/gallery";
import ProductOptions from "@/components/shared/dashboard/product-detail/options";
import ProductPersonalization from "@/components/shared/dashboard/product-detail/personalization";
import ProductKeyInfo from "@/components/shared/dashboard/product-detail/info";
import ProductDescription from "@/components/shared/dashboard/product-detail/description";
import RelatedProducts from "@/components/shared/dashboard/product-detail/related";
import AddToCartSection from "@/components/shared/dashboard/product-detail/add-to-cart";
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
    enabled: false,
    type: null,
    extraPrice: 0,
    text: "",
    textColor: "Black",
  });

  const handleOptionChange = (option, value) => {
    setSelectedOptions((prev) => ({ ...prev, [option]: value }));
  };

  // Personalization data passed to the cart — only once a type is selected.
  const personalizationData =
    personalization.enabled && personalization.type
      ? {
          text: personalization.text,
          textColor: personalization.textColor,
          type: personalization.type,
        }
      : null;

  const getDeliveryDate = () => {
    if (!product.estimatedDeliveryDays) return null;
    const days = parseInt(product.estimatedDeliveryDays.split("-")[0]);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    return deliveryDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const deliveryDate = getDeliveryDate();

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

      {/* Main Content — container aligned with the header (max-w-7xl, px-4 md:px-6) */}
      <main className="pt-6 pb-10 flex flex-col lg:flex-row lg:items-start lg:gap-8 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Image Gallery — scrolls with the page */}
        <div className="lg:w-6/7">
          <ImageGallery images={images} product={product} />
        </div>

        {/* Product Info — pinned while the gallery scrolls */}
        <div className="lg:w-1/2 bg-transparent mt-6 lg:mt-0 lg:sticky lg:top-6">
          {/* Badges & Title */}
          <div className="pt-4 pb-2">
            {(product.discountPercentage > 0 ||
              product.isBestSeller ||
              product.isMadeInNigeria) && (
              <div className="flex items-center space-x-2 mb-2">
                {product.discountPercentage > 0 && (
                  <span className="px-3 py-1 bg-[#0C0000] text-white text-xs font-semibold rounded-full">
                    {product.discountPercentage}% off
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="px-3 py-1 bg-[#0C0000] text-white text-xs font-semibold rounded-full">
                    Best Seller
                  </span>
                )}
                {product.isMadeInNigeria && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Made in Nigeria
                  </span>
                )}
              </div>
            )}

            <h1 className="text-lg font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>

            {product.basePrice != null && (
              <p className="mt-2 text-2xl font-semibold text-gray-900">
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

            {product.isPersonalizable && (
              <ProductPersonalization
                value={personalization}
                onChange={setPersonalization}
              />
            )}

            {/* ── Desktop Add to Cart (shown before key info) ── */}
            <div className="py-4">
              <AddToCartDesktop
                product={product}
                selectedOptions={selectedOptions}
                personalization={personalizationData}
                onOptionChange={handleOptionChange}
                deliveryDate={deliveryDate}
              />
            </div>

            {keyInfoRows.length > 0 && <ProductKeyInfo keyInfo={keyInfoRows} />}

            {(product.description || product.shortDescription) && (
              <ProductDescription
                description={product.description || product.shortDescription}
              />
            )}
          </div>
        </div>
      </main>

      {product.relatedProducts?.length > 0 && (
        <RelatedProducts products={product.relatedProducts} />
      )}

      {/* Mobile-only fixed bottom bar — untouched */}
      <AddToCartSection
        product={product}
        selectedOptions={selectedOptions}
        personalization={personalizationData}
        deliveryDate={deliveryDate}
        onOptionChange={handleOptionChange}
      />
    </div>
  );
}
