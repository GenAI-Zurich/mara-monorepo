
-- User business role enum
CREATE TYPE public.user_business_role AS ENUM ('architect', 'light_planner', 'electrician', 'dealer', 'other');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  business_role user_business_role,
  phone TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Project status enum
CREATE TYPE public.project_status AS ENUM ('draft', 'submitted', 'checking_delivery', 'confirmed', 'shipped', 'delivered', 'cancelled');

-- Projects (B2B orders/quotes)
CREATE TABLE public.projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT,
  status project_status DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own projects" ON public.projects FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Project items
CREATE TABLE public.project_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  article_id BIGINT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price_chf NUMERIC,
  delivery_status TEXT DEFAULT 'pending',
  delivery_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.project_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own project items" ON public.project_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_items.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can insert own project items" ON public.project_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_items.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can update own project items" ON public.project_items FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_items.project_id AND projects.user_id = auth.uid())
);
CREATE POLICY "Users can delete own project items" ON public.project_items FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_items.project_id AND projects.user_id = auth.uid())
);

-- Defect status enum
CREATE TYPE public.defect_status AS ENUM ('reported', 'in_review', 'approved', 'rejected', 'resolved');

-- Defect reports
CREATE TABLE public.defect_reports (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_item_id BIGINT NOT NULL REFERENCES public.project_items(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status defect_status DEFAULT 'reported',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.defect_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own defect reports" ON public.defect_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own defect reports" ON public.defect_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Cart items (persistent)
CREATE TABLE public.cart_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id BIGINT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own cart" ON public.cart_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart" ON public.cart_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart" ON public.cart_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User events (analytics/metrics)
CREATE TABLE public.user_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  article_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own events" ON public.user_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anon can insert events" ON public.user_events FOR INSERT TO anon WITH CHECK (user_id IS NULL);
