"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/products/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push("/admin/login");
            return;
          }
          throw new Error("Failed to load product details.");
        }

        const data = await res.json();
        setProduct(data.product);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load product.");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-[#8A796B]">
        <Loader2 className="w-8 h-8 animate-spin text-[#6D1A2A] mb-3" />
        <p className="text-xs uppercase tracking-wider">Loading product data...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white p-8 border border-[#EBD9C8] rounded-sm text-center max-w-md mx-auto my-12">
        <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <h2 className="font-serif text-lg text-[#171717]">Product Not Found</h2>
        <p className="text-xs text-[#6B5E55] mt-1 mb-4">{error || "Could not find the requested product record."}</p>
        <Link
          href="/admin/products"
          className="inline-block px-4 py-2 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider rounded-sm font-medium"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return <ProductForm initialData={product} isEdit={true} />;
}
