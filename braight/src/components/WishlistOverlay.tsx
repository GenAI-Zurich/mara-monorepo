import { useState, useEffect } from "react";
import { X, Pencil, Check, ClipboardList, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types/product";
import type { WishlistWithItems } from "@/hooks/useWishlists";
import type { ProjectWithItems } from "@/hooks/useProjects";
import { getProductImage } from "@/lib/productImages";
import { supabase } from "@/integrations/supabase/client";
import WishlistFlag from "./WishlistFlag";
import AddToProjectPopover from "./AddToProjectPopover";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WishlistOverlayProps {
  open: boolean;
  wishlist: WishlistWithItems | null;
  allWishlists: WishlistWithItems[];
  allProducts: Product[];
  projects: ProjectWithItems[];
  getProjectColor: (index: number) => string;
  onClose: () => void;
  onRemoveFromWishlist: (wishlistId: number, articleId: number) => void;
  onMoveToWishlist: (fromId: number, toId: number, articleId: number) => void;
  onAddToProject: (projectId: number, articleId: number, qty: number) => void;
  onCreateProject: () => void;
  onRename: (wishlistId: number, name: string) => void;
  onDelete: (wishlistId: number) => void;
  onRequestDelivery?: (articleIds: number[]) => void;
}

const ARTICLE_FIELDS = 'id, l_number, article_number, very_short_description_de, short_description_de, hero_image_url, price_sp_chf, price_pp_chf';

const WishlistOverlay = ({
  open, wishlist, allWishlists, allProducts, projects, getProjectColor,
  onClose, onRemoveFromWishlist, onMoveToWishlist, onAddToProject, onCreateProject,
  onRename, onDelete, onRequestDelivery,
}: WishlistOverlayProps) => {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    if (!open || !wishlist || wishlist.article_ids.length === 0) {
      setFetchedProducts([]);
      return;
    }
    const found: Product[] = [];
    const missing: number[] = [];
    for (const id of wishlist.article_ids) {
      const p = allProducts.find(ap => ap.id === id);
      if (p) found.push(p);
      else missing.push(id);
    }
    if (missing.length === 0) { setFetchedProducts(found); return; }
    supabase.from('articles').select(ARTICLE_FIELDS).in('id', missing).then(({ data }) => {
      const all = [...found, ...((data || []) as unknown as Product[])];
      const byId = new Map(all.map(p => [p.id, p]));
      setFetchedProducts(wishlist.article_ids.map(id => byId.get(id)).filter(Boolean) as Product[]);
    });
  }, [open, wishlist?.article_ids, allProducts]);

  if (!open || !wishlist) return null;

  const products = fetchedProducts;
  const otherLists = allWishlists.filter(w => w.id !== wishlist.id);

  const startEdit = () => { setNameValue(wishlist.name); setEditingName(true); };
  const saveEdit = () => { if (nameValue.trim()) onRename(wishlist.id, nameValue.trim()); setEditingName(false); };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[500] bg-black/[0.88] backdrop-blur-[10px] flex flex-col overflow-hidden font-sans"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {/* Header */}
        <div className="px-7 pt-6 pb-[18px] flex items-center justify-between border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <WishlistFlag color={wishlist.color} size={24} />
            <div>
              <div className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground mb-1">{t('wishlist')}</div>
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input autoFocus value={nameValue} onChange={e => setNameValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEdit()}
                    className="font-display text-[28px] font-light text-foreground bg-transparent border-b border-gold outline-none w-[300px]" />
                  <button onClick={saveEdit} className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold cursor-pointer">
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-[28px] font-light text-foreground">{wishlist.name}</h2>
                  <button onClick={startEdit} className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-gold cursor-pointer transition-colors">
                    <Pencil size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onRequestDelivery && products.length > 0 && (
              <button
                onClick={() => onRequestDelivery(wishlist.article_ids)}
                className="h-9 px-4 rounded-full bg-gold text-primary-foreground text-[10px] tracking-[0.1em] uppercase font-medium hover:bg-gold-light cursor-pointer flex items-center gap-2 transition-all"
              >
                <Truck size={13} /> {t('request_delivery_dates')}
              </button>
            )}
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-secondary border border-border cursor-pointer flex items-center justify-center text-muted-foreground transition-all hover:border-gold hover:text-foreground">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-7 py-6 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 content-start">
          {products.length === 0 ? (
            <div className="text-center text-muted-foreground font-display text-[22px] col-span-full m-auto p-12">
              {t('no_products_in_list')}
            </div>
          ) : (
            products.map(p => (
              <div key={p.id} className="bg-card border border-border rounded-[14px] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(200,147,42,0.2)]">
                <img src={getProductImage(p)} alt={p.very_short_description_de} className="w-full h-[180px] object-contain p-3.5 bg-secondary" />

                <div className="p-[10px_12px_12px]">
                  <div className="text-[9px] tracking-[0.13em] uppercase text-gold mb-[3px]">{p.article_number}</div>
                  <div className="font-display text-[17px] font-normal text-foreground mb-1">{p.very_short_description_de}</div>
                  <div className="text-[10px] text-muted-foreground mb-3">{p.short_description_de}</div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 mb-3">
                    {/* Delivery request */}
                    <button
                      onClick={() => onRequestDelivery?.([p.id])}
                      className="flex-1 h-7 rounded-full bg-secondary border border-border text-muted-foreground text-[9px] tracking-[0.08em] uppercase cursor-pointer hover:border-gold hover:text-gold flex items-center justify-center gap-1 transition-all"
                    >
                      <Truck size={10} /> {t('request_delivery_date')}
                    </button>

                    {/* Add to project */}
                    <AddToProjectPopover
                      projects={projects}
                      getProjectColor={getProjectColor}
                      onAddToProject={(projId, qty) => onAddToProject(projId, p.id, qty)}
                      onCreateProject={onCreateProject}
                    >
                      <button
                        className="w-7 h-7 rounded-full bg-gold/10 text-gold hover:bg-gold/20 flex items-center justify-center cursor-pointer transition-all"
                        title={t('add_to_project_title')}
                      >
                        <ClipboardList size={12} />
                      </button>
                    </AddToProjectPopover>
                  </div>

                  {/* Move + Remove row */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {otherLists.map(other => (
                      <button
                        key={other.id}
                        onClick={() => onMoveToWishlist(wishlist.id, other.id, p.id)}
                        className="w-7 h-7 rounded-full border border-border hover:border-current flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                        style={{ color: other.color }}
                        title={`${t('move_to')} ${other.name}`}
                      >
                        <WishlistFlag color={other.color} size={12} />
                      </button>
                    ))}

                    <button
                      onClick={() => onRemoveFromWishlist(wishlist.id, p.id)}
                      className="w-7 h-7 rounded-full border border-destructive/40 text-destructive/60 hover:border-destructive hover:text-destructive flex items-center justify-center cursor-pointer transition-all ml-auto"
                      title={t('remove')}
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Delete list button */}
        <button
          onClick={() => { onDelete(wishlist.id); onClose(); }}
          className="fixed bottom-6 right-6 z-[501] w-11 h-11 rounded-full border border-destructive/40 text-destructive/60 bg-transparent flex items-center justify-center cursor-pointer hover:border-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
          title={t('delete_list')}
        >
          <Trash2 size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default WishlistOverlay;
