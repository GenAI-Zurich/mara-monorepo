
CREATE TABLE public.product_interactions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  article_id bigint NOT NULL,
  interaction_type text NOT NULL,
  search_query text,
  carousel_position integer,
  wishlist_name text,
  project_name text,
  quantity integer,
  defect_description text,
  dwell_ms integer,
  previous_interactions_in_session integer DEFAULT 0,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.product_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own interactions"
  ON public.product_interactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own interactions"
  ON public.product_interactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_product_interactions_user ON public.product_interactions (user_id);
CREATE INDEX idx_product_interactions_article ON public.product_interactions (article_id);
CREATE INDEX idx_product_interactions_type ON public.product_interactions (interaction_type);
CREATE INDEX idx_product_interactions_created ON public.product_interactions (created_at);
