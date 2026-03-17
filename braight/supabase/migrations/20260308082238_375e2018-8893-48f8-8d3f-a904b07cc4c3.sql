
-- Enable RLS on remaining tables
ALTER TABLE public.pim_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.l_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.icon_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_accountings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_chat_gpt_parsed_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_sync_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_group_sync_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.icon_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.icon_icon_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapper_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapper_column_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapper_icons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mapper_mappers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_payment_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_formalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_sync_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_log_sync_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goose_db_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.range_wise_flat_margins ENABLE ROW LEVEL SECURITY;

-- Public read for join tables and remaining product-related
CREATE POLICY "Public read access" ON public.icon_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.icon_articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.icon_icon_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.mapper_articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.mapper_icons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.mapper_mappers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.media_articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.article_accountings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.mapper_column_configs FOR SELECT USING (true);
