
CREATE TABLE public.search_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid,
  session_id text NOT NULL,
  prompt text NOT NULL,
  llm_reply text,
  returned_article_ids integer[] DEFAULT '{}',
  mara_scores jsonb DEFAULT '[]'::jsonb,
  constraint_suggestions jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own search logs"
  ON public.search_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own search logs"
  ON public.search_logs FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anon can insert search logs"
  ON public.search_logs FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

CREATE INDEX idx_search_logs_user ON public.search_logs (user_id);
CREATE INDEX idx_search_logs_created ON public.search_logs (created_at);
