import { useState, useEffect } from "react";
import { X, Pencil, Check, Minus, Plus, Trash2, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types/product";
import type { ProjectWithItems } from "@/hooks/useProjects";
import { getProductImage } from "@/lib/productImages";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectOverlayProps {
  open: boolean;
  project: ProjectWithItems | null;
  color: string;
  allProducts: Product[];
  onClose: () => void;
  onRename: (projectId: number, name: string) => void;
  onDelete: (projectId: number) => void;
  onUpdateQuantity: (itemId: number, qty: number) => void;
  onRemoveItem: (itemId: number) => void;
  onSubmit: (projectId: number) => void;
}

const ARTICLE_FIELDS = 'id, l_number, article_number, very_short_description_de, short_description_de, hero_image_url, price_sp_chf, price_pp_chf';

const ProjectOverlay = ({
  open, project, color, allProducts, onClose,
  onRename, onDelete, onUpdateQuantity, onRemoveItem, onSubmit,
}: ProjectOverlayProps) => {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState<Map<number, Product>>(new Map());
  const { t } = useLanguage();

  useEffect(() => {
    if (!open || !project || project.items.length === 0) { setFetchedProducts(new Map()); return; }
    const ids = project.items.map(i => i.article_id);
    const found = new Map<number, Product>();
    const missing: number[] = [];
    for (const id of ids) {
      const p = allProducts.find(ap => ap.id === id);
      if (p) found.set(id, p);
      else missing.push(id);
    }
    if (missing.length === 0) { setFetchedProducts(found); return; }
    supabase.from('articles').select(ARTICLE_FIELDS).in('id', missing).then(({ data }) => {
      for (const d of (data || []) as unknown as Product[]) found.set(d.id, d);
      setFetchedProducts(new Map(found));
    });
  }, [open, project?.items, allProducts]);

  if (!open || !project) return null;

  const startEdit = () => { setNameValue(project.project_name); setEditingName(true); };
  const saveEdit = () => { if (nameValue.trim()) onRename(project.id, nameValue.trim()); setEditingName(false); };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[500] bg-black/[0.88] backdrop-blur-[10px] flex flex-col overflow-hidden font-sans"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {/* Header */}
        <div className="px-7 pt-6 pb-[18px] flex items-center justify-between border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: color, backgroundColor: color + '33' }} />
            <div>
              <div className="text-[10px] tracking-[0.16em] uppercase text-muted-foreground mb-1">{t('order_list')}</div>
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
                  <h2 className="font-display text-[28px] font-light text-foreground">{project.project_name}</h2>
                  <button onClick={startEdit} className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-gold cursor-pointer transition-colors">
                    <Pencil size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {project.items.length > 0 && (
              <button
                onClick={() => { onSubmit(project.id); onClose(); }}
                className="h-9 px-5 rounded-full bg-gold text-primary-foreground text-[10px] tracking-[0.1em] uppercase font-medium hover:bg-gold-light cursor-pointer flex items-center gap-2 transition-all"
              >
                <Truck size={13} /> {t('order')}
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
          {project.items.length === 0 ? (
            <div className="text-center text-muted-foreground font-display text-[22px] col-span-full m-auto p-12">
              {t('no_products_in_order_list')}
            </div>
          ) : (
            project.items.map(item => {
              const p = fetchedProducts.get(item.article_id);
              if (!p) return null;
              return (
                <div key={item.id} className="bg-card border border-border rounded-[14px] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(200,147,42,0.2)]">
                  <img src={getProductImage(p)} alt={p.very_short_description_de} className="w-full h-[180px] object-contain p-3.5 bg-secondary" />
                  <div className="p-[10px_12px_12px]">
                    <div className="text-[9px] tracking-[0.13em] uppercase text-gold mb-[3px]">{p.article_number}</div>
                    <div className="font-display text-[17px] font-normal text-foreground mb-1">{p.very_short_description_de}</div>
                    <div className="text-[10px] text-muted-foreground mb-3">{p.short_description_de}</div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        <Minus size={11} />
                      </button>
                      <input
                        type="number" min={1} value={item.quantity}
                        onChange={e => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-10 h-7 text-center text-[12px] text-foreground bg-secondary border border-border rounded-md outline-none focus:border-gold font-sans [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        <Plus size={11} />
                      </button>
                      {p.price_sp_chf && (
                        <span className="text-[10px] text-muted-foreground ml-auto">CHF {p.price_sp_chf}</span>
                      )}
                    </div>

                    {/* Remove */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="w-7 h-7 rounded-full border border-destructive/40 text-destructive/60 hover:border-destructive hover:text-destructive flex items-center justify-center cursor-pointer transition-all"
                        title={t('remove')}
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Delete project button */}
        <button
          onClick={() => { onDelete(project.id); onClose(); }}
          className="fixed bottom-6 right-6 z-[501] w-11 h-11 rounded-full border border-destructive/40 text-destructive/60 bg-transparent flex items-center justify-center cursor-pointer hover:border-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
          title={t('delete_order_list')}
        >
          <Trash2 size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectOverlay;
