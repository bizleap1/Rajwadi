"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceInPaise: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  stock: number;
  inStock: boolean;
  isFeatured: boolean;
  images: { id: string; secureUrl: string; displayOrder: number }[];
  updatedAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Deletion modal state
  const [deletingProduct, setDeletingProduct] = useState<ProductRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        category,
        status,
      });
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await fetch(`/api/admin/products?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          window.location.href = "/?auth=signin";
          return;
        }
        throw new Error("Failed to load catalog products.");
      }

      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  }, [page, category, status, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deletingProduct.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to remove product.");
      }

      setDeleteMessage(data.message || "Product processed successfully.");
      setTimeout(() => {
        setDeletingProduct(null);
        setDeleteMessage("");
        fetchProducts();
      }, 1200);
    } catch (err: any) {
      alert(err.message || "Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EBD9C8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-5 bg-[#855D25]" />
            <span className="text-[10.5px] uppercase tracking-[0.25em] text-[#855D25] font-semibold">
              CATALOG MANAGEMENT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#171717] mt-1">
            Products ({totalCount})
          </h1>
          <p className="text-xs text-[#6B5E55] mt-0.5">
            Manage your bridal, traditional, and bespoke Rajputi poshaks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#6D1A2A] hover:bg-[#551320] text-white text-xs uppercase tracking-wider font-medium transition-colors shadow-sm rounded-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#EBD9C8] rounded-sm shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#855D25]" />
          <input
            type="text"
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25] rounded-sm placeholder:text-[#A09285]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#6B5E55]">
            <Filter className="w-3.5 h-3.5 text-[#855D25]" />
            <span>Category:</span>
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="bg-[#FCFAF6] border border-[#D9C4B0] text-xs py-2 px-2.5 rounded-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          >
            <option value="ALL">All Categories</option>
            <option value="Bridal">Bridal</option>
            <option value="Festive">Festive</option>
            <option value="Everyday">Everyday</option>
            <option value="Jewellery">Jewellery</option>
          </select>

          <span className="text-[#D9C4B0]">|</span>

          <span className="text-xs text-[#6B5E55]">Status:</span>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="bg-[#FCFAF6] border border-[#D9C4B0] text-xs py-2 px-2.5 rounded-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#855D25]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="bg-white border border-[#EBD9C8] rounded-sm py-20 flex flex-col items-center justify-center text-[#8A796B]">
          <Loader2 className="w-8 h-8 animate-spin text-[#6D1A2A] mb-3" />
          <p className="text-xs uppercase tracking-wider">Loading catalog products...</p>
        </div>
      ) : products.length === 0 ? (
        /* Empty state */
        <div className="bg-white border border-[#EBD9C8] rounded-sm py-16 text-center px-4">
          <div className="w-12 h-12 mx-auto bg-[#F8F1E7] flex items-center justify-center rounded-full text-[#855D25] mb-3">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif text-[#171717]">No products found</h3>
          <p className="text-xs text-[#6B5E55] max-w-sm mx-auto mt-1 mb-5">
            {search || category !== "ALL" || status !== "ALL"
              ? "Try adjusting your search filters to find what you are looking for."
              : "No poshak items have been added to the catalog yet."}
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#6D1A2A] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#551320] transition-colors rounded-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Product</span>
          </Link>
        </div>
      ) : (
        /* Product Table */
        <div className="bg-white border border-[#EBD9C8] rounded-sm shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8F1E7] border-b border-[#EBD9C8] text-[#4A3E37] uppercase tracking-wider text-[11px] font-medium">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price (INR)</th>
                  <th className="py-3 px-3">Inventory</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E5D8]">
                {products.map((product) => {
                  const coverImage =
                    product.images && product.images[0]?.secureUrl
                      ? product.images[0].secureUrl
                      : "/placeholder.webp";

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-[#FCFAF6] transition-colors"
                    >
                      {/* Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-16 bg-[#F3EBE1] relative rounded overflow-hidden flex-shrink-0 border border-[#EBD9C8]">
                            <Image
                              src={coverImage}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-medium text-sm text-[#171717] hover:text-[#6D1A2A]">
                                {product.name}
                              </span>
                              {product.isFeatured && (
                                <span
                                  className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-[#FFF8E7] border border-[#C2843A]/40 text-[#855D25] font-medium rounded"
                                  title="Featured on Homepage"
                                >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>Featured</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#8A796B] font-mono block mt-0.5">
                              /product/{product.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block px-2 py-0.5 bg-[#F3EBE1] text-[#4A3E37] text-[10.5px] tracking-wide rounded-sm font-medium">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-3 font-medium text-[#171717]">
                        ₹ {(product.priceInPaise / 100).toLocaleString("en-IN")}
                      </td>

                      {/* Stock / Availability */}
                      <td className="py-3.5 px-3">
                        {product.inStock && product.stock > 0 ? (
                          <span className="text-emerald-700 font-medium">
                            {product.stock} in stock
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            Out of stock
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {product.status === "PUBLISHED" ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Published
                          </span>
                        ) : product.status === "DRAFT" ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200">
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-gray-100 text-gray-700 border border-gray-200">
                            Archived
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-[#855D25] hover:text-[#6D1A2A] hover:bg-[#F3EBE1] rounded transition-colors"
                            title="Preview on Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-[#4A3E37] hover:text-[#6D1A2A] hover:bg-[#F3EBE1] rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 text-[#A24857] hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Remove Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-3.5 bg-[#FAF6F0] border-t border-[#EBD9C8] flex items-center justify-between text-xs text-[#6B5E55]">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 bg-white border border-[#D9C4B0] text-[#171717] hover:bg-[#F3EBE1] disabled:opacity-40 rounded-sm"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 bg-white border border-[#D9C4B0] text-[#171717] hover:bg-[#F3EBE1] disabled:opacity-40 rounded-sm"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#EBD9C8] max-w-md w-full p-6 shadow-xl rounded-none sm:rounded-sm">
            {deleteMessage ? (
              <div className="text-center py-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-serif text-lg text-[#171717]">Done</h3>
                <p className="text-xs text-[#6B5E55] mt-1">{deleteMessage}</p>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 text-red-700 rounded-full flex-shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#171717]">
                      Remove &quot;{deletingProduct.name}&quot;?
                    </h3>
                    <p className="text-xs text-[#6B5E55] mt-1">
                      Are you sure you want to remove this product? If the product has
                      existing orders in customer histories, it will be safely archived
                      and hidden from the store to prevent broken order receipts.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => setDeletingProduct(null)}
                    disabled={isDeleting}
                    className="px-3.5 py-2 text-xs uppercase tracking-wider font-medium text-[#4A3E37] hover:bg-[#F3EBE1] rounded-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs uppercase tracking-wider font-medium rounded-sm disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Confirm Removal</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
