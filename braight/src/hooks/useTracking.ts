import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

function getSessionId(): string {
  let sid = sessionStorage.getItem("_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("_sid", sid);
  }
  return sid;
}

export type InteractionType =
  | 'search'
  | 'product_view'
  | 'product_close'
  | 'product_reject'
  | 'wishlist_add'
  | 'wishlist_remove'
  | 'project_add'
  | 'project_submit'
  | 'order_cancel'
  | 'delivery_request'
  | 'defect_report'
  | 'constraint_accept'
  | 'constraint_reject';

export interface InteractionContext {
  searchQuery?: string;
  carouselPosition?: number;
  wishlistName?: string;
  projectName?: string;
  quantity?: number;
  defectDescription?: string;
  dwellMs?: number;
  extra?: Record<string, any>;
}

export function useTracking() {
  const { user } = useAuth();
  const sessionId = useRef(getSessionId());
  const interactionCount = useRef(0);

  const track = useCallback(async (eventType: string, data?: Record<string, any>, articleId?: number) => {
    try {
      await supabase.from("user_events").insert({
        user_id: user?.id ?? null,
        session_id: sessionId.current,
        event_type: eventType,
        event_data: data ?? {},
        article_id: articleId ?? null,
      });
    } catch {
      // Silent fail for analytics
    }
  }, [user]);

  const trackInteraction = useCallback(async (
    articleId: number,
    interactionType: InteractionType,
    ctx: InteractionContext = {}
  ) => {
    if (!user) return;
    interactionCount.current += 1;
    try {
      await supabase.from("product_interactions").insert({
        user_id: user.id,
        session_id: sessionId.current,
        article_id: articleId,
        interaction_type: interactionType,
        search_query: ctx.searchQuery ?? null,
        carousel_position: ctx.carouselPosition ?? null,
        wishlist_name: ctx.wishlistName ?? null,
        project_name: ctx.projectName ?? null,
        quantity: ctx.quantity ?? null,
        defect_description: ctx.defectDescription ?? null,
        dwell_ms: ctx.dwellMs ?? null,
        previous_interactions_in_session: interactionCount.current - 1,
        context: ctx.extra ?? {},
      } as any);
    } catch {
      // Silent fail
    }
  }, [user]);

  return { track, trackInteraction };
}
