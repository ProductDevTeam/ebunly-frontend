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
  const [selectedOptions, setSelectedOptions] = useState({
    quantity: 1,
    length: "",
    color: product.options.color[0],
  });
  const [personalization, setPersonalization] = useState({
    enabled: false,
    text: "",
    textColor: "Black",
    fontStyle: "",
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
      [field]: value,
    }));
  };

  const handleAddToCart = () => {
    console.log("Adding to cart:", {
      product: product.id,
      options: selectedOptions,
      personalization: personalization.enabled ? personalization : null,
    });
    // Add your cart logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Headerr */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        {/* <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Go Back</span>
          </button>

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </div> */}
      </header>

      {/* Main Content */}
      <main className="pb-10 pt-2 flex flex-col lg:flex-row lg:items-start lg:gap-8 lg:px-8 lg:max-w-7xl lg:mx-auto">
        {/* Image Gallery */}
        <div className="lg:w-1/2 lg:sticky lg:top-6">
          <ImageGallery images={product.images} />
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 bg-white mt-6 lg:mt-0">
          {/* Badges & Title */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center space-x-2 mb-2">
              {product.discount && (
                <span className="px-2 py-1 bg-gray-200 text-black text-xs font-semibold rounded">
                  {product.discount}
                </span>
              )}
              {product.badge && (
                <span className="px-2 py-1 bg-gray-200 text-black text-xs font-semibold rounded">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="text-lg font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Info Sections */}
          <div className="px-4 py-2 space-y-0">
            <ProductOptions
              options={product.options}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
            />

            {product.personalization.available && (
              <ProductPersonalization
                personalization={personalization}
                fields={product.personalization.fields}
                onToggle={handlePersonalizationToggle}
                onChange={handlePersonalizationChange}
              />
            )}

            <ProductKeyInfo keyInfo={product.keyInfo} />

            <ProductDescription description={product.description} />
          </div>
        </div>
      </main>
      <RelatedProducts products={product.relatedProducts} />

      {/* Fixed Bottom Add to Cart */}
      <AddToCartSection
        price={product.price}
        originalPrice={product.originalPrice}
        deliveryDate={product.deliveryDate}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
