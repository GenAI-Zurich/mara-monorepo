import type { Product } from "@/types/product";
import { getProductImage } from "@/lib/productImages";

interface MobileProductsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const MobileProducts = ({ products, onProductClick }: MobileProductsProps) => {
  if (products.length === 0) return null;

  return (
    <div className="hidden max-[820px]:block fixed bottom-[240px] left-0 right-0 overflow-x-auto px-4">
      <div className="flex gap-3 pb-2">
        {products.map(p => (
          <div
            key={p.id}
            className="flex-shrink-0 w-[150px] bg-card border border-border rounded-xl overflow-hidden cursor-pointer"
            onClick={() => onProductClick(p)}
          >
            <img src={getProductImage(p)} alt={p.very_short_description_de} className="w-full h-[100px] object-contain p-2.5 bg-secondary" />
            <div className="p-[8px_10px]">
              <div className="text-[9px] tracking-[0.1em] uppercase text-gold">{p.article_number}</div>
              <div className="font-display text-sm text-foreground">{p.very_short_description_de}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileProducts;
