import { notFound } from "next/navigation";
import { REAL_POSHAKS } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return REAL_POSHAKS.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = REAL_POSHAKS.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Poshak Not Found | Rajwadi Royal Heritage",
    };
  }

  return {
    title: `${product.name} — Authentic Rajputi Poshak | Rajwadi`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = REAL_POSHAKS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Get up to 4 complementary products for "You May Also Admire"
  const relatedProducts = REAL_POSHAKS.filter((p) => p.id !== product.id).slice(
    0,
    4
  );

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
