"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Sparkles,
  Check,
  Tag,
  Scissors,
  Layers,
  Sparkle,
  DollarSign,
  Package,
  Eye,
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

const PRESET_CATEGORIES = [
  "Bridal",
  "Festive",
  "Everyday",
  "Jewellery",
  "Stitched",
  "Unstitched",
  "Traditional",
];

const PRESET_TYPES = [
  "Stitched",
  "Unstitched",
  "Semi-Stitched",
  "Jewellery",
];

const PRESET_SIZES = [
  "XL",
  "XXL",
  "L",
  "M",
  "S",
  "Free Size",
  "Semi-Stitched",
  "Unstitched",
];

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
  const router = useRouter();

  // Basic Information
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(isEdit));
  const [category, setCategory] = useState<string>(initialData?.category || "Bridal");
  const [customCategory, setCustomCategory] = useState("");
  const [subCategory, setSubCategory] = useState<string>(initialData?.subCategory || "");
  const [productType, setProductType] = useState<string>(
    initialData?.type || (initialData?.category === "Bridal" ? "Stitched" : "Stitched")
  );
  const [color, setColor] = useState(initialData?.color || "");

  // Pricing & Discounts
  const [priceInRupees, setPriceInRupees] = useState<string>(
    initialData?.priceInPaise !== undefined && initialData?.priceInPaise !== null
      ? (initialData.priceInPaise / 100).toString()
      : initialData?.price
      ? initialData.price.replace(/[^0-9]/g, "")
      : ""
  );
  const [compareAtPriceInRupees, setCompareAtPriceInRupees] = useState<string>(
    initialData?.compareAtPriceInPaise
      ? (initialData.compareAtPriceInPaise / 100).toString()
      : initialData?.originalPrice
      ? initialData.originalPrice.replace(/[^0-9]/g, "")
      : ""
  );
  const [priceNote, setPriceNote] = useState<string>(
    initialData?.priceNote || "Inclusive of stitching"
  );

  // Royal Specifications (Details Table)
  const [fabric, setFabric] = useState(initialData?.fabric || "");
  const [craft, setCraft] = useState(initialData?.craft || "");
  const [work, setWork] = useState(initialData?.work || initialData?.craft || "");
  const [quality, setQuality] = useState(initialData?.quality || "Pure Poshak");
  const [odhna, setOdhna] = useState(
    initialData?.odhna || "Four-side border with Gota Kiran"
  );
  const [bestFor, setBestFor] = useState(
    initialData?.bestFor || initialData?.subCategory || initialData?.category || "Bridal"
  );

  // Sizes
  const [sizes, setSizes] = useState<string[]>(() => {
    if (Array.isArray(initialData?.sizes) && initialData.sizes.length > 0) {
      return initialData.sizes;
    }
    if (typeof initialData?.size === "string" && initialData.size.trim()) {
      return initialData.size.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    return ["XL", "XXL"];
  });
  const [customSizeInput, setCustomSizeInput] = useState("");

  // Description & Feature Lists
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

  // Inventory & Publishing
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(
    initialData?.status || "PUBLISHED"
  );
  const [stock, setStock] = useState<number>(initialData?.stock ?? 10);
  const [inStock, setInStock] = useState<boolean>(initialData?.inStock ?? true);
  const [soldOut, setSoldOut] = useState<boolean>(initialData?.soldOut ?? false);
  const [stitchingAvailable, setStitchingAvailable] = useState<boolean>(
    initialData?.stitchingAvailable ?? false
  );
  const [stitchingPriceInRupees, setStitchingPriceInRupees] = useState<string>(
    initialData?.stitchingPriceInPaise
      ? (initialData.stitchingPriceInPaise / 100).toString()
      : "2500"
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.isFeatured ?? false);
  const [featuredOrder, setFeaturedOrder] = useState<number>(
    initialData?.featuredOrder ?? 0
  );

  // Media & Viewport Alignment
  const [imagePosition, setImagePosition] = useState<string>(
    initialData?.imagePosition || "center 5%"
  );
  const [imageScale, setImageScale] = useState<number>(initialData?.imageScale ?? 1.0);
  const [version, setVersion] = useState<number>(initialData?.version ?? 1);

  // Images list
  const [images, setImages] = useState<ProductImageItem[]>(() => {
    if (initialData?.images && Array.isArray(initialData.images) && initialData.images.length > 0) {
      return initialData.images.map((img: any, idx: number) => ({
        id: img.id,
        publicId: img.publicId,
        secureUrl: img.secureUrl || img.url || img,
        displayOrder: img.displayOrder ?? idx,
      }));
    }
    if (initialData?.image) {
      const all = [initialData.image, ...(initialData.additionalImages || [])].filter(Boolean);
      return all.map((url: string, idx: number) => ({
        secureUrl: url,
        displayOrder: idx,
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

  // Live discount preview calculation
  const discountMetrics = useMemo(() => {
    const price = parseFloat(priceInRupees);
    const compare = parseFloat(compareAtPriceInRupees);
    if (!isNaN(price) && !isNaN(compare) && compare > price && compare > 0) {
      const percent = Math.round(((compare - price) / compare) * 100);
      const savings = compare - price;
      return { percent, savings };
    }
    return null;
  }, [priceInRupees, compareAtPriceInRupees]);

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

  // Prevent accidental page leave
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
          throw new Error(
            errData.error?.message || "Failed to upload image to Cloudinary"
          );
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
      prev
        .filter((_, idx) => idx !== index)
        .map((img, idx) => ({ ...img, displayOrder: idx }))
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

  // Size helpers
  const toggleSize = (sz: string) => {
    setSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
    setIsDirty(true);
  };

  const handleAddCustomSize = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customSizeInput.trim()) {
      e.preventDefault();
      const val = customSizeInput.trim().toUpperCase();
      if (!sizes.includes(val)) {
        setSizes((prev) => [...prev, val]);
      }
      setCustomSizeInput("");
      setIsDirty(true);
    }
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
    if (isNaN(parsedPrice) || parsedPrice < 0) {
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

    if (status === "PUBLISHED" && images.length === 0) {
      setError("A published product must have at least one image.");
      return;
    }

    const finalCategory =
      category === "Custom" && customCategory.trim()
        ? customCategory.trim()
        : category;

    const payload: ProductFormValues = {
      name: name.trim(),
      slug: slug.trim(),
      category: finalCategory,
      subCategory: subCategory.trim() || undefined,
      type: productType.trim() || undefined,
      priceInPaise,
      compareAtPriceInPaise,
      priceNote: priceNote.trim() || undefined,
      fabric: fabric.trim() || "Pure Georgette & Satin Magji",
      craft: craft.trim() || "Handcrafted Gotapatti & Zari Bel",
      work: work.trim() || craft.trim() || undefined,
      quality: quality.trim() || "Pure Poshak",
      odhna: odhna.trim() || "Four-side border with Gota Kiran",
      bestFor: bestFor.trim() || finalCategory,
      size: sizes.join(", "),
      sizes,
      color: color.trim(),
      description: description.trim() || name.trim(),
      details: filteredDetails.length > 0 ? filteredDetails : ["Signature royal Rajputi craftsmanship"],
      includes: filteredIncludes.length > 0 ? filteredIncludes : ["Flared Kalidar Ghagra", "Tailored Kurti & Kanchali", "Pure Odhani with Kiran"],
      status,
      soldOut,
      stock,
      inStock: !soldOut && inStock && stock > 0,
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
        isEdit
          ? "Royal poshak changes saved successfully!"
          : "Royal poshak created successfully!"
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
    <div className="max-w-6xl mx-auto space-y-6 pb-20 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#EBD9C8] sticky top-0 bg-[#FAF6F0]/95 backdrop-blur-md z-30 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 text-[#4A3E37] hover:text-[#6D1A2A] hover:bg-[#F3EBE1] rounded-sm transition-colors"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#855D25] font-semibold block">
              {isEdit ? "EDIT ROYAL POSHAK" : "CREATE NEW POSHAK"}
            </span>
            <h1 className="text-xl sm:text-2xl font-serif text-[#171717]">
              {isEdit ? `Edit: ${name || initialData?.name}` : "Add New Catalog Creation"}
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
          {isEdit && slug && (
            <Link
              href={`/product/${slug}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 border border-[#855D25]/40 text-xs uppercase tracking-wider font-medium text-[#855D25] hover:bg-[#855D25]/10 rounded-sm transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </Link>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-[#6D1A2A] hover:bg-[#551320] text-white text-xs uppercase tracking-wider font-semibold shadow-xs rounded-sm transition-colors disabled:opacity-50 cursor-pointer"
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

      {/* Notifications */}
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

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* ================= SECTION 1: PRODUCT IMAGERY ================= */}
        <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E5D8]">
            <div>
              <h2 className="text-base font-serif text-[#171717] flex items-center gap-2">
                <span>Product Imagery</span>
                <span className="text-xs font-sans text-[#855D25] font-normal">
                  ({images.length} photos)
                </span>
              </h2>
              <p className="text-xs text-[#6B5E55] mt-0.5">
                First image serves as the main storefront cover. Re-order or set cover as needed.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="text-xs text-[#855D25] hover:underline font-medium cursor-pointer"
            >
              + Add Image by URL
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
              <Upload className="w-7 h-7 text-[#855D25] mb-2" />
              <p className="text-xs font-medium text-[#171717]">
                {isUploading
                  ? uploadProgress
                  : "Click or drag images to upload to Cloudinary"}
              </p>
              <p className="text-[11px] text-[#A09285] mt-0.5">
                Supports JPG, PNG, WebP (up to 10MB each)
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
                      sizes="180px"
                    />
                    {index === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-[#6D1A2A] text-white text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded shadow">
                        Cover View
                      </span>
                    )}
                  </div>

                  <div className="p-1.5 bg-white border-t border-[#EBD9C8] flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveImage(index, "up")}
                        className="p-1 text-[#4A3E37] hover:text-[#6D1A2A] disabled:opacity-30 cursor-pointer"
                        title="Move left/up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === images.length - 1}
                        onClick={() => moveImage(index, "down")}
                        className="p-1 text-[#4A3E37] hover:text-[#6D1A2A] disabled:opacity-30 cursor-pointer"
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
                          className="text-[10px] text-[#855D25] hover:underline font-medium cursor-pointer"
                          title="Make cover"
                        >
                          Make Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
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

          {/* Alignment & Zoom Controls */}
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
                Controls drapery focus (e.g. &quot;center 5%&quot; or &quot;center 2%&quot;).
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

        {/* ================= SECTION 2: BASIC INFO & CATEGORIZATION ================= */}
        <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-xs space-y-5">
          <h2 className="text-base font-serif text-[#171717] pb-2 border-b border-[#F0E5D8] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#855D25]" />
            <span>Basic Information & Classification</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Morbagh Rajputi Poshak"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            {/* Slug */}
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

            {/* Category */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Primary Category *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              >
                {PRESET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Custom">+ Custom Category...</option>
              </select>

              {category === "Custom" && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Enter custom category"
                  className="w-full mt-2 px-3 py-1.5 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm"
                />
              )}
            </div>

            {/* Sub Category */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Sub Category
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => {
                  setSubCategory(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Bridal / Festive / Royal Heritage"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Product Type
              </label>
              <select
                value={productType}
                onChange={(e) => {
                  setProductType(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              >
                {PRESET_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Color Palette & Combinations *
              </label>
              <input
                type="text"
                required
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Gulabi Pink & Firozi Turquoise, Heritage Maroon & Gold"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: PRICING, DISCOUNTS & NOTES ================= */}
        <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#F0E5D8]">
            <h2 className="text-base font-serif text-[#171717] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#855D25]" />
              <span>Pricing & Discounts</span>
            </h2>

            {discountMetrics && (
              <div className="flex items-center gap-2 bg-[#6D1A2A]/10 border border-[#6D1A2A]/25 px-3 py-1 rounded-xs">
                <span className="text-xs font-semibold text-[#6D1A2A]">
                  {discountMetrics.percent}% OFF
                </span>
                <span className="text-[11px] text-[#2E5A36] font-medium">
                  (Customer saves ₹{discountMetrics.savings.toLocaleString("en-IN")})
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Sale Price */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Selling Price in INR (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                value={priceInRupees}
                onChange={(e) => {
                  setPriceInRupees(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="7594"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] font-semibold rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
              <span className="text-[10px] text-[#8A796B] mt-0.5 block">
                Stored in paise: {priceInRupees ? parseInt(priceInRupees, 10) * 100 : 0} paise
              </span>
            </div>

            {/* Compare At Price (Original / Strikethrough) */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Original MRP / Compare Price in INR (₹)
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
              <span className="text-[10.5px] text-[#8A796B] mt-0.5 block">
                Creates strikethrough price and automatic discount badge.
              </span>
            </div>

            {/* Price Note */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Price Note / Subtitle
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
        </div>

        {/* ================= SECTION 4: ROYAL DETAILS SPECIFICATIONS ================= */}
        <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-xs space-y-5">
          <div className="pb-2 border-b border-[#F0E5D8]">
            <h2 className="text-base font-serif text-[#171717] flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-[#855D25]" />
              <span>Royal Details Specifications (Storefront DETAILS Table)</span>
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              These fields power the horizontal bordered DETAILS table and SIZE selector shown on the product detail page.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Fabric */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Fabric Material *
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
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            {/* Quality */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Quality Grade
              </label>
              <input
                type="text"
                value={quality}
                onChange={(e) => {
                  setQuality(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Pure Poshak / Hamrahi Pure / Semi Pure"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            {/* Work */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Work / Craftsmanship
              </label>
              <input
                type="text"
                value={work}
                onChange={(e) => {
                  setWork(e.target.value);
                  setCraft(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Handcrafted Peacock Gotapatti, Kasab Zari & Dabka"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            {/* Odhna */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Odhna Details
              </label>
              <input
                type="text"
                value={odhna}
                onChange={(e) => {
                  setOdhna(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Four-side border with Gota Kiran"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            {/* Best For */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Best For (Occasion)
              </label>
              <input
                type="text"
                value={bestFor}
                onChange={(e) => {
                  setBestFor(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Bridal / Festive / Wedding Ceremonies"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            {/* Craft summary (alias) */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Craft Tagline
              </label>
              <input
                type="text"
                value={craft}
                onChange={(e) => {
                  setCraft(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="Danka, Marodi & Zardozi Handwork"
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>
          </div>

          {/* Size Options Selector */}
          <div className="pt-3 border-t border-[#F0E5D8]">
            <label className="block text-xs uppercase tracking-wider text-[#171717] font-semibold mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#855D25]" />
              <span>Available Sizes (Square Storefront Options)</span>
            </label>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {PRESET_SIZES.map((sz) => {
                const isSelected = sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border rounded-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#6D1A2A] text-white border-[#6D1A2A]"
                        : "bg-white text-[#171717] border-[#D9C4B0] hover:border-[#855D25]"
                    }`}
                  >
                    {isSelected ? `✓ ${sz}` : `+ ${sz}`}
                  </button>
                );
              })}
            </div>

            {/* Active sizes chips & custom entry */}
            <div className="flex items-center gap-2 flex-wrap bg-[#FCFAF6] border border-[#D9C4B0] p-2.5 rounded-sm">
              {sizes.map((sz) => (
                <span
                  key={sz}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E6DCB8] text-xs font-semibold text-[#171717] rounded-xs shadow-2xs"
                >
                  <span>{sz}</span>
                  <button
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                onKeyDown={handleAddCustomSize}
                placeholder="Type custom size and press Enter (e.g. 38, 40)..."
                className="flex-1 min-w-[200px] text-xs bg-transparent border-none outline-none text-[#171717]"
              />
            </div>
          </div>
        </div>

        {/* ================= SECTION 5: DESCRIPTION & BULLET LISTS ================= */}
        <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-xs space-y-5">
          <h2 className="text-base font-serif text-[#171717] pb-2 border-b border-[#F0E5D8] flex items-center gap-2">
            <Package className="w-4 h-4 text-[#855D25]" />
            <span>Description & Feature Accordions</span>
          </h2>

          {/* Short Description */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
              Storefront Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setIsDirty(true);
              }}
              placeholder="A majestic traditional Rajputi poshak featuring pure peacock gotapatti motifs with 6.5 meter gher..."
              className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Details Bullet List */}
            <div className="p-4 bg-[#FCFAF6] border border-[#EBD9C8] rounded-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E5D8]">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[#171717]">
                  Artisanal Details & Motifs
                </h3>
                <button
                  type="button"
                  onClick={addDetail}
                  className="text-xs text-[#855D25] hover:underline font-medium flex items-center gap-1 cursor-pointer"
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
                      placeholder="Signature Morbagh peacock medallions in gotapatti..."
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm"
                    />
                    {details.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDetail(idx)}
                        className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Includes Bullet List */}
            <div className="p-4 bg-[#FCFAF6] border border-[#EBD9C8] rounded-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E5D8]">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[#171717]">
                  Ensemble Includes (Package Contents)
                </h3>
                <button
                  type="button"
                  onClick={addInclude}
                  className="text-xs text-[#855D25] hover:underline font-medium flex items-center gap-1 cursor-pointer"
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
                      placeholder="Heavy Flared Morbagh Ghagra..."
                      className="flex-1 px-3 py-1.5 bg-white border border-[#D9C4B0] text-xs text-[#171717] rounded-sm"
                    />
                    {includes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInclude(idx)}
                        className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 6: INVENTORY, STITCHING & VISIBILITY ================= */}
        <div className="bg-white p-6 border border-[#EBD9C8] rounded-sm shadow-xs space-y-5">
          <h2 className="text-base font-serif text-[#171717] pb-2 border-b border-[#F0E5D8]">
            Inventory, Tailoring Options & Storefront Visibility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                <option value="PUBLISHED">Published (Visible on Store)</option>
                <option value="DRAFT">Draft (Admin Only)</option>
                <option value="ARCHIVED">Archived (Hidden)</option>
              </select>
            </div>

            {/* Stock Count */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#171717] font-medium mb-1">
                Available Stock Units
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setStock(val);
                  setInStock(val > 0 && !soldOut);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-2 bg-[#FCFAF6] border border-[#D9C4B0] text-xs text-[#171717] rounded-sm focus:ring-1 focus:ring-[#855D25]"
              />
            </div>

            {/* In Stock Toggle */}
            <div className="flex items-center gap-2 sm:pt-6">
              <input
                type="checkbox"
                id="inStockToggle"
                checked={inStock && !soldOut}
                onChange={(e) => {
                  setInStock(e.target.checked);
                  if (e.target.checked) setSoldOut(false);
                  setIsDirty(true);
                }}
                className="w-4 h-4 text-[#6D1A2A] rounded border-[#D9C4B0] focus:ring-[#855D25]"
              />
              <label htmlFor="inStockToggle" className="text-xs text-[#171717] font-medium cursor-pointer">
                In Stock (Allow Orders)
              </label>
            </div>

            {/* Sold Out Toggle */}
            <div className="flex items-center gap-2 sm:pt-6">
              <input
                type="checkbox"
                id="soldOutToggle"
                checked={soldOut}
                onChange={(e) => {
                  setSoldOut(e.target.checked);
                  if (e.target.checked) setInStock(false);
                  setIsDirty(true);
                }}
                className="w-4 h-4 text-[#6D1A2A] rounded border-[#D9C4B0] focus:ring-[#855D25]"
              />
              <label htmlFor="soldOutToggle" className="text-xs text-[#6D1A2A] font-semibold cursor-pointer">
                Mark as Sold Out
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0E5D8] grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tailoring Toggle */}
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
                <label htmlFor="stitchingToggle" className="text-xs font-semibold text-[#171717] cursor-pointer flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-[#855D25]" />
                  <span>Enable Custom Tailoring Service Add-on</span>
                </label>
              </div>

              {stitchingAvailable && (
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B5E55] font-medium mb-1">
                    Custom Tailoring Charge in INR (₹)
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

            {/* Featured Selection */}
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
                  <span>Feature in Homepage Highlights (&quot;The Poshak Edit&quot;)</span>
                </label>
              </div>

              {isFeatured && (
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#6B5E55] font-medium mb-1">
                    Display Priority Order (1 = Top priority)
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

        {/* Footer Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 border border-[#D9C4B0] text-xs uppercase tracking-wider font-medium text-[#4A3E37] hover:bg-[#F3EBE1] rounded-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-7 py-2.5 bg-[#6D1A2A] hover:bg-[#551320] text-white text-xs uppercase tracking-wider font-semibold shadow-xs rounded-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEdit ? "Update Royal Poshak" : "Publish to Catalog"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
