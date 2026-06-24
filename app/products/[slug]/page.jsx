import { notFound } from "next/navigation";
import ProductDetailClient from "./client";
import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import { getProductBySlug } from "@/lib/products";
import { getProductBreadcrumb } from "@/lib/api/categories";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  try {
    const product = await getProductBySlug(resolvedParams.slug);

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

  let product;
  try {
    product = await getProductBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  const breadcrumb = await getProductBreadcrumb(product);

  return (
    <div className="min-h-screen font-sans bg-white md:bg-[linear-gradient(180deg,#EEE5F3_0%,#FFFFFF_100%)] md:bg-no-repeat md:bg-[length:100%_420px]">
      <NavbarServer showMobileSearch={false} />
      <ProductDetailClient product={product} breadcrumb={breadcrumb} />
      <Footer />
    </div>
  );
}
