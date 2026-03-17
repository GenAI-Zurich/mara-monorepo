import { Bookmark, X, Download, FileText, Lightbulb, Wrench, PenTool, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { getProductImage } from "@/lib/productImages";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductDetailProps {
  product: Product | null;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

const ProductDetail = ({ product, isSaved, onToggleSave, onClose, onAddToCart }: ProductDetailProps) => {
  const { t } = useLanguage();

  if (!product) return null;

  const tp = product.technical_profile;
  const cp = product.character_profile;
  const cl = product.classification;

  const specs: { label: string; value: string }[] = [];
  if (tp?.electrical_power) specs.push({ label: t('power'), value: `${tp.electrical_power} W` });
  if (cp?.cri) specs.push({ label: 'CRI', value: `≥${cp.cri}` });
  if (cp?.efficiency) specs.push({ label: t('efficiency'), value: `${cp.efficiency} lm/W` });
  if (cp?.light_output) specs.push({ label: t('luminous_flux'), value: `${cp.light_output} lm` });
  if (tp?.ip_rating) specs.push({ label: 'IP', value: `IP${tp.ip_rating}` });
  if (tp?.ik_rating) specs.push({ label: 'IK', value: `IK${String(tp.ik_rating).padStart(2, '0')}` });
  if (tp?.length && tp?.width) specs.push({ label: t('dimensions'), value: `${tp.length}×${tp.width}${tp.height ? `×${tp.height}` : ''} mm` });
  if (tp?.weight) specs.push({ label: t('weight'), value: `${tp.weight} g` });
  if (tp?.protection_class) specs.push({ label: t('protection_class'), value: `${tp.protection_class}` });
  if (cp?.direct_ugr) specs.push({ label: 'UGR', value: `≤${cp.direct_ugr}` });
  if (cp?.hour) specs.push({ label: t('lifespan'), value: `${cp.hour}h` });
  if (cp?.direct_beam_angle_one) specs.push({ label: t('beam_angle'), value: `${cp.direct_beam_angle_one}°` });

  const controls: string[] = [];
  if (cp?.controls_dali) controls.push('DALI');
  if (cp?.controls_bluetooth) controls.push('Bluetooth');
  if (cp?.controls_on_off) controls.push('On/Off');
  if (cp?.controls_phase_section) controls.push(t('phase_cut'));
  if (cp?.controls_one_ten_v) controls.push('1-10V');
  if (cp?.controls_touch_dim) controls.push('TouchDim');

  const tags: string[] = [];
  if (cl?.inside) tags.push(t('indoor'));
  if (cl?.outside) tags.push(t('outdoor'));
  if (product.light_family?.name_de) tags.push(product.light_family.name_de);
  if (product.light_category?.name_de) tags.push(product.light_category.name_de);
  if (product.manufacturer?.man_name) tags.push(product.manufacturer.man_name);

  const hasDocuments = (product.datasheets?.length || 0) + (product.light_diagrams?.length || 0) + (product.mounting_instructions?.length || 0) + (product.drawings?.length || 0) > 0;

  return (
    <div
      className={`fixed inset-0 z-[450] flex items-center justify-center transition-all duration-[350ms] ${
        product ? 'opacity-100 pointer-events-auto bg-black/[0.78] backdrop-blur-[18px] saturate-50' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className="w-[min(960px,94vw)] max-h-[90vh] bg-card border border-border rounded-[10px] grid grid-cols-2 overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.7)] transition-transform duration-[380ms] ease-[cubic-bezier(0.34,1.3,0.64,1)] max-[620px]:grid-cols-1"
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <div className="flex items-center justify-center min-h-[420px] max-[620px]:min-h-[220px] overflow-hidden relative" style={{ background: 'var(--gradient-card-img)' }}>
          <img src={getProductImage(product)} alt={product.very_short_description_de} className="w-[90%] h-[90%] object-contain p-8" />
          {product.media && product.media.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 flex gap-1.5 overflow-x-auto">
              {product.media.filter(m => ['jpg', 'jpeg', 'png', 'webp'].includes(m.media_type || '')).slice(0, 6).map((m, i) => (
                <img key={i} src={m.storage_url} alt="" className="w-[48px] h-[48px] rounded object-cover border border-border bg-secondary flex-shrink-0" />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-[36px_32px] max-[620px]:p-[24px_20px] flex flex-col gap-4 overflow-y-auto">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] tracking-[0.22em] uppercase text-gold font-medium">{product.article_number}</span>
              <span className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground">L{product.l_number}</span>
            </div>
            <h2 className="font-display font-light leading-[1.1] text-foreground mb-2" style={{ fontSize: 'clamp(24px, 2.8vw, 34px)' }}>
              {product.very_short_description_de}
            </h2>
            <div className="w-12 h-px bg-gold mb-3 opacity-70" />

            {/* Price */}
            {product.price_sp_chf && (
              <div className="text-[14px] text-foreground font-medium mb-2">
                CHF {product.price_sp_chf} <span className="text-[10px] text-muted-foreground font-normal">{t('list_price')}</span>
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tags.map((tg, i) => (
                  <span key={i} className="text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full border border-border text-muted-foreground bg-secondary">
                    {tg}
                  </span>
                ))}
              </div>
            )}
            <p className="text-[13px] leading-[1.7] text-muted-foreground">
              {product.long_description_de}
            </p>
          </div>

          {/* Specs grid */}
          {specs.length > 0 && (
            <div>
              <div className="text-[9px] tracking-[0.18em] uppercase text-gold mb-2 font-medium">{t('technical_data')}</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {specs.map((s, i) => (
                  <div key={i} className="flex justify-between text-[11.5px]">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="text-foreground font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          {controls.length > 0 && (
            <div>
              <div className="text-[9px] tracking-[0.18em] uppercase text-gold mb-1.5 font-medium">{t('controls')}</div>
              <div className="flex flex-wrap gap-1.5">
                {controls.map((c, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded border border-gold/30 text-gold bg-gold/[0.06]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {hasDocuments && (
            <div>
              <div className="text-[9px] tracking-[0.18em] uppercase text-gold mb-1.5 font-medium">{t('documents')}</div>
              <div className="flex flex-col gap-1">
                {product.datasheets?.map((url, i) => (
                  <a key={`ds-${i}`} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-gold transition-colors">
                    <FileText size={12} /> {t('datasheet')} {i + 1}
                  </a>
                ))}
                {product.light_diagrams?.map((url, i) => (
                  <a key={`ld-${i}`} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-gold transition-colors">
                    <Lightbulb size={12} /> {t('light_diagram')} {i + 1}
                  </a>
                ))}
                {product.mounting_instructions?.map((url, i) => (
                  <a key={`mi-${i}`} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-gold transition-colors">
                    <Wrench size={12} /> {t('mounting_instructions')} {i + 1}
                  </a>
                ))}
                {product.drawings?.map((url, i) => (
                  <a key={`dr-${i}`} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-gold transition-colors">
                    <PenTool size={12} /> {t('drawing')} {i + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-auto pt-2">
            {onAddToCart && (
              <button
                onClick={() => onAddToCart(product)}
                className="flex items-center gap-2 px-[22px] py-[11px] rounded-md bg-gold text-primary-foreground text-[11px] tracking-[0.12em] uppercase font-body transition-all cursor-pointer hover:bg-gold-light"
              >
                <ShoppingCart size={13} />
                {t('add_to_project')}
              </button>
            )}
            <button
              onClick={() => onToggleSave(product.id)}
              className={`flex items-center gap-2 px-[22px] py-[11px] rounded-md border text-[11px] tracking-[0.12em] uppercase font-body transition-all cursor-pointer ${
                isSaved
                  ? 'border-gold text-gold bg-gold/[0.08]'
                  : 'border-border text-muted-foreground hover:border-gold hover:text-gold hover:bg-gold/[0.08]'
              }`}
            >
              <Bookmark size={13} />
              {isSaved ? t('saved') : t('save')}
            </button>
            <button
              onClick={onClose}
              className="ml-auto w-[34px] h-[34px] rounded-full bg-secondary border border-border cursor-pointer flex items-center justify-center text-muted-foreground transition-all hover:border-gold hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
