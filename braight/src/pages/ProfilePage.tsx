import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useTracking } from "@/hooks/useTracking";
import { ArrowLeft, Lock, AlertTriangle, ChevronDown, ChevronUp, XCircle, Truck, Package, Play, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import logo from "@/assets/logo_braight.png";
import { LOCALE_LABELS, type Locale } from "@/i18n/translations";

interface OrderItem {
  id: number;
  article_id: number;
  quantity: number;
  unit_price_chf: number | null;
  delivery_status: string | null;
  delivery_date: string | null;
  article_number?: string;
  description?: string;
}

interface Order {
  id: number;
  project_name: string | null;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const ProfilePage = () => {
  const { user, profile, signOut } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const navigate = useNavigate();
  const { trackInteraction } = useTracking();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [defectItemId, setDefectItemId] = useState<number | null>(null);
  const [defectDesc, setDefectDesc] = useState("");
  const [defectMsg, setDefectMsg] = useState("");

  const STATUS_LABELS: Record<string, string> = {
    draft: t('status_draft'),
    submitted: t('status_submitted'),
    checking_delivery: t('status_checking'),
    confirmed: t('status_confirmed'),
    shipped: t('status_shipped'),
    delivered: t('status_delivered'),
    cancelled: t('status_cancelled'),
  };

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    const { data: projects } = await supabase
      .from("projects").select("id, project_name, status, created_at")
      .eq("user_id", user.id)
      .not("status", "eq", "draft")
      .order("created_at", { ascending: false });
    if (!projects) return;

    const orderList: Order[] = [];
    for (const p of projects) {
      const { data: items } = await supabase
        .from("project_items").select("id, article_id, quantity, unit_price_chf, delivery_status, delivery_date")
        .eq("project_id", p.id);

      const enriched: OrderItem[] = await Promise.all((items || []).map(async (item) => {
        const { data: article } = await supabase
          .from("articles").select("article_number, very_short_description_de")
          .eq("id", item.article_id).single();
        return {
          ...item,
          article_number: article?.article_number || `#${item.article_id}`,
          description: article?.very_short_description_de || "Artikel",
        };
      }));
      orderList.push({ ...p, status: p.status || "submitted", items: enriched });
    }
    setOrders(orderList);
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) { setPwMsg(t('min_6_chars')); return; }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwMsg(error ? error.message : t('password_updated'));
    setNewPassword("");
  };

  const handleDefectReport = async (projectItemId: number) => {
    if (!defectDesc.trim() || !user) { setDefectMsg(t('err_enter_description')); return; }
    const { error } = await supabase.from("defect_reports").insert({
      user_id: user.id,
      project_item_id: projectItemId,
      description: defectDesc,
    });
    if (error) setDefectMsg(error.message);
    else {
      const articleId = orders.flatMap(o => o.items).find(i => i.id === projectItemId)?.article_id;
      if (articleId) {
        trackInteraction(articleId, 'defect_report', { defectDescription: defectDesc });
      }
      setDefectMsg(t('defect_reported')); setDefectItemId(null); setDefectDesc("");
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    order?.items.forEach(item => {
      trackInteraction(item.article_id, 'order_cancel', {
        projectName: order.project_name || undefined,
        quantity: item.quantity,
      });
    });
    await supabase.from("projects").update({ status: "cancelled" as any }).eq("id", orderId);
    await loadOrders();
  };

  const handleSimulateDelivery = async (orderId: number) => {
    await supabase.from("projects").update({ status: "delivered" as any }).eq("id", orderId);
    const order = orders.find(o => o.id === orderId);
    if (order) {
      for (const item of order.items) {
        await supabase.from("project_items").update({
          delivery_status: "delivered",
          delivery_date: new Date().toISOString(),
        }).eq("id", item.id);
      }
    }
    await loadOrders();
  };

  if (!user) return null;

  const deliveryInquiries = orders.filter(o => ['submitted', 'checking_delivery', 'confirmed', 'shipped'].includes(o.status));
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  const dateLocale = locale === 'de' ? 'de-CH' : locale === 'fr' ? 'fr-CH' : locale === 'it' ? 'it-CH' : 'en-GB';

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 bg-card border-b border-border px-5 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer">
            <ArrowLeft size={16} />
          </button>
          <img src={logo} alt="brAight" className="h-8 object-contain dark:invert dark:brightness-75" />
        </div>
        <button onClick={signOut} className="text-[11px] text-muted-foreground hover:text-gold cursor-pointer uppercase tracking-[0.1em]">{t('sign_out')}</button>
      </header>

      <div className="max-w-[720px] mx-auto px-5 py-8">
        {/* Profile */}
        <section className="mb-8">
          <h1 className="font-display text-2xl font-light text-foreground mb-4">{t('my_account')}</h1>
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-[0.12em] mb-0.5">{t('email')}</span>
                <span className="text-foreground">{user.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-[0.12em] mb-0.5">{t('company')}</span>
                <span className="text-foreground">{profile?.company_name || "–"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-[0.12em] mb-0.5">{t('occupation')}</span>
                <span className="text-foreground capitalize">{profile?.business_role?.replace("_", " ") || "–"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-[0.12em] mb-0.5">{t('phone')}</span>
                <span className="text-foreground">{profile?.phone || "–"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Language */}
        <section className="mb-8">
          <h2 className="text-[10px] tracking-[0.18em] uppercase text-gold font-medium mb-3 flex items-center gap-2">
            <Globe size={14} /> {t('language')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(LOCALE_LABELS) as [Locale, string][]).map(([loc, label]) => (
              <button
                key={loc}
                onClick={() => setLocale(loc)}
                className={`text-[11px] px-4 py-2 rounded-full border transition-all cursor-pointer ${
                  locale === loc
                    ? "border-gold text-gold bg-gold/10"
                    : "border-border text-muted-foreground hover:border-gold/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Password */}
        <section className="mb-8">
          <h2 className="text-[10px] tracking-[0.18em] uppercase text-gold font-medium mb-3">{t('change_password')}</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 h-10 px-3 rounded-md border border-border bg-background focus-within:border-gold transition-all">
              <Lock size={14} className="text-muted-foreground" />
              <input type="password" placeholder={t('new_password')} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[13px] text-foreground placeholder:text-muted-foreground font-sans" />
            </div>
            <button onClick={handlePasswordChange} className="h-10 px-4 rounded-md bg-gold text-primary-foreground text-[11px] tracking-[0.1em] uppercase font-medium hover:bg-gold-light cursor-pointer">{t('change')}</button>
          </div>
          {pwMsg && <p className="text-[11px] mt-1.5 text-muted-foreground">{pwMsg}</p>}
        </section>

        {/* Ordered Articles */}
        <section className="mb-8">
          <h2 className="text-[10px] tracking-[0.18em] uppercase text-gold font-medium mb-3 flex items-center gap-2">
            <Truck size={14} /> {t('ordered_articles')}
          </h2>
          {deliveryInquiries.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">{t('no_open_orders')}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {deliveryInquiries.map(order => (
                <div key={order.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-foreground font-medium">{order.project_name || `Projekt #${order.id}`}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-gold/30 text-gold">
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{order.items.length} {t('articles')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{new Date(order.created_at).toLocaleDateString(dateLocale)}</span>
                      {expandedOrder === order.id ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                    </div>
                  </button>

                  {expandedOrder === order.id && (
                    <div className="px-4 pb-3 border-t border-border/50">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2.5 text-[12px] border-b border-border/30 last:border-0">
                          <div className="flex-1 min-w-0">
                            <span className="text-gold text-[9px] tracking-[0.12em] uppercase">{item.article_number} </span>
                            <span className="text-foreground">{item.description}</span>
                            <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                          </div>
                          {item.unit_price_chf && (
                            <span className="text-[10px] text-muted-foreground ml-2">CHF {item.unit_price_chf.toFixed(2)}</span>
                          )}
                        </div>
                      ))}
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/30">
                        <button onClick={() => handleSimulateDelivery(order.id)}
                          className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-green-600/10 border border-green-600/30 text-green-600 text-[10px] tracking-[0.08em] uppercase font-medium hover:bg-green-600/20 cursor-pointer transition-all">
                          <Play size={11} /> {t('simulate_delivery')}
                        </button>
                        <button onClick={() => handleCancelOrder(order.id)}
                          className="flex items-center gap-1 h-8 px-3 rounded-md border border-destructive/30 text-destructive/60 hover:text-destructive hover:border-destructive text-[10px] tracking-[0.08em] uppercase cursor-pointer transition-all">
                          <XCircle size={11} /> {t('cancel')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Delivered Articles */}
        <section className="mb-8">
          <h2 className="text-[10px] tracking-[0.18em] uppercase text-gold font-medium mb-3 flex items-center gap-2">
            <Package size={14} /> {t('delivered_articles')}
          </h2>
          {deliveredOrders.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">{t('no_deliveries')}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {deliveredOrders.map(order => (
                <div key={order.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-foreground font-medium">{order.project_name || `Projekt #${order.id}`}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-green-600/30 text-green-600">
                        {t('status_delivered')}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{order.items.length} {t('articles')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{new Date(order.created_at).toLocaleDateString(dateLocale)}</span>
                      {expandedOrder === order.id ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                    </div>
                  </button>

                  {expandedOrder === order.id && (
                    <div className="px-4 pb-3 border-t border-border/50">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-2.5 text-[12px] border-b border-border/30 last:border-0">
                          <div className="flex-1 min-w-0">
                            <span className="text-gold text-[9px] tracking-[0.12em] uppercase">{item.article_number} </span>
                            <span className="text-foreground">{item.description}</span>
                            <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                          </div>
                          <button
                            onClick={() => { setDefectItemId(item.id); setDefectMsg(""); setDefectDesc(""); }}
                            className="flex items-center gap-1 h-7 px-2.5 rounded-md border border-destructive/30 text-destructive/60 hover:text-destructive hover:border-destructive text-[10px] cursor-pointer transition-all ml-2"
                          >
                            <AlertTriangle size={10} /> {t('report_defect')}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cancelled */}
        {cancelledOrders.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground font-medium mb-3">{t('cancelled_orders')}</h2>
            <div className="flex flex-col gap-2">
              {cancelledOrders.map(order => (
                <div key={order.id} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between opacity-60">
                  <span className="text-[13px] text-foreground">{order.project_name || `Projekt #${order.id}`}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{t('status_cancelled')}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Defect Report Dialog */}
      <Dialog open={defectItemId !== null} onOpenChange={(open) => { if (!open) { setDefectItemId(null); setDefectDesc(""); setDefectMsg(""); } }}>
        <DialogContent className="sm:max-w-[400px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-light text-foreground flex items-center gap-2">
              <AlertTriangle size={16} className="text-destructive" /> {t('report_defect')}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-[12px] text-muted-foreground mb-3">{t('describe_defect')}</p>
            <textarea
              value={defectDesc}
              onChange={e => setDefectDesc(e.target.value)}
              className="w-full h-24 bg-background border border-border rounded-md px-3 py-2 text-[13px] text-foreground resize-none outline-none focus:border-gold font-sans placeholder:text-muted-foreground"
              placeholder={t('what_is_defective')}
              autoFocus
            />
            {defectMsg && <p className="text-[11px] mt-1.5 text-muted-foreground">{defectMsg}</p>}
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => { setDefectItemId(null); setDefectDesc(""); }}
                className="h-9 px-4 rounded-md border border-border text-muted-foreground text-[11px] uppercase tracking-[0.08em] cursor-pointer hover:text-foreground transition-colors">
                {t('cancel')}
              </button>
              <button onClick={() => defectItemId && handleDefectReport(defectItemId)}
                className="h-9 px-4 rounded-md bg-gold text-primary-foreground text-[11px] tracking-[0.08em] uppercase font-medium cursor-pointer hover:bg-gold-light">
                {t('submit')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
