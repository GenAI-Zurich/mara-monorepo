import { X as XIcon, ClipboardList, Truck } from "lucide-react";
import type { Product } from "@/types/product";
import { getProductImage } from "@/lib/productImages";
import type { WishlistWithItems } from "@/hooks/useWishlists";
import type { ProjectWithItems } from "@/hooks/useProjects";
import WishlistFlag from "./WishlistFlag";
import AddToProjectPopover from "./AddToProjectPopover";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCardProps {
  product: Product;
  wishlists: WishlistWithItems[];
  projects: ProjectWithItems[];
  getProjectColor: (index: number) => string;
  isRejected: boolean;
  onToggleWishlist: (wishlistId: number, articleId: number, isIn: boolean) => void;
  onReject: (articleId: number) => void;
  onAddToProject: (projectId: number, articleId: number, qty: number) => void;
  onCreateProject: () => void;
  onRequestDelivery: (articleIds: number[]) => void;
  onClick: (product: Product) => void;
  style?: React.CSSProperties;
  isHero?: boolean;
}

const ProductCard = ({
  product, wishlists, projects, getProjectColor, isRejected,
  onToggleWishlist, onReject, onAddToProject, onCreateProject, onRequestDelivery,
  onClick, style, isHero,
}: ProductCardProps) => {
  const { t } = useLanguage();

  if (isRejected) return null;

  return (
    <div
      className="absolute cursor-pointer origin-center will-change-transform group"
      style={{
        width: 'var(--card-w)',
        height: 'var(--card-h)',
        ...style,
      }}
      onClick={() => onClick(product)}
    >
      <div className="w-full h-full rounded-md bg-card border border-border overflow-hidden hover:shadow-[0_32px_80px_rgba(0,0,0,0.3),0_0_0_1px_rgba(200,147,42,0.25)] dark:hover:shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(200,147,42,0.35)]">
        {/* Image */}
        <div className="w-full aspect-square overflow-hidden relative" style={{ background: 'var(--gradient-card-img)' }}>
          <img
            src={getProductImage(product)}
            alt={product.very_short_description_de}
            className={`w-full h-full object-contain transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.07] ${isHero ? '' : 'p-7'}`}
          />

          {/* Reject button */}
          <button
            onClick={e => { e.stopPropagation(); onReject(product.id); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/80 backdrop-blur-sm flex items-center justify-center text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-destructive"
            title={t('not_matching')}
          >
            <XIcon size={12} strokeWidth={3} />
          </button>
        </div>

        {/* Gold accent line */}
        <div className="h-[2px]" style={{ background: 'var(--gradient-gold)' }} />

        {/* Body */}
        <div className="px-4 pt-3.5 pb-2.5 flex flex-col gap-[3px]">
          <div className="text-[8.5px] tracking-[0.18em] uppercase text-gold font-medium">{product.article_number}</div>
          <div className="font-display text-lg font-light leading-[1.15] text-foreground">{product.very_short_description_de}</div>
          <div className="text-[10px] text-muted-foreground tracking-[0.04em]">{product.short_description_de}</div>
        </div>

        {/* Footer: wishlist flags + add to project + delivery */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-1">
          {/* Wishlist flags */}
          {wishlists.map(w => {
            const isIn = w.article_ids.includes(product.id);
            return (
              <button
                key={w.id}
                onClick={e => { e.stopPropagation(); onToggleWishlist(w.id, product.id, isIn); }}
                className="flex items-center justify-center w-7 h-7 rounded-full transition-all cursor-pointer hover:scale-110"
                title={w.name}
              >
                <WishlistFlag color={w.color} size={16} filled={isIn} />
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-1">
            {/* Delivery request */}
            <button
              onClick={e => { e.stopPropagation(); onRequestDelivery([product.id]); }}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary/80 border border-border text-muted-foreground hover:text-gold hover:border-gold transition-all cursor-pointer"
              title={t('request_delivery_date')}
            >
              <Truck size={12} />
            </button>

            {/* Add to project */}
            <AddToProjectPopover
              projects={projects}
              getProjectColor={getProjectColor}
              onAddToProject={(projId, qty) => onAddToProject(projId, product.id, qty)}
              onCreateProject={onCreateProject}
            >
              <button
                onClick={e => e.stopPropagation()}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-gold/10 text-gold hover:bg-gold/20 transition-all cursor-pointer"
                title={t('add_to_project_title')}
              >
                <ClipboardList size={12} />
              </button>
            </AddToProjectPopover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
