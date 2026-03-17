export interface ArticleClassification {
  inside?: boolean;
  outside?: boolean;
  luminaire_type_down_light?: boolean;
  luminaire_type_surface_mounted?: boolean;
  luminaire_type_recessed?: boolean;
  luminaire_type_suspended?: boolean;
  luminaire_type_outdoor?: boolean;
  luminaire_type_high_bay_luminaire?: boolean;
  luminaire_type_spot_light?: boolean;
  luminaire_type_profile_luminaire?: boolean;
  luminaire_type_acoustic_luminaire?: boolean;
  luminaire_type_safety_lighting?: boolean;
  mounting_method_wall?: boolean;
  mounting_method_ceiling?: boolean;
  mounting_method_floor?: boolean;
}

export interface ArticleCharacterProfile {
  cri?: number;
  efficiency?: number;
  controls_dali?: boolean;
  controls_bluetooth?: boolean;
  controls_on_off?: boolean;
  controls_phase_section?: boolean;
  controls_one_ten_v?: boolean;
  controls_touch_dim?: boolean;
  light_color_colors?: any;
  light_color_tw?: boolean;
  light_color_rgb?: boolean;
  light_color_rgbw?: boolean;
  is_direct?: boolean;
  is_indirect?: boolean;
  direct_ugr?: number;
  direct_beam_angle_one?: number;
  direct_beam_angle_two?: number;
  indirect_ugr?: number;
  light_output?: number;
  hour?: number;
  housing_material?: number;
  housing_ral_value?: string;
}

export interface ArticleTechnicalProfile {
  ip_rating?: number;
  ik_rating?: number;
  length?: number;
  width?: number;
  height?: number;
  diameter?: number;
  weight?: number;
  electrical_power?: number;
  electrical_current?: number;
  electrical_voltage230?: boolean;
  electrical_voltage24?: boolean;
  electrical_voltage48?: boolean;
  protection_class?: number;
  min_temp?: number;
  max_temp?: number;
}

export interface ArticleMedia {
  id: number;
  path: string;
  media_type?: string;
  language?: string;
  new_path?: string;
  storage_url?: string;
}

export interface Product {
  id: number;
  l_number: number;
  article_number: string;
  short_description_de: string;
  short_description_en?: string;
  long_description_de: string;
  long_description_en?: string;
  very_short_description_de: string;
  very_short_description_en?: string;
  hero_image_url?: string;
  article_classification_id: number;
  article_character_profile_id: number;
  article_technical_profile_id: number;
  light_category_id?: number;
  light_family_id?: number;
  manufacturer_id?: number;
  is_current?: boolean;
  price_sp_chf?: string;
  price_pp_chf?: string;
  // Joined data
  classification?: ArticleClassification;
  character_profile?: ArticleCharacterProfile;
  technical_profile?: ArticleTechnicalProfile;
  light_family?: { name_de?: string };
  light_category?: { name_de?: string };
  manufacturer?: { man_name?: string };
  // Media & storage
  media?: ArticleMedia[];
  hero_storage_url?: string;
  datasheets?: string[];
  light_diagrams?: string[];
  mounting_instructions?: string[];
  drawings?: string[];
  // MARA enrichment
  mara_score?: number;
  mara_violations?: string[];
}

export interface ConstraintSuggestion {
  field: string;
  label: string;
  value: any;
  options?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: ConstraintSuggestion[];
}
