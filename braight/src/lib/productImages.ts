import img1 from "@/assets/products/1.png";
import img2 from "@/assets/products/2.png";
import img3 from "@/assets/products/3.png";
import img4 from "@/assets/products/4.png";
import img5 from "@/assets/products/5.png";
import img6 from "@/assets/products/6.png";
import img7 from "@/assets/products/7.png";

export const productImageMap: Record<string, string> = {
  "1.png": img1,
  "2.png": img2,
  "3.png": img3,
  "4.png": img4,
  "5.png": img5,
  "6.png": img6,
  "7.png": img7,
};

const PLACEHOLDER = "/placeholder.svg";
const PIM_STORAGE_BASE = "https://xgjiulkqwqxprgvlzpld.supabase.co/storage/v1/object/public/pim/opt/LO/LOwebserver/";

export function getProductImage(product: { hero_storage_url?: string; hero_image_url?: string }): string {
  // Prefer storage URL from enriched data
  if (product.hero_storage_url) return product.hero_storage_url;
  // Fallback to local map
  if (product.hero_image_url && productImageMap[product.hero_image_url]) {
    return productImageMap[product.hero_image_url];
  }
  // Build full storage URL from relative path (e.g. "images/rend_xxx.png")
  if (product.hero_image_url) {
    if (product.hero_image_url.startsWith('http')) return product.hero_image_url;
    return `${PIM_STORAGE_BASE}${product.hero_image_url}`;
  }
  return PLACEHOLDER;
}
