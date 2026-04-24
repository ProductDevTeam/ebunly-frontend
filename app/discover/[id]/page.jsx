import { notFound } from "next/navigation";
import ProductDetailClient from "./client";
import { getProductById } from "@/lib/products";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  try {
    const product = await getProductById(resolvedParams.id);

    return {
      title: `${product.name} | CraftBasket`,
      description: product.description || product.shortDescription,
      openGraph: {
        title: product.name,
        description: product.description || product.shortDescription,
        images: [product.images?.[0]?.url || "/product.png"],
      },
    };
  } catch (error) {
    return {
      title: "Product Not Found",
    };
  }
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;

  try {
    const product = await getProductById(resolvedParams.id);

    if (!product) {
      notFound();
    }

    return <ProductDetailClient product={product} />;
  } catch (error) {
    notFound();
  }
}
