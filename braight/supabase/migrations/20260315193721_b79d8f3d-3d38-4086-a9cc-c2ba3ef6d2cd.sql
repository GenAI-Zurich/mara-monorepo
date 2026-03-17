
-- Add search-level columns to product_interactions
ALTER TABLE public.product_interactions
  ADD COLUMN IF NOT EXISTS llm_reply text,
  ADD COLUMN IF NOT EXISTS returned_article_ids integer[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS mara_scores jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS constraint_suggestions jsonb DEFAULT '[]'::jsonb;

-- Allow nullable article_id for search-level entries
ALTER TABLE public.product_interactions ALTER COLUMN article_id DROP NOT NULL;

-- Allow anon inserts for non-logged-in users
CREATE POLICY "Anon can insert interactions"
  ON public.product_interactions FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

-- Also allow nullable user_id
ALTER TABLE public.product_interactions ALTER COLUMN user_id DROP NOT NULL;

-- Drop search_logs table
DROP TABLE IF EXISTS public.search_logs;
