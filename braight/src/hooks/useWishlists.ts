import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Wishlist {
  id: number;
  name: string;
  color: string;
  sort_order: number;
  created_at: string;
}

export interface WishlistWithItems extends Wishlist {
  article_ids: number[];
}

// Auto-assigned colors for new lists
const PALETTE = [
  '#C8932A', // gold
  '#E8E8E8', // silver/white
  '#8A8A8A', // gray
  '#5BA3A3', // teal
  '#D4766A', // coral
  '#9B8EC4', // lavender
  '#6BBF8A', // mint
  '#D4A656', // amber
  '#7BA4D4', // steel blue
  '#C47B9B', // rose
  '#8BC4A0', // sage
  '#D49B5B', // copper
];

export function useWishlists() {
  const { user } = useAuth();
  const [wishlists, setWishlists] = useState<WishlistWithItems[]>([]);
  const [rejectedIds, setRejectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const loadAll = useCallback(async () => {
    if (!user) { setWishlists([]); setRejectedIds(new Set()); return; }
    setLoading(true);

    const [{ data: wls }, { data: items }, { data: rejected }] = await Promise.all([
      supabase.from("wishlists").select("*").eq("user_id", user.id).order("sort_order"),
      supabase.from("wishlist_items").select("wishlist_id, article_id"),
      supabase.from("rejected_articles").select("article_id").eq("user_id", user.id),
    ]);

    const itemsByList = new Map<number, number[]>();
    (items || []).forEach((i: any) => {
      const arr = itemsByList.get(i.wishlist_id) || [];
      arr.push(i.article_id);
      itemsByList.set(i.wishlist_id, arr);
    });

    setWishlists((wls || []).map((w: any) => ({
      ...w,
      article_ids: itemsByList.get(w.id) || [],
    })));

    setRejectedIds(new Set((rejected || []).map((r: any) => r.article_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const createWishlist = useCallback(async (name = 'Neue Liste') => {
    if (!user) return;
    const nextColor = PALETTE[wishlists.length % PALETTE.length];
    const nextOrder = wishlists.length;
    await supabase.from("wishlists").insert({
      user_id: user.id,
      name,
      color: nextColor,
      sort_order: nextOrder,
    });
    await loadAll();
  }, [user, wishlists.length, loadAll]);

  const renameWishlist = useCallback(async (wishlistId: number, name: string) => {
    if (!user) return;
    await supabase.from("wishlists").update({ name }).eq("id", wishlistId);
    setWishlists(prev => prev.map(w => w.id === wishlistId ? { ...w, name } : w));
  }, [user]);

  const deleteWishlist = useCallback(async (wishlistId: number) => {
    if (!user) return;
    await supabase.from("wishlists").delete().eq("id", wishlistId);
    await loadAll();
  }, [user, loadAll]);

  const addToWishlist = useCallback(async (wishlistId: number, articleId: number) => {
    if (!user) return;
    await supabase.from("wishlist_items").insert({ wishlist_id: wishlistId, article_id: articleId });
    setWishlists(prev => prev.map(w =>
      w.id === wishlistId && !w.article_ids.includes(articleId)
        ? { ...w, article_ids: [...w.article_ids, articleId] }
        : w
    ));
  }, [user]);

  const removeFromWishlist = useCallback(async (wishlistId: number, articleId: number) => {
    if (!user) return;
    await supabase.from("wishlist_items").delete().eq("wishlist_id", wishlistId).eq("article_id", articleId);
    setWishlists(prev => prev.map(w =>
      w.id === wishlistId
        ? { ...w, article_ids: w.article_ids.filter(id => id !== articleId) }
        : w
    ));
  }, [user]);

  const moveToWishlist = useCallback(async (fromWishlistId: number, toWishlistId: number, articleId: number) => {
    if (!user) return;
    await Promise.all([
      supabase.from("wishlist_items").delete().eq("wishlist_id", fromWishlistId).eq("article_id", articleId),
      supabase.from("wishlist_items").insert({ wishlist_id: toWishlistId, article_id: articleId }),
    ]);
    setWishlists(prev => prev.map(w => {
      if (w.id === fromWishlistId) return { ...w, article_ids: w.article_ids.filter(id => id !== articleId) };
      if (w.id === toWishlistId && !w.article_ids.includes(articleId)) return { ...w, article_ids: [...w.article_ids, articleId] };
      return w;
    }));
  }, [user]);

  const rejectArticle = useCallback(async (articleId: number) => {
    if (!user) return;
    // Remove from all wishlists
    for (const w of wishlists) {
      if (w.article_ids.includes(articleId)) {
        await supabase.from("wishlist_items").delete().eq("wishlist_id", w.id).eq("article_id", articleId);
      }
    }
    await supabase.from("rejected_articles").insert({ user_id: user.id, article_id: articleId });
    setRejectedIds(prev => new Set([...prev, articleId]));
    setWishlists(prev => prev.map(w => ({
      ...w,
      article_ids: w.article_ids.filter(id => id !== articleId),
    })));
  }, [user, wishlists]);

  const unRejectArticle = useCallback(async (articleId: number) => {
    if (!user) return;
    await supabase.from("rejected_articles").delete().eq("user_id", user.id).eq("article_id", articleId);
    setRejectedIds(prev => { const n = new Set(prev); n.delete(articleId); return n; });
  }, [user]);

  // Helper: get all wishlists an article is in
  const getWishlistsForArticle = useCallback((articleId: number) => {
    return wishlists.filter(w => w.article_ids.includes(articleId));
  }, [wishlists]);

  const totalSavedCount = wishlists.reduce((s, w) => s + w.article_ids.length, 0);

  return {
    wishlists,
    rejectedIds,
    loading,
    createWishlist,
    renameWishlist,
    deleteWishlist,
    addToWishlist,
    removeFromWishlist,
    moveToWishlist,
    rejectArticle,
    unRejectArticle,
    getWishlistsForArticle,
    totalSavedCount,
    reload: loadAll,
  };
}
