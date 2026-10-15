import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = Boolean(
  cloudName &&
    apiKey &&
    apiSecret &&
    apiKey !== "placeholder_api_key" &&
    apiSecret !== "placeholder_api_secret"
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export interface CloudinarySignedParams {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
}

/**
 * Generate a short-lived signature for direct, authenticated browser uploads.
 */
export function generateSignedUploadParams(
  folder: string = "rajwadi/products"
): CloudinarySignedParams {
  if (!isCloudinaryConfigured || !apiKey || !apiSecret || !cloudName) {
    throw new Error(
      "Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables."
    );
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    folder,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder,
  };
}

/**
 * Delete an image asset safely from Cloudinary.
 */
export async function deleteCloudinaryAsset(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured) {
    console.warn(
      `Cloudinary is not configured. Skipping remote deletion of asset: ${publicId}`
    );
    return false;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok" || result.result === "not found";
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset (${publicId}):`, error);
    return false;
  }
}

export { cloudinary };
