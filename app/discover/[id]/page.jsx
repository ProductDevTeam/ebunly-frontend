import { notFound } from "next/navigation";
import ProductDetailClient from "./client";

// Mock function to fetch product data - replace with your actual API call
async function getProduct(id) {
  // This would be your actual API call
  // const response = await fetch(`https://api.yoursite.com/products/${id}`);
  // const product = await response.json();

  // Mock data for demonstration
  const mockProduct = {
    id: id,
    name: "Personalised ESPRESSO CUP with Wooden Handle Demitasse Glass Tea",
    price: 25500,
    originalPrice: 28000,
    discount: "50% off",
    badge: "Best Seller",
    deliveryDate: "14th Dec",
    images: ["/product.png", "/product.png", "/product.png", "/product.png"],
    description:
      "Future-proof your skin. This LED mask uses 504 red, red plus infrared and blue LED lights to visibly improve overall skin health in just 10 minutes a day. In as little as 8 weeks, it's clinically proven to reduce under-eye wrinkles and fine lines...",
    keyInfo: {
      weight: "300g",
      color: "Black",
      materials: "Silver, Plastic",
    },
    options: {
      quantity: [1, 2, 3, 4, 5],
      length: ["Select One", "Small", "Medium", "Large"],
      color: ["Black", "White", "Red", "Blue"],
    },
    personalization: {
      available: true,
      fields: [
        { id: "text", label: "Text", type: "text", maxLength: 20 },
        {
          id: "textColor",
          label: "Text Color",
          type: "select",
          options: ["Black", "White", "Gold", "Silver"],
        },
        {
          id: "fontStyle",
          label: "Font Style",
          type: "select",
          options: ["Select One", "Serif", "Sans-serif", "Script", "Cursive"],
        },
      ],
    },
    relatedProducts: [
      {
        id: "1",
        name: "Black Embroide...",
        price: 2500,
        image: "/product.png",
      },
      {
        id: "2",
        name: "Black Embroide...",
        price: 2500,
        image: "/product.png",
      },
      {
        id: "3",
        name: "Black Embroide...",
        price: 2500,
        image: "/product.png",
      },
      {
        id: "4",
        name: "Black Embroide...",
        price: 2500,
        image: "/product.png",
      },
    ],
  };

  return mockProduct;
}

export async function generateMetadata({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | CraftBasket`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
