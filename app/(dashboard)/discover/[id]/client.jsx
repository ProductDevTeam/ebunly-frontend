"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Heart, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageGallery from "@/components/shared/dashboard/product-detail/gallery";
import ProductOptions from "@/components/shared/dashboard/product-detail/options";
import ProductPersonalization from "@/components/shared/dashboard/product-detail/personalization";
import ProductKeyInfo from "@/components/shared/dashboard/product-detail/info";
import ProductDescription from "@/components/shared/dashboard/product-detail/description";
import RelatedProducts from "@/components/shared/dashboard/product-detail/related";
import AddToCartSection from "@/components/shared/dashboard/product-detail/add-to-cart";

export default function ProductDetailClient({ product }) {
  const router = useRouter();

  // Extract images from API response
  const images = product.images?.map((img) => img.url) || ["/product.png"];

  // Initialize variants state
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
    data: {},
  });

  const [isFavorite, setIsFavorite] = useState(false);

  const handleOptionChange = (option, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const handlePersonalizationToggle = () => {
    setPersonalization((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  };

  const handlePersonalizationChange = (field, value) => {
    setPersonalization((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
    }));
  };

  const handleAddToCart = () => {
    console.log("Adding to cart:", {
      product: product._id,
      options: selectedOptions,
      personalization: personalization.enabled ? personalization.data : null,
    });
    // Add your cart logic here
  };

  // Calculate delivery date
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        {/* Optional: Add back button and favorite */}
      </header>

      {/* Main Content */}
      <main className="pb-10 pt-2 flex flex-col lg:flex-row lg:items-start lg:gap-8 lg:px-8 lg:max-w-7xl lg:mx-auto">
        {/* Image Gallery */}
        <div className="lg:w-1/2 lg:sticky lg:top-6">
          <ImageGallery images={images} />
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 bg-white mt-6 lg:mt-0">
          {/* Badges & Title */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center space-x-2 mb-2">
              {product.discountPercentage > 0 && (
                <span className="px-2 py-1 bg-gray-200 text-black text-xs font-semibold rounded">
                  {product.discountPercentage}% off
                </span>
              )}
              {product.isBestSeller && (
                <span className="px-2 py-1 bg-gray-200 text-black text-xs font-semibold rounded">
                  Best Seller
                </span>
              )}
              {product.isMadeInNigeria && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                  Made in Nigeria
                </span>
              )}
            </div>

            <h1 className="text-lg font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Info Sections */}
          <div className="px-4 py-2 pb-8 md:pb-0 space-y-0">
            <ProductOptions
              product={product}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
            />

            {product.isPersonalizable &&
              product.personalizationOptions?.length > 0 && (
                <ProductPersonalization
                  personalization={personalization}
                  options={product.personalizationOptions}
                  onToggle={handlePersonalizationToggle}
                  onChange={handlePersonalizationChange}
                />
              )}

            {product.keyInfo?.length > 0 && (
              <ProductKeyInfo keyInfo={product.keyInfo} />
            )}

            <ProductDescription
              description={
                product.description || product.shortDescription || ""
              }
            />
          </div>
        </div>

        {product.relatedProducts?.length > 0 && (
          <RelatedProducts
            products={product.relatedProducts}
            className="block md:hidden"
          />
        )}
      </main>

      {product.relatedProducts?.length > 0 && (
        <RelatedProducts
          products={product.relatedProducts}
          className="hidden md:block"
        />
      )}

      {/* Fixed Bottom Add to Cart */}
      <AddToCartSection
        price={product.basePrice}
        originalPrice={product.compareAtPrice}
        deliveryDate={getDeliveryDate()}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
