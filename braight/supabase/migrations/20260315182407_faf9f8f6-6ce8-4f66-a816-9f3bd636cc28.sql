
-- Wishlists table
CREATE TABLE public.wishlists (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Neue Liste',
  color text NOT NULL DEFAULT '#C8932A',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wishlists" ON public.wishlists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wishlists" ON public.wishlists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wishlists" ON public.wishlists FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlists" ON public.wishlists FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Wishlist items table
CREATE TABLE public.wishlist_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  wishlist_id bigint NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  article_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(wishlist_id, article_id)
);

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wishlist items" ON public.wishlist_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.wishlists w WHERE w.id = wishlist_id AND w.user_id = auth.uid()));
CREATE POLICY "Users can insert own wishlist items" ON public.wishlist_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.wishlists w WHERE w.id = wishlist_id AND w.user_id = auth.uid()));
CREATE POLICY "Users can delete own wishlist items" ON public.wishlist_items FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.wishlists w WHERE w.id = wishlist_id AND w.user_id = auth.uid()));

-- Rejected articles table
CREATE TABLE public.rejected_articles (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL,
  article_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE public.rejected_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rejections" ON public.rejected_articles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rejections" ON public.rejected_articles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own rejections" ON public.rejected_articles FOR DELETE TO authenticated USING (auth.uid() = user_id);
