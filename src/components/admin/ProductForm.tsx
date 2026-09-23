"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  X,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Sparkles,
  Sliders,
  Check,
} from "lucide-react";
import { ProductFormValues } from "@/lib/validations/product";

interface ProductImageItem {
  id?: string;
  publicId?: string | null;
  secureUrl: string;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  displayOrder: number;
  altText?: string | null;
}

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(isEdit));
  const [category, setCategory] = useState<string>(
    initialData?.category || "Bridal"
  );
  const [type, setType] = useState<string>(
    initialData?.type || "Stitched"
  );
  const [subCategory, setSubCategory] = useState<string>(
    initialData?.subCategory || ""
  );
  const [priceInRupees, setPriceInRupees] = useState<string>(
    initialData?.priceInPaise ? (initialData.priceInPaise / 100).toString() : ""
  );
  const [compareAtPriceInRupees, setCompareAtPriceInRupees] = useState<string>(
    initialData?.compareAtPriceInPaise
      ? (initialData.compareAtPriceInPaise / 100).toString()
      : ""
  );
  const [priceNote, setPriceNote] = useState<string>(
    initialData?.priceNote || ""
  );
  const [fabric, setFabric] = useState(initialData?.fabric || "");
  const [craft, setCraft] = useState(initialData?.craft || "");
  const [color, setColor] = useState(initialData?.color || "");
  const [quality, setQuality] = useState(initialData?.quality || "");
  const [work, setWork] = useState(initialData?.work || "");
  const [odhna, setOdhna] = useState(initialData?.odhna || "");
  const [bestFor, setBestFor] = useState(initialData?.bestFor || "");
  const [soldOut, setSoldOut] = useState<boolean>(initialData?.soldOut ?? false);
  const [description, setDescription] = useState(initialData?.description || "");
  const [details, setDetails] = useState<string[]>(
    Array.isArray(initialData?.details) && initialData.details.length > 0
      ? initialData.details
      : [""]
  );
  const [includes, setIncludes] = useState<string[]>(
    Array.isArray(initialData?.includes) && initialData.includes.length > 0
      ? initialData.includes
      : [""]
  );
  const [size, setSize] = useState<string>(initialData?.size || "");
  const [sizes, setSizes] = useState<string>(
    Array.isArray(initialData?.sizes) ? initialData.sizes.join(", ") : ""
  );
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    initialData?.status || "PUBLISHED"
  );
  const [stock, setStock] = useState<number>(initialData?.stock ?? 10);
  const [inStock, setInStock] = useState<boolean>(initialData?.inStock ?? true);
  const [stitchingAvailable, setStitchingAvailable] = useState<boolean>(
    initialData?.stitchingAvailable ?? false
  );
  const [stitchingPriceInRupees, setStitchingPriceInRupees] = useState<string>(
    initialData?.stitchingPriceInPaise
      ? (initialData.stitchingPriceInPaise / 100).toString()
      : "2500"
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured ?? false);
  const [featuredOrder, setFeaturedOrder] = useState<number>(initialData?.featuredOrder ?? 0);
  const [imagePosition, setImagePosition] = useState<string>(
    initialData?.imagePosition || "center 5%"
  );
  const [imageScale, setImageScale] = useState<number>(initialData?.imageScale ?? 1.0);
  const [version, setVersion] = useState<number>(initialData?.version ?? 1);

  // Images state
  const [images, setImages] = useState<ProductImageItem[]>(() => {
    if (initialData?.images && Array.isArray(initialData.images)) {
      return initialData.images.map((img: any, idx: number) => ({
        id: img.id,
        publicId: img.publicId,
        secureUrl: img.secureUrl,
        displayOrder: img.displayOrder ?? idx,
      }));
    }
    return [];
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Auto-generate slug from name if not manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    setIsDirty(true);
    if (!slugManuallyEdited) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(generated);
    }
  };

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Handle local image file upload to Cloudinary (signed)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError("");
    setUploadProgress(`Requesting upload authorization...`);

    try {
      // 1. Get signed params from server
      const signRes = await fetch("/api/admin/uploads/sign", {
        method: "POST",
      });

      const signData = await signRes.json();

      if (!signRes.ok) {
        throw new Error(
          signData.error ||
            "Cloudinary credentials missing or upload authorization failed."
        );
      }

      const { timestamp, signature, apiKey, cloudName, folder } = signData;

      const newUploadedImages: ProductImageItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading ${i + 1} of ${files.length} (${file.name})...`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append("folder", folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(errData.error?.message || "Failed to upload image to Cloudinary");
        }

        const uploaded = await uploadRes.json();

        newUploadedImages.push({
          publicId: uploaded.public_id,
          secureUrl: uploaded.secure_url,
          width: uploaded.width,
          height: uploaded.height,
          format: uploaded.format,
          displayOrder: images.length + newUploadedImages.length,
        });
      }

      setImages((prev) => [...prev, ...newUploadedImages]);
      setIsDirty(true);
      setUploadProgress("Images uploaded successfully!");
      setTimeout(() => setUploadProgress(""), 2000);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Upload failed. Ensure Cloudinary credentials are set in .env."
      );
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Add custom URL image fallback
  const handleAddImageUrl = () => {
    const url = prompt("Enter full image URL (or relative /products/... path):");
    if (url && url.trim()) {
      setImages((prev) => [
        ...prev,
        {
          secureUrl: url.trim(),
          publicId: null,
          displayOrder: prev.length,
        },
      ]);
      setIsDirty(true);
    }
  };

  // Image helpers
  const moveImage = (index: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    setImages(updated.map((img, idx) => ({ ...img, displayOrder: idx })));
    setIsDirty(true);
  };

  const removeImage = (index: number) => {
    setImages((prev) =>
      prev.filter((_, idx) => idx !== index).map((img, idx) => ({ ...img, displayOrder: idx }))
    );
    setIsDirty(true);
  };

  const makeCover = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [cover] = updated.splice(index, 1);
    updated.unshift(cover);
    setImages(updated.map((img, idx) => ({ ...img, displayOrder: idx })));
    setIsDirty(true);
  };

  // Detail item helpers
  const addDetail = () => setDetails((prev) => [...prev, ""]);
  const updateDetail = (idx: number, val: string) => {
    setDetails((prev) => prev.map((d, i) => (i === idx ? val : d)));
    setIsDirty(true);
  };
  const removeDetail = (idx: number) => {
    setDetails((prev) => prev.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  // Includes item helpers
  const addInclude = () => setIncludes((prev) => [...prev, ""]);
  const updateInclude = (idx: number, val: string) => {
    setIncludes((prev) => prev.map((inc, i) => (i === idx ? val : inc)));
    setIsDirty(true);
  };
  const removeInclude = (idx: number) => {
    setIncludes((prev) => prev.filter((_, i) => i !== idx));
    setIsDirty(true);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const parsedPrice = parseFloat(priceInRupees);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Please enter a valid price in INR.");
      return;
    }
    const priceInPaise = Math.round(parsedPrice * 100);

    let compareAtPriceInPaise: number | undefined = undefined;
    if (compareAtPriceInRupees.trim()) {
      const parsedCompare = parseFloat(compareAtPriceInRupees);
      if (!isNaN(parsedCompare) && parsedCompare > 0) {
        compareAtPriceInPaise = Math.round(parsedCompare * 100);
      }
    }

    let stitchingPriceInPaise = 0;
    if (stitchingAvailable && stitchingPriceInRupees.trim()) {
      const parsedStitching = parseFloat(stitchingPriceInRupees);
      if (!isNaN(parsedStitching) && parsedStitching >= 0) {
        stitchingPriceInPaise = Math.round(parsedStitching * 100);
      }
    }

    const filteredDetails = details.map((d) => d.trim()).filter(Boolean);
    const filteredIncludes = includes.map((inc) => inc.trim()).filter(Boolean);

    if (filteredDetails.length === 0) {
      setError("Please provide at least one product detail line.");
      return;
    }
    if (filteredIncludes.length === 0) {
      setError("Please provide at least one product includes item.");
      return;
    }

    if (status === "PUBLISHED" && images.length === 0) {
      setError("A published product must have at least one image.");
      return;
    }

    const payload: ProductFormValues = {
      name: name.trim(),
      slug: slug.trim(),
      category,
      type,
      subCategory: subCategory.trim() || undefined,
      priceInPaise,
      compareAtPriceInPaise,
      priceNote: priceNote.trim() || undefined,
      fabric: fabric.trim(),
      craft: craft.trim(),
      color: color.trim(),
      quality: quality.trim() || undefined,
      work: work.trim() || undefined,
      odhna: odhna.trim() || undefined,
      bestFor: bestFor.trim() || undefined,
      soldOut,
      description: description.trim(),
      details: filteredDetails,
      includes: filteredIncludes,
      size: size.trim() || undefined,
      sizes: sizes
        ? sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      status,
      stock,
      inStock: inStock && !soldOut,
      stitchingAvailable,
      stitchingPriceInPaise,
      isFeatured,
      featuredOrder: isFeatured ? featuredOrder : 0,
      imagePosition,
      imageScale,
      version: isEdit ? version : undefined,
      images: images.map((img, idx) => ({
        id: img.id,
        publicId: img.publicId || null,
        secureUrl: img.secureUrl,
        displayOrder: idx,
      })),
      variants: [],
    };

    setIsSaving(true);

    try {
      const url = isEdit
        ? `/api/admin/products/${initialData.id || initialData.slug}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save product.");
      }

      setIsDirty(false);
      setSuccessMessage(
        isEdit ? "Product changes saved successfully!" : "Product created successfully!"
      );

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EBD9C8]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 text-[#4A3E37] hover:text-[#6D1A2A] hover:bg-[#F3EBE1] rounded-sm transition-colors"
            title="Back to Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#855D25] font-semibold">
              {isEdit ? "EDIT POSHAK" : "CREATE NEW POSHAK"}
            </span>
            <h1 className="text-2xl font-serif text-[#171717]">
              {isEdit ? `Edit "${name || initialData?.name}"` : "Add New Catalog Product"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 border border-[#D9C4B0] text-xs uppercase tracking-wider font-medium text-[#4A3E37] hover:bg-[#F3EBE1] rounded-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-[#6D1A2A] hover:bg-[#551320] text-white text-xs uppercase tracking-wider font-medium shadow-sm rounded-sm transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEdit ? "Save Changes" : "Publish Product"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 rounded-sm">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 rounded-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Media Management */}
        <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E5D8]">
            <div>
              <h2 className="text-base font-serif text-[#171717]">
                Product Imagery
              </h2>
              <p className="text-xs text-[#6B5E55]">
                First image serves as the cover poshak view. Drag or use arrows to reorder.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="text-[11px] text-[#855D25] hover:underline font-medium"
            >
              + Add by URL
            </button>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-[#D9C4B0] hover:border-[#855D25] p-6 text-center rounded-sm bg-[#FCFAF6] transition-colors relative">
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="flex flex-col items-center pointer-events-none">
              <Upload className="w-8 h-8 text-[#855D25] mb-2" />
              <p className="text-xs font-medium text-[#171717]">
                {isUploading ? uploadProgress : "Click or drag images to upload to Cloudinary"}
              </p>
              <p className="text-[11px] text-[#A09285] mt-0.5">
                Supports JPG, PNG, and WebP (up to 10MB per image)
              </p>
            </div>
          </div>

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative group bg-[#F8F1E7] border border-[#EBD9C8] rounded-sm overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={img.secureUrl}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    {index === 0 && (
                      <span className="absolute top-1 left-1 bg-[#6D1A2A] text-white text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded shadow">
                        Cover
                      </span>
                    )}
                  </div>

                  <div className="p-1.5 bg-white border-t border-[#EBD9C8] flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveImage(index, "up")}
                        className="p-1 text-[#4A3E37] hover:text-[#6D1A2A] disabled:opacity-30"
                        title="Move left/up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === images.length - 1}
                        onClick={() => moveImage(index, "down")}
                        className="p-1 text-[#4A3E37] hover:text-[#6D1A2A] disabled:opacity-30"
                        title="Move right/down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => makeCover(index)}
                          className="text-[10px] text-[#855D25] hover:underline"
                          title="Make cover"
                        >
                          Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Image Position & Scale Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#F0E5D8]">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Storefront Image Alignment (CSS Position)
              </label>
              <input
                type="text"
                value={imagePosition}
                onChange={(e) => {
                  setImagePosition(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="center 5%"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
              <span className="text-[10.5px] text-[#8A796B] mt-0.5 block">
                Controls vertical focus for poshak drapery (e.g. &quot;center 5%&quot; or &quot;center 2%&quot;).
              </span>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Image Zoom Scale ({imageScale}x)
              </label>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={imageScale}
                onChange={(e) => {
                  setImageScale(parseFloat(e.target.value));
                  setIsDirty(true);
                }}
                className="w-full accent-[#6D1A2A]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: General Product Information */}
        <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-serif text-[#171717]">
              Product Identification & Classification
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Defines product title, SEO slug, and primary poshak classification.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-[#F0E5D8]">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Morbagh Poshak"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugManuallyEdited(true);
                  setIsDirty(true);
                }}
                placeholder="morbagh-rajputi-poshak"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] font-mono rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Primary Category *
              </label>
              <select
                value={category}
                onChange={(e: any) => {
                  setCategory(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              >
                <option value="Bridal">Bridal</option>
                <option value="Festive">Festive</option>
                <option value="Everyday">Everyday</option>
                <option value="Jewellery">Jewellery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Product Type *
              </label>
              <select
                value={type}
                onChange={(e: any) => {
                  setType(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              >
                <option value="Stitched">Stitched</option>
                <option value="Unstitched">Unstitched</option>
                <option value="Jewellery">Jewellery</option>
              </select>
            </div>
          </div>

          {/* Pricing & Size Hierarchy */}
          <div className="pt-4 border-t border-[#F0E5D8] space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#855D25]">
                Pricing & Size Specifications
              </h3>
              <p className="text-[11px] text-[#6B5E55]">
                Corresponds directly to the price headline, inclusive notes, and size buttons on the Storefront.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                  Selling Price in INR (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={priceInRupees}
                  onChange={(e) => {
                    setPriceInRupees(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="7200"
                  className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                  Original / Strike-through Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={compareAtPriceInRupees}
                  onChange={(e) => {
                    setCompareAtPriceInRupees(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="8000"
                  className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                  Price Note (e.g. &quot;Inclusive of stitching&quot;)
                </label>
                <input
                  type="text"
                  value={priceNote}
                  onChange={(e) => {
                    setPriceNote(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Inclusive of stitching"
                  className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium">
                    Available Sizes (Interactive Storefront Buttons)
                  </label>
                  <span className="text-[10px] text-[#855D25] font-semibold uppercase">
                    Customer Selectable
                  </span>
                </div>

                <input
                  type="text"
                  value={sizes}
                  onChange={(e) => {
                    setSizes(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="e.g. XL, XXL or 36, 38, 40, 42"
                  className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] font-medium rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />

                {/* Quick Size Preset Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#8A796B] font-medium block">
                    Quick Preset Buttons (Click to toggle):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Free Size", "Unstitched", "XS", "S", "M", "L", "XL", "XXL", "3XL", "36", "38", "40", "42", "44"].map((preset) => {
                      const currentList = sizes
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      const isSelected = currentList.includes(preset);

                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            let updatedList: string[];
                            if (isSelected) {
                              updatedList = currentList.filter((s) => s !== preset);
                            } else {
                              updatedList = [...currentList, preset];
                            }
                            setSizes(updatedList.join(", "));
                            setIsDirty(true);
                          }}
                          className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded-xs border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[#6D1A2A] text-white border-[#6D1A2A]"
                              : "bg-white text-[#4A3E37] border-[#D9C4B0] hover:border-[#855D25] hover:bg-[#FAF5EE]"
                          }`}
                        >
                          {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Preview Tags */}
                {sizes.trim() && (
                  <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider text-[#8A796B]">
                      Storefront Preview:
                    </span>
                    {sizes
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((sz) => (
                        <span
                          key={sz}
                          className="px-2 py-0.5 bg-[#FAF5EE] border border-[#855D25]/40 text-[#855D25] text-[10.5px] font-bold rounded-xs font-mono"
                        >
                          {sz}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium">
                  Size Subtitle / Drapery Measurement (Optional)
                </label>
                <input
                  type="text"
                  value={size}
                  onChange={(e) => {
                    setSize(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="e.g. Free Size / Semi-Stitched (Bust 38 to 44 Inches)"
                  className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
                <span className="text-[10.5px] text-[#8A796B] leading-relaxed block">
                  Additional fitting guidance shown under poshak description or in specification table for patrons.
                </span>
              </div>
            </div>
          </div>

          {/* Storefront DETAILS Specification Box */}
          <div className="pt-4 border-t border-[#F0E5D8] space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#855D25]">
                Storefront &quot;DETAILS&quot; Specification Table
              </h3>
              <p className="text-[11px] text-[#6B5E55]">
                These 6 attributes populate the clean editorial table directly below the price on the product page.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-[#FCFAF6] border border-[#EBD9C8] rounded-sm">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                  1. Type (Storefront Detail)
                </label>
                <input
                  type="text"
                  disabled
                  value={type}
                  className="w-full px-3 py-2 bg-[#F3EBE1] border border-[#D9C4B0] text-xs text-[#4A3E37] rounded-sm cursor-not-allowed font-medium"
                />
                <span className="text-[10px] text-[#8A796B] mt-0.5 block">
                  Synchronized automatically with Product Type above.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                  2. Fabric *
                </label>
                <input
                  type="text"
                  required
                  value={fabric}
                  onChange={(e) => {
                    setFabric(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Pure Georgette & Satin Magji"
                  className="w-full px-3 py-2 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                  3. Quality
                </label>
                <input
                  type="text"
                  value={quality}
                  onChange={(e) => {
                    setQuality(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Pure Poshak"
                  className="w-full px-3 py-2 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                  4. Work (Embroidery / Craft) *
                </label>
                <input
                  type="text"
                  required
                  value={work || craft}
                  onChange={(e) => {
                    setWork(e.target.value);
                    setCraft(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Handcrafted Peacock Gotapatti, Kasab Zari & Dabka"
                  className="w-full px-3 py-2 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                  5. Odhna Detail
                </label>
                <input
                  type="text"
                  value={odhna}
                  onChange={(e) => {
                    setOdhna(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Four-side border with Gota Kiran"
                  className="w-full px-3 py-2 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                  6. Best For (Occasion)
                </label>
                <input
                  type="text"
                  value={bestFor}
                  onChange={(e) => {
                    setBestFor(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Bridal"
                  className="w-full px-3 py-2 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>
            </div>
          </div>

          {/* Color & Description */}
          <div className="pt-4 border-t border-[#F0E5D8] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                  Color Description *
                </label>
                <input
                  type="text"
                  required
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Gulabi Pink & Firozi Turquoise"
                  className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                  Sub-Category / Theme (Optional)
                </label>
                <input
                  type="text"
                  value={subCategory}
                  onChange={(e) => {
                    setSubCategory(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Bridal, Festive, Leheriya, etc."
                  className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Product Description *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="A majestic traditional Rajputi poshak featuring intricate Mor motifs..."
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Lists (Details & Includes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Details */}
          <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0E5D8]">
              <h2 className="text-sm font-serif text-[#171717]">
                Product Features / Details
              </h2>
              <button
                type="button"
                onClick={addDetail}
                className="text-xs text-[#855D25] hover:underline font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Line</span>
              </button>
            </div>

            <div className="space-y-2">
              {details.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-[#A09285] font-mono w-4">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => updateDetail(idx, e.target.value)}
                    placeholder="Signature Morbagh peacock medallions..."
                    className="flex-1 px-3 py-1.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm"
                  />
                  {details.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDetail(idx)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Includes */}
          <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0E5D8]">
              <h2 className="text-sm font-serif text-[#171717]">
                Ensemble Includes (Packaging)
              </h2>
              <button
                type="button"
                onClick={addInclude}
                className="text-xs text-[#855D25] hover:underline font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Line</span>
              </button>
            </div>

            <div className="space-y-2">
              {includes.map((inc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-[#A09285] font-mono w-4">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={inc}
                    onChange={(e) => updateInclude(idx, e.target.value)}
                    placeholder="Heavy Flared Morbagh Ghagra"
                    className="flex-1 px-3 py-1.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm"
                  />
                  {includes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInclude(idx)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Inventory, Stitching & Publishing */}
        <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-sm space-y-5">
          <h2 className="text-base font-serif text-[#171717] pb-2 border-b border-[#F0E5D8]">
            Inventory, Stitching Options & Publishing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Status */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e: any) => {
                  setStatus(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              >
                <option value="PUBLISHED">Published (Visible on Storefront)</option>
                <option value="DRAFT">Draft (Owner only)</option>
                <option value="ARCHIVED">Archived (Hidden from Store)</option>
              </select>
            </div>

            {/* Stock Count */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Available Units in Stock
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setStock(val);
                  setInStock(val > 0);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            {/* In Stock Toggle */}
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="inStockToggle"
                checked={inStock}
                onChange={(e) => {
                  setInStock(e.target.checked);
                  setIsDirty(true);
                }}
                className="w-4 h-4 text-[#6D1A2A] rounded border-[#D9C4B0] focus:ring-[#855D25]"
              />
              <label htmlFor="inStockToggle" className="text-xs text-[#171717] font-medium cursor-pointer">
                Allow orders (In Stock)
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0E5D8] grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Stitching Service Option */}
            <div className="p-4 bg-[#FCFAF6] border border-[#EBD9C8] rounded-sm space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stitchingToggle"
                  checked={stitchingAvailable}
                  onChange={(e) => {
                    setStitchingAvailable(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="w-4 h-4 text-[#6D1A2A] rounded border-[#D9C4B0] focus:ring-[#855D25]"
                />
                <label htmlFor="stitchingToggle" className="text-xs font-semibold text-[#171717] cursor-pointer">
                  Enable Bespoke Stitching Add-on for this Poshak
                </label>
              </div>

              {stitchingAvailable && (
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B5E55] font-medium mb-1">
                    Custom Stitching Charge (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stitchingPriceInRupees}
                    onChange={(e) => {
                      setStitchingPriceInRupees(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="2500"
                    className="w-full px-3 py-1.5 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                  />
                </div>
              )}
            </div>

            {/* Homepage Featured Selection */}
            <div className="p-4 bg-[#FCFAF6] border border-[#EBD9C8] rounded-sm space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={isFeatured}
                  onChange={(e) => {
                    setIsFeatured(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="w-4 h-4 text-[#6D1A2A] rounded border-[#D9C4B0] focus:ring-[#855D25]"
                />
                <label htmlFor="featuredToggle" className="text-xs font-semibold text-[#171717] cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#855D25]" />
                  <span>Feature in &quot;The Poshak Edit&quot; (Homepage)</span>
                </label>
              </div>

              {isFeatured && (
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B5E55] font-medium mb-1">
                    Display Order (1 = First, 2 = Second...)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={featuredOrder}
                    onChange={(e) => {
                      setFeaturedOrder(parseInt(e.target.value, 10) || 0);
                      setIsDirty(true);
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 border border-[#D9C4B0] text-xs uppercase tracking-wider font-medium text-[#4A3E37] hover:bg-[#F3EBE1] rounded-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#6D1A2A] hover:bg-[#551320] text-white text-xs uppercase tracking-wider font-medium shadow-sm rounded-sm transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEdit ? "Update Product" : "Publish to Catalog"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
