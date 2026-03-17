import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { CartItem } from "@/components/CartOverlay";
import type { Product } from "@/types/product";

export function useCart(allProducts: Product[]) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from DB
  const loadCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    const { data } = await supabase
      .from("cart_items")
      .select("article_id, quantity")
      .eq("user_id", user.id);
    if (data) {
      setItems(data.map(d => ({
        article_id: d.article_id,
        quantity: d.quantity,
        product: allProducts.find(p => p.id === d.article_id),
      })));
    }
  }, [user, allProducts]);

  useEffect(() => { loadCart(); }, [loadCart]);

  const addToCart = useCallback(async (articleId: number, qty = 1) => {
    if (!user) return;
    const existing = items.find(i => i.article_id === articleId);
    if (existing) {
      await supabase.from("cart_items").update({ quantity: existing.quantity + qty }).eq("user_id", user.id).eq("article_id", articleId);
    } else {
      await supabase.from("cart_items").insert({ user_id: user.id, article_id: articleId, quantity: qty });
    }
    await loadCart();
  }, [user, items, loadCart]);

  const updateQuantity = useCallback(async (articleId: number, quantity: number) => {
    if (!user) return;
    await supabase.from("cart_items").update({ quantity }).eq("user_id", user.id).eq("article_id", articleId);
    await loadCart();
  }, [user, loadCart]);

  const removeFromCart = useCallback(async (articleId: number) => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id).eq("article_id", articleId);
    await loadCart();
  }, [user, loadCart]);

  const clearCart = useCallback(async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  }, [user]);

  return { items, addToCart, updateQuantity, removeFromCart, clearCart, cartCount: items.reduce((s, i) => s + i.quantity, 0) };
}
