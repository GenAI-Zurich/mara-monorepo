import { X } from "lucide-react";
import type { Product } from "@/types/product";
import { getProductImage } from "@/lib/productImages";

interface SavedOverlayProps {
  open: boolean;
  products: Product[];
  onClose: () => void;
  onRemove: (id: number) => void;
}

const SavedOverlay = ({ open, products, onClose, onRemove }: SavedOverlayProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-black/[0.88] backdrop-blur-[10px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-7 pt-6 pb-[18px] flex items-center justify-between border-b border-border flex-shrink-0">
        <div>
          <div className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground mb-1">Merkzettel</div>
          <h2 className="font-display text-[28px] font-light text-foreground">Gemerkte Produkte</h2>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-secondary border border-border cursor-pointer flex items-center justify-center text-muted-foreground transition-all hover:border-gold hover:text-foreground"
        >
          <X size={18} />
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-7 py-6 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 content-start">
        {products.length === 0 ? (
          <div className="text-center text-muted-foreground font-display text-[22px] col-span-full m-auto p-12">
            Noch keine Produkte gemerkt
          </div>
        ) : (
          products.map(p => (
            <div key={p.id} className="bg-card border border-border rounded-[14px] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(200,147,42,0.2)]">
              <img src={getProductImage(p)} alt={p.very_short_description_de} className="w-full h-[130px] object-contain p-3.5 bg-secondary" />
              <div className="p-[10px_12px_12px]">
                <div className="text-[9px] tracking-[0.13em] uppercase text-gold mb-[3px]">{p.article_number}</div>
                <div className="font-display text-[17px] font-normal text-foreground mb-1">{p.very_short_description_de}</div>
                <div className="text-[10px] text-muted-foreground">{p.short_description_de}</div>
                <button
                  onClick={() => onRemove(p.id)}
                  className="mt-2.5 text-[10px] tracking-[0.1em] uppercase bg-transparent border border-border rounded-md px-2.5 py-1 cursor-pointer text-muted-foreground transition-all hover:border-gold hover:text-foreground"
                >
                  Entfernen
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedOverlay;
