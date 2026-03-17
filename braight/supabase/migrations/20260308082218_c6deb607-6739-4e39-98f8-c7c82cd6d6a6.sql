
-- Drop existing products table (will be replaced by articles)
DROP TABLE IF EXISTS public.products CASCADE;

-- 1. pim_users (renamed from users to avoid auth.users conflict)
CREATE TABLE public.pim_users (
  id bigint generated always as identity primary key,
  name varchar(255) not null,
  email varchar(255) not null unique,
  password varchar(255) not null,
  role varchar(20) not null,
  theme varchar(20) not null default 'neutral',
  avatar varchar(255),
  language varchar(10) not null default 'de',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. l_numbers
CREATE TABLE public.l_numbers (
  id bigint generated always as identity primary key
);

-- 3. icon_categories
CREATE TABLE public.icon_categories (
  id bigint generated always as identity primary key,
  name_de varchar(255) default '',
  name_en varchar(255) default '',
  name_it varchar(255) default '',
  name_fr varchar(255) default '',
  sort_order bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. light_categories
CREATE TABLE public.light_categories (
  id bigint generated always as identity primary key,
  name_de varchar(255) default '',
  name_en varchar(255) default '',
  name_it varchar(255) default '',
  name_fr varchar(255) default '',
  sort_order bigint default 0,
  is_active boolean default true,
  created_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  updated_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. light_families
CREATE TABLE public.light_families (
  id bigint generated always as identity primary key,
  name_de varchar(255) default '',
  name_en varchar(255) default '',
  name_it varchar(255) default '',
  name_fr varchar(255) default '',
  sort_order bigint default 0,
  is_active boolean default true,
  created_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  updated_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. manufacturers
CREATE TABLE public.manufacturers (
  id bigint generated always as identity primary key,
  man_name varchar(100) not null,
  man_country varchar(100),
  man_address varchar(255),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. retailers
CREATE TABLE public.retailers (
  id bigint generated always as identity primary key,
  bo_addr_id bigint,
  name varchar(100) not null,
  code varchar(10),
  country varchar(100),
  address varchar(255),
  margin numeric(5,2),
  discount numeric(5,2),
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 8. conversion_rates
CREATE TABLE public.conversion_rates (
  id bigint generated always as identity primary key,
  to_currency varchar(3) not null,
  from_currency varchar(3) not null,
  rate numeric(10,2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(to_currency, from_currency)
);

-- 9. range_wise_flat_margins
CREATE TABLE public.range_wise_flat_margins (
  id bigint generated always as identity primary key,
  lower_limit numeric(10,2) not null,
  upper_limit numeric(10,2) not null,
  margin numeric(10,2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(lower_limit, upper_limit)
);

-- 10. media (self-referencing)
CREATE TABLE public.media (
  id bigint generated always as identity primary key,
  size bigint default 0,
  file_hash varchar(64),
  file_type varchar(50) default 'UNKNOWN',
  content_type varchar(50) default 'OTHER',
  storage_path varchar(500) not null,
  cutout_path varchar(500),
  processed_path varchar(500),
  thumbnail_path varchar(500),
  medium_size_path varchar(500),
  small_size_path varchar(500),
  maximum_size_path varchar(500),
  original_name varchar(255) not null,
  version bigint default 1,
  is_original boolean default true,
  language varchar(2),
  processed_at timestamptz,
  process_type varchar(50) default 'ORIGINAL',
  processing_status varchar(20) default 'PENDING',
  parent_id bigint references public.media(id) on delete set null on update cascade,
  deleted_by bigint,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
CREATE INDEX idx_media_deleted_at ON public.media(deleted_at);
CREATE INDEX idx_media_file_hash ON public.media(file_hash);
CREATE INDEX idx_media_parent_id ON public.media(parent_id);

-- 11. article_accountings
CREATE TABLE public.article_accountings (
  id bigint generated always as identity primary key,
  is_discountable boolean,
  is_commissionable boolean,
  purchase_vat_import bigint,
  purchase_vat_standard bigint,
  purchase_account_import varchar(191),
  purchase_account_standard varchar(191),
  purchase_cost_account_import varchar(191),
  purchase_cost_account_standard varchar(191),
  sales_vat_export bigint,
  sales_vat_standard bigint,
  sales_account_export varchar(191),
  sales_account_standard varchar(191),
  sales_cost_account_export varchar(191),
  sales_cost_account_standard varchar(191),
  default_true boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 12. article_character_profiles
CREATE TABLE public.article_character_profiles (
  id bigint generated always as identity primary key,
  is_direct boolean, is_indirect boolean,
  direct_ugr double precision, direct_value bigint,
  direct_beam_angle_one bigint, direct_beam_angle_two bigint,
  direct_transparent boolean, direct_opal boolean, direct_micro_prisma boolean,
  direct_lens boolean, direct_reflector boolean, direct_omnidirectional boolean,
  indirect_ugr double precision, indirect_value bigint,
  indirect_beam_angle_one bigint, indirect_beam_angle_two bigint,
  indirect_transparent boolean, indirect_opal boolean, indirect_micro_prisma boolean,
  indirect_lens boolean, indirect_reflector boolean, indirect_omnidirectional boolean,
  controls_on_off boolean, controls_phase_section boolean, controls_one_ten_v boolean,
  controls_dali boolean, controls_dali_two boolean, controls_touch_dim boolean,
  controls_matter boolean, controls_bluetooth boolean, controls_dmx boolean,
  sensor_hf_integrated boolean, sensor_hf_extendable boolean,
  sensor_pir_integrated boolean, sensor_pir_extendable boolean,
  sensor_lux_integrated boolean, sensor_lux_extendable boolean,
  housing_glossy boolean, housing_mat boolean, housing_brushed boolean,
  housing_ecopet boolean, housing_fabric boolean, housing_felt boolean,
  housing_textured boolean, housing_anodized boolean, housing_metallic boolean,
  housing_ral_value varchar(255),
  housing_material smallint default 0,
  housing_lixes_color smallint default 0,
  housing_manufacturer_color smallint default 0,
  light_color_colors jsonb, light_color_rgb boolean, light_color_rgbw boolean,
  light_color_dtw boolean, light_color_switchable boolean, light_color_tw boolean,
  efficiency bigint, cri bigint, hour bigint,
  mac_adam smallint default 0, l_value bigint, b_value bigint, c_value bigint,
  luminaire_fluxes jsonb, eei smallint default 0, light_output smallint default 0,
  default_true boolean default true,
  direct_sanitized boolean, indirect_sanitized boolean,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 13. article_classifications
CREATE TABLE public.article_classifications (
  id bigint generated always as identity primary key,
  inside boolean, outside boolean,
  luminaire_type_surface_mounted boolean, luminaire_type_semi_recessed boolean,
  luminaire_type_down_light boolean, luminaire_type_cable_pendant boolean,
  luminaire_type_outdoor boolean, luminaire_type_recessed boolean,
  luminaire_type_suspended boolean, luminaire_type_rope_pendant boolean,
  luminaire_type_tube_pendant boolean, luminaire_type_chains_pendant boolean,
  luminaire_type_spot_light boolean, luminaire_type_power_rail boolean,
  luminaire_type_profile_luminaire boolean, luminaire_type_system_luminaire boolean,
  luminaire_type_light_bands boolean, luminaire_type_light_strip boolean,
  luminaire_type_special_luminaire boolean, luminaire_type_bollard_luminaire boolean,
  luminaire_type_head_light boolean, luminaire_type_acoustic_luminaire boolean,
  luminaire_type_clean_room boolean, luminaire_type_light_management boolean,
  luminaire_type_higher_protection_class boolean, luminaire_type_high_bay_luminaire boolean,
  luminaire_type_safety_lighting boolean,
  mounting_method_wall boolean, mounting_method_floor boolean,
  mounting_method_table boolean, mounting_method_ceiling boolean,
  mounting_method_power_rail boolean,
  default_true boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 14. article_technical_profiles
CREATE TABLE public.article_technical_profiles (
  id bigint generated always as identity primary key,
  length bigint, width bigint, height bigint, weight bigint, diameter bigint,
  cutout_width bigint, cutout_length bigint, cutout_depth bigint, cutout_diameter bigint,
  device_type bigint default 0,
  ip_rating smallint default 0, ip_rating_two smallint default 0,
  ik_rating smallint default 0,
  filament bigint, min_temp bigint, max_temp bigint,
  protection_class smallint default 0,
  ball_proof boolean, camera boolean, explosion_light boolean,
  zone_one boolean, zone_two boolean, emergency_light boolean,
  one_hour boolean, three_hour boolean, self_test boolean, no_self_test boolean,
  article_logistic_length bigint, article_logistic_depth bigint,
  article_logistic_width bigint, article_logistic_weight bigint,
  article_logistic_delivery_next_day boolean default false,
  article_logistic_delivery_next_week boolean default false,
  electrical_power bigint, electrical_current bigint,
  electrical_voltage230 boolean, electrical_voltage24 boolean, electrical_voltage48 boolean,
  electrical_constant_voltage boolean, electrical_constant_current boolean,
  electrical_voltage_type smallint default 0,
  electrical_c10 bigint, electrical_b10 bigint, electrical_c16 bigint, electrical_b16 bigint,
  electrical_power_factor double precision, electrical_surge_protection double precision,
  electrical_surge_protection_differential double precision,
  electrical_input_voltage_ac jsonb, electrical_input_voltage_dc jsonb,
  electrical_in_rush_current jsonb, electrical_input_frequency jsonb,
  electrical_powers jsonb,
  default_true boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 15. article_groups
CREATE TABLE public.article_groups (
  id bigint generated always as identity primary key,
  path_text varchar(255) not null,
  label_text varchar(255) not null,
  group_text varchar(255) not null,
  e_shop bigint default 0,
  blue_office_id bigint unique,
  parent_group_name varchar(255),
  is_active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 16. articles (main product table)
CREATE TABLE public.articles (
  id bigint generated always as identity primary key,
  l_number bigint not null,
  version bigint not null,
  is_current boolean default true,
  hr_number varchar(255),
  gtin_number varchar(255),
  netto_number varchar(255),
  alternative_number varchar(255),
  article_number varchar(100) not null,
  supplier_article_number varchar(255),
  etim_class varchar(25),
  etim_version varchar(25),
  price_pp_euro text, price_sp_euro text,
  price_pp_chf text, price_sp_chf text,
  price_supplier_netto_price text,
  bo_field_mat_id bigint default 0,
  bo_field_verbrauch double precision,
  bo_field_montage_gruppe text,
  bo_field_icons text,
  bo_field_warn_text text,
  bo_field_warn_text_active boolean default false,
  bo_field_kassen boolean default true,
  bo_field_umsatz_rabatt_faehig boolean default true,
  bo_field_auto_bestellen boolean default false,
  bo_field_warnung_bestand boolean default false,
  price_delivery_time bigint,
  price_web_shop boolean,
  price_netto boolean,
  price_supplier_price_currency varchar(3) default '',
  price_supplier_discount text,
  hero_image_url varchar(255),
  manufacturer_id bigint references public.manufacturers(id) on delete set null on update cascade,
  retailer_id bigint references public.retailers(id) on delete set null on update cascade,
  long_description_de text not null,
  long_description_en text,
  long_description_it text,
  long_description_fr text,
  short_description_de text not null,
  short_description_en text,
  short_description_it text,
  short_description_fr text,
  tender_description_de text not null,
  tender_description_en text,
  tender_description_it text,
  tender_description_fr text,
  article_classification_id bigint not null references public.article_classifications(id) on delete cascade on update cascade,
  article_technical_profile_id bigint not null references public.article_technical_profiles(id) on delete cascade on update cascade,
  article_character_profile_id bigint not null references public.article_character_profiles(id) on delete cascade on update cascade,
  edit_flags_flag_one boolean default false,
  edit_flags_flag_two boolean default false,
  edit_flags_flag_three boolean default false,
  edit_flags_flag_four boolean default false,
  edit_flags_flag_five boolean default false,
  sync_data boolean default false,
  sync_media boolean default false,
  default_true boolean default true,
  accessories jsonb,
  price_in_active boolean,
  very_short_description_de text not null,
  very_short_description_en text,
  very_short_description_fr text,
  very_short_description_it text,
  price_supplier_price text,
  article_accounting_id bigint references public.article_accountings(id) on delete cascade on update cascade,
  article_group_id bigint references public.article_groups(id) on delete cascade on update cascade,
  light_category_id bigint references public.light_categories(id) on delete cascade on update cascade,
  light_family_id bigint references public.light_families(id) on delete cascade on update cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(l_number, version)
);

-- 17. article_chat_gpt_parsed_data
CREATE TABLE public.article_chat_gpt_parsed_data (
  id bigint generated always as identity primary key,
  article_id varchar(100) not null,
  prompt text not null,
  response text,
  parsed_response jsonb not null,
  default_true boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 18. article_media
CREATE TABLE public.article_media (
  id bigint generated always as identity primary key,
  article_id bigint references public.articles(id) on delete cascade on update cascade,
  path varchar(255) not null,
  media_type varchar(50) default 'UNKNOWN',
  language varchar(2) default 'en',
  size bigint default 0,
  hash bigint default 0,
  new_path varchar(255) default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 19. article_sync_statuses
CREATE TABLE public.article_sync_statuses (
  id bigint generated always as identity primary key,
  article_id bigint not null references public.articles(id) on delete cascade on update cascade,
  sync_data boolean,
  sync_media boolean,
  message text,
  sync_status text,
  default_true boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 20. article_group_sync_statuses
CREATE TABLE public.article_group_sync_statuses (
  id bigint generated always as identity primary key,
  remarks text not null,
  sync_status varchar(32) not null default '',
  start_time timestamptz,
  completed_time timestamptz,
  created_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  created_at timestamptz default now()
);

-- 21. icons
CREATE TABLE public.icons (
  id bigint generated always as identity primary key,
  name varchar(100) not null unique,
  sort_order bigint default 0,
  image_path varchar(255) not null,
  description_de varchar(255) default '',
  description_en varchar(255) default '',
  description_it varchar(255) default '',
  description_fr varchar(255) default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 22. icon_articles
CREATE TABLE public.icon_articles (
  icon_id bigint not null references public.icons(id),
  article_id bigint not null references public.articles(id),
  sort_order bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (icon_id, article_id)
);

-- 23. icon_icon_categories
CREATE TABLE public.icon_icon_categories (
  icon_id bigint not null references public.icons(id),
  icon_category_id bigint not null references public.icon_categories(id),
  sort_order bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (icon_id, icon_category_id)
);

-- 24. mappers
CREATE TABLE public.mappers (
  id bigint generated always as identity primary key,
  title_de varchar(255) default '', title_en varchar(255) default '',
  title_it varchar(255) default '', title_fr varchar(255) default '',
  subtitle_de varchar(255) default '', subtitle_en varchar(255) default '',
  subtitle_it varchar(255) default '', subtitle_fr varchar(255) default '',
  text_right_de varchar(255) default '', text_right_en varchar(255) default '',
  text_right_it varchar(255) default '', text_right_fr varchar(255) default '',
  text_description_de text, text_description_en text,
  text_description_fr text, text_description_it text,
  a4a_media_text_de varchar(255) default '', a4a_media_text_en varchar(255) default '',
  a4a_media_text_it varchar(255) default '', a4a_media_text_fr varchar(255) default '',
  a4b_media_text_de varchar(255) default '', a4b_media_text_en varchar(255) default '',
  a4b_media_text_it varchar(255) default '', a4b_media_text_fr varchar(255) default '',
  hero_media_text_de varchar(255) default '', hero_media_text_en varchar(255) default '',
  hero_media_text_it varchar(255) default '', hero_media_text_fr varchar(255) default '',
  application_media_text_de varchar(255) default '', application_media_text_en varchar(255) default '',
  application_media_text_it varchar(255) default '', application_media_text_fr varchar(255) default '',
  sym_linked_mapper_id bigint references public.mappers(id) on delete set null on update cascade,
  tall_media_one_id bigint references public.media(id) on delete set null on update cascade,
  hero_media_id bigint references public.media(id) on delete set null on update cascade,
  application_media_id bigint references public.media(id) on delete set null on update cascade,
  sym_link_mappers jsonb,
  cri boolean default false, power boolean default false, price boolean default false,
  colors boolean default false, length boolean default false, diameter boolean default false,
  finish boolean default false, delivery boolean default false, lixe_color boolean default false,
  beam_angles boolean default false, efficiency boolean default false,
  description boolean default false, article_number boolean default false,
  luminaire_flux boolean default false,
  sorting_field text, head_less boolean default false,
  optional boolean default false, media_flag boolean default false,
  required boolean default false, is_full_width_hero boolean default false,
  a4_a_media_id bigint references public.media(id) on delete set null on update cascade,
  a4_b_media_id bigint references public.media(id) on delete set null on update cascade,
  color_options jsonb, finish_options jsonb,
  path_text varchar(255), label_text varchar(255), group_text varchar(255),
  default_true boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 25. mapper_articles
CREATE TABLE public.mapper_articles (
  mapper_id bigint not null references public.mappers(id),
  article_id bigint not null references public.articles(id),
  group_order bigint default 0,
  sort_order bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (mapper_id, article_id)
);

-- 26. mapper_column_configs
CREATE TABLE public.mapper_column_configs (
  mapper_id bigint primary key,
  article_number boolean default false,
  power boolean default false, cri boolean default false,
  colors boolean default false, luminaire_flux boolean default false,
  efficiency boolean default false, beam_angles boolean default false,
  length boolean default false, lixe_color boolean default false,
  finish boolean default false, price boolean default false,
  delivery boolean default false,
  sort_order bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 27. mapper_icons
CREATE TABLE public.mapper_icons (
  icon_id bigint not null references public.icons(id),
  mapper_id bigint not null references public.mappers(id),
  sort_order bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (icon_id, mapper_id)
);

-- 28. mapper_mappers
CREATE TABLE public.mapper_mappers (
  mapper_id bigint not null references public.mappers(id),
  mapper_children_id bigint not null references public.mappers(id),
  sort_order bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (mapper_id, mapper_children_id)
);

-- 29. media_articles
CREATE TABLE public.media_articles (
  media_id bigint not null references public.media(id),
  article_id bigint not null references public.articles(id),
  sort_order bigint default 0,
  function varchar(50) default 'DEFAULT',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (media_id, article_id)
);

-- 30. contacts (without payment_terms FK initially)
CREATE TABLE public.contacts (
  id bigint generated always as identity primary key,
  name varchar(255) not null,
  type varchar(20) not null,
  title varchar(50),
  last_name varchar(100),
  first_name varchar(100),
  ahv_number varchar(20),
  gender varchar(10),
  function varchar(20),
  birth_date timestamptz,
  status varchar(20),
  industry varchar(100),
  legal_name varchar(255),
  vat_number varchar(20),
  uid varchar(50) unique,
  che varchar(50),
  zefix_id varchar(50),
  is_employee boolean default false,
  is_blocked boolean default false,
  discount_group varchar(1),
  user_id bigint references public.pim_users(id) on delete set null on update cascade,
  assigned_salesperson_id bigint references public.contacts(id),
  bo_addr_id varchar(50),
  bo_addr_number varchar(50),
  bo_addr_searching varchar(255),
  bo_login varchar(100),
  bo_password varchar(100),
  payment_terms_id bigint,
  notes text,
  is_active boolean default true,
  preferred_language varchar(2) default 'de',
  created_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 31. contact_payment_terms
CREATE TABLE public.contact_payment_terms (
  id bigint generated always as identity primary key,
  contact_id bigint not null references public.contacts(id) on delete cascade on update cascade,
  name varchar(100) not null,
  is_default boolean default false,
  days bigint not null,
  discount_days bigint,
  discount_rate numeric(5,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add FK from contacts to contact_payment_terms
ALTER TABLE public.contacts ADD CONSTRAINT fk_contacts_payment_terms
  FOREIGN KEY (payment_terms_id) REFERENCES public.contact_payment_terms(id);

-- 32. contact_addresses
CREATE TABLE public.contact_addresses (
  id bigint generated always as identity primary key,
  contact_id bigint not null references public.contacts(id),
  street1 varchar(255) not null,
  street2 varchar(255),
  city varchar(100) not null,
  canton varchar(50),
  country varchar(100) not null default 'CH',
  postal_code varchar(10) not null,
  type varchar(20) not null,
  label varchar(100),
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 33. contact_bank_accounts
CREATE TABLE public.contact_bank_accounts (
  id bigint generated always as identity primary key,
  contact_id bigint not null references public.contacts(id) on delete cascade on update cascade,
  bic varchar(20),
  iban varchar(50) not null,
  bank_name varchar(100) not null,
  account_holder varchar(100),
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 34. contact_formalities
CREATE TABLE public.contact_formalities (
  id bigint generated always as identity primary key,
  contact_id bigint not null references public.contacts(id),
  employee_id bigint not null references public.contacts(id),
  formality varchar(10) not null default 'SIE',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(contact_id, employee_id)
);

-- 35. contact_methods
CREATE TABLE public.contact_methods (
  id bigint generated always as identity primary key,
  contact_id bigint not null references public.contacts(id),
  type varchar(20) not null,
  value varchar(255) not null,
  label varchar(100),
  sort_order bigint default 0,
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 36. contact_notes
CREATE TABLE public.contact_notes (
  id bigint generated always as identity primary key,
  contact_id bigint not null references public.contacts(id) on delete cascade on update cascade,
  type varchar(50) default 'NOTE',
  title varchar(255),
  content text not null,
  created_by_id bigint not null references public.pim_users(id) on delete cascade on update cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 37. contact_relations
CREATE TABLE public.contact_relations (
  id bigint generated always as identity primary key,
  contact_id bigint not null references public.contacts(id) on delete cascade on update cascade,
  related_contact_id bigint not null references public.contacts(id) on delete cascade on update cascade,
  type varchar(30) not null,
  notes text,
  position varchar(100),
  department varchar(100),
  percentage bigint,
  is_active boolean default true,
  end_date timestamptz,
  start_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 38. inventories
CREATE TABLE public.inventories (
  id bigint generated always as identity primary key,
  country varchar(191) default 'CH',
  company_name varchar(191) default 'LIXS AG',
  zusatz text,
  inventory_number text,
  name text,
  post_code text,
  location text,
  telephone text,
  street_number text,
  inventory_type smallint not null default 0,
  is_active boolean not null default true,
  bo_id bigint default 0 unique,
  created_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  updated_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 39. inventory_logs
CREATE TABLE public.inventory_logs (
  id bigint generated always as identity primary key,
  article_id bigint not null references public.articles(id) on delete cascade on update cascade,
  inventory_id bigint not null references public.inventories(id) on delete cascade on update cascade,
  remarks text,
  storage_location varchar(50),
  storage_bin_location varchar(50),
  reserved bigint not null default 0,
  available bigint not null default 0,
  min_stock bigint not null default 0,
  max_stock bigint not null default 0,
  ordered bigint not null default 0,
  order_quantity bigint not null default 0,
  is_active boolean not null default true,
  default_log boolean not null default true,
  bo_mat_id bigint default 0,
  bo_lager_id bigint default 0,
  created_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  updated_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(storage_location, storage_bin_location, bo_mat_id, bo_lager_id)
);

-- 40. inventory_sync_statuses
CREATE TABLE public.inventory_sync_statuses (
  id bigint generated always as identity primary key,
  remarks text not null,
  sync_status varchar(32) not null default '',
  start_time timestamptz,
  completed_time timestamptz,
  created_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  created_at timestamptz default now()
);

-- 41. inventory_log_sync_statuses
CREATE TABLE public.inventory_log_sync_statuses (
  id bigint generated always as identity primary key,
  remarks text not null,
  sync_status varchar(32) not null default '',
  start_time timestamptz,
  completed_time timestamptz,
  created_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  created_at timestamptz default now()
);

-- 42. suppliers
CREATE TABLE public.suppliers (
  id bigint generated always as identity primary key,
  supplier_order_number varchar(191),
  article_id bigint not null references public.articles(id) on delete cascade on update cascade,
  retailer_id bigint not null references public.retailers(id) on delete cascade on update cascade,
  supplier_discount varchar(191),
  supplier_base_price varchar(191),
  supplier_price_currency varchar(3) default '',
  packaging_unit bigint,
  minimum_order_quantity bigint,
  default_supplier boolean default true,
  bo_id bigint default 0 unique,
  bo_mat_id bigint default 0,
  bo_adr_id bigint default 0,
  created_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  updated_by_id bigint references public.pim_users(id) on delete set null on update cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 43. goose_db_version
CREATE TABLE public.goose_db_version (
  id bigint generated always as identity primary key,
  version_id bigint not null,
  is_applied boolean not null,
  tstamp timestamptz default now()
);

-- Enable RLS on all product-relevant tables with public read access
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_character_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_technical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.light_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.light_families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mappers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.icons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.article_classifications FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.article_character_profiles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.article_technical_profiles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.article_groups FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.article_media FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.light_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.light_families FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.manufacturers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.retailers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.media FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.mappers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.icons FOR SELECT USING (true);
