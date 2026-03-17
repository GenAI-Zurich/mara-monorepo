import { X, Minus, Plus, Trash2, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";

export interface CartItem {
  article_id: number;
  quantity: number;
  product?: Product;
}

interface CartOverlayProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (articleId: number, quantity: number) => void;
  onRemove: (articleId: number) => void;
  onCheckout: () => void;
}

const CartOverlay = ({ open, items, onClose, onUpdateQuantity, onRemove, onCheckout }: CartOverlayProps) => {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[460] flex items-center justify-center bg-background/60 backdrop-blur-[18px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-[min(520px,92vw)] max-h-[80vh] bg-card border border-border rounded-lg overflow-hidden shadow-[var(--shadow-deep)] flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="h-[2px]" style={{ background: "var(--gradient-gold)" }} />

            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-border">
              <h2 className="font-display text-xl font-light text-foreground">
                {t('project_list')} <span className="text-muted-foreground text-[13px]">({totalItems})</span>
              </h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <p className="text-[13px] text-muted-foreground text-center py-8">{t('no_products_added')}</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map(item => (
                    <div key={item.article_id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] tracking-[0.15em] uppercase text-gold font-medium">
                          {item.product?.article_number}
                        </div>
                        <div className="text-[13px] text-foreground truncate">
                          {item.product?.very_short_description_de || `Artikel #${item.article_id}`}
                        </div>
                        {item.product?.price_sp_chf && (
                          <div className="text-[11px] text-muted-foreground">
                            CHF {item.product.price_sp_chf}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => onUpdateQuantity(item.article_id, Math.max(1, item.quantity - 1))} className="w-6 h-6 rounded bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                          <Minus size={12} />
                        </button>
                        <span className="text-[13px] text-foreground w-6 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.article_id, item.quantity + 1)} className="w-6 h-6 rounded bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button onClick={() => onRemove(item.article_id)} className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors cursor-pointer">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-border">
                <button
                  onClick={onCheckout}
                  className="w-full h-10 rounded-md bg-gold text-primary-foreground text-[12px] tracking-[0.1em] uppercase font-medium transition-all hover:bg-gold-light flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ClipboardList size={14} />
                  {t('request_delivery_times')}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartOverlay;
