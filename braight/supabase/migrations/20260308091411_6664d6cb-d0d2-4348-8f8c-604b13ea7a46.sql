
DROP TABLE IF EXISTS _import_column_map;

TRUNCATE 
  article_accountings, article_character_profiles, article_chat_gpt_parsed_data,
  article_classifications, article_group_sync_statuses, article_groups, article_media,
  article_sync_statuses, article_technical_profiles, articles,
  contact_addresses, contact_bank_accounts, contact_formalities, contact_methods,
  contact_notes, contact_payment_terms, contact_relations, contacts,
  conversion_rates, goose_db_version,
  icon_articles, icon_categories, icon_icon_categories, icons,
  inventories, inventory_log_sync_statuses, inventory_logs, inventory_sync_statuses,
  l_numbers, light_categories, light_families, manufacturers,
  mapper_articles, mapper_column_configs, mapper_icons, mapper_mappers, mappers,
  pim_users, range_wise_flat_margins, retailers
CASCADE;
