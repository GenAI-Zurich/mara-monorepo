export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      _import_column_map: {
        Row: {
          columns: string[] | null
          table_name: string
        }
        Insert: {
          columns?: string[] | null
          table_name: string
        }
        Update: {
          columns?: string[] | null
          table_name?: string
        }
        Relationships: []
      }
      article_accountings: {
        Row: {
          created_at: string | null
          default_true: boolean | null
          id: number
          is_commissionable: boolean | null
          is_discountable: boolean | null
          purchase_account_import: string | null
          purchase_account_standard: string | null
          purchase_cost_account_import: string | null
          purchase_cost_account_standard: string | null
          purchase_vat_import: number | null
          purchase_vat_standard: number | null
          sales_account_export: string | null
          sales_account_standard: string | null
          sales_cost_account_export: string | null
          sales_cost_account_standard: string | null
          sales_vat_export: number | null
          sales_vat_standard: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_true?: boolean | null
          id?: never
          is_commissionable?: boolean | null
          is_discountable?: boolean | null
          purchase_account_import?: string | null
          purchase_account_standard?: string | null
          purchase_cost_account_import?: string | null
          purchase_cost_account_standard?: string | null
          purchase_vat_import?: number | null
          purchase_vat_standard?: number | null
          sales_account_export?: string | null
          sales_account_standard?: string | null
          sales_cost_account_export?: string | null
          sales_cost_account_standard?: string | null
          sales_vat_export?: number | null
          sales_vat_standard?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_true?: boolean | null
          id?: never
          is_commissionable?: boolean | null
          is_discountable?: boolean | null
          purchase_account_import?: string | null
          purchase_account_standard?: string | null
          purchase_cost_account_import?: string | null
          purchase_cost_account_standard?: string | null
          purchase_vat_import?: number | null
          purchase_vat_standard?: number | null
          sales_account_export?: string | null
          sales_account_standard?: string | null
          sales_cost_account_export?: string | null
          sales_cost_account_standard?: string | null
          sales_vat_export?: number | null
          sales_vat_standard?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      article_character_profiles: {
        Row: {
          b_value: number | null
          c_value: number | null
          controls_bluetooth: boolean | null
          controls_dali: boolean | null
          controls_dali_two: boolean | null
          controls_dmx: boolean | null
          controls_matter: boolean | null
          controls_on_off: boolean | null
          controls_one_ten_v: boolean | null
          controls_phase_section: boolean | null
          controls_touch_dim: boolean | null
          created_at: string | null
          cri: number | null
          default_true: boolean | null
          direct_beam_angle_one: number | null
          direct_beam_angle_two: number | null
          direct_lens: boolean | null
          direct_micro_prisma: boolean | null
          direct_omnidirectional: boolean | null
          direct_opal: boolean | null
          direct_reflector: boolean | null
          direct_sanitized: boolean | null
          direct_transparent: boolean | null
          direct_ugr: number | null
          direct_value: number | null
          eei: number | null
          efficiency: number | null
          hour: number | null
          housing_anodized: boolean | null
          housing_brushed: boolean | null
          housing_ecopet: boolean | null
          housing_fabric: boolean | null
          housing_felt: boolean | null
          housing_glossy: boolean | null
          housing_lixes_color: number | null
          housing_manufacturer_color: number | null
          housing_mat: boolean | null
          housing_material: number | null
          housing_metallic: boolean | null
          housing_ral_value: string | null
          housing_textured: boolean | null
          id: number
          indirect_beam_angle_one: number | null
          indirect_beam_angle_two: number | null
          indirect_lens: boolean | null
          indirect_micro_prisma: boolean | null
          indirect_omnidirectional: boolean | null
          indirect_opal: boolean | null
          indirect_reflector: boolean | null
          indirect_sanitized: boolean | null
          indirect_transparent: boolean | null
          indirect_ugr: number | null
          indirect_value: number | null
          is_direct: boolean | null
          is_indirect: boolean | null
          l_value: number | null
          light_color_colors: Json | null
          light_color_dtw: boolean | null
          light_color_rgb: boolean | null
          light_color_rgbw: boolean | null
          light_color_switchable: boolean | null
          light_color_tw: boolean | null
          light_output: number | null
          luminaire_fluxes: Json | null
          mac_adam: number | null
          sensor_hf_extendable: boolean | null
          sensor_hf_integrated: boolean | null
          sensor_lux_extendable: boolean | null
          sensor_lux_integrated: boolean | null
          sensor_pir_extendable: boolean | null
          sensor_pir_integrated: boolean | null
          updated_at: string | null
        }
        Insert: {
          b_value?: number | null
          c_value?: number | null
          controls_bluetooth?: boolean | null
          controls_dali?: boolean | null
          controls_dali_two?: boolean | null
          controls_dmx?: boolean | null
          controls_matter?: boolean | null
          controls_on_off?: boolean | null
          controls_one_ten_v?: boolean | null
          controls_phase_section?: boolean | null
          controls_touch_dim?: boolean | null
          created_at?: string | null
          cri?: number | null
          default_true?: boolean | null
          direct_beam_angle_one?: number | null
          direct_beam_angle_two?: number | null
          direct_lens?: boolean | null
          direct_micro_prisma?: boolean | null
          direct_omnidirectional?: boolean | null
          direct_opal?: boolean | null
          direct_reflector?: boolean | null
          direct_sanitized?: boolean | null
          direct_transparent?: boolean | null
          direct_ugr?: number | null
          direct_value?: number | null
          eei?: number | null
          efficiency?: number | null
          hour?: number | null
          housing_anodized?: boolean | null
          housing_brushed?: boolean | null
          housing_ecopet?: boolean | null
          housing_fabric?: boolean | null
          housing_felt?: boolean | null
          housing_glossy?: boolean | null
          housing_lixes_color?: number | null
          housing_manufacturer_color?: number | null
          housing_mat?: boolean | null
          housing_material?: number | null
          housing_metallic?: boolean | null
          housing_ral_value?: string | null
          housing_textured?: boolean | null
          id?: never
          indirect_beam_angle_one?: number | null
          indirect_beam_angle_two?: number | null
          indirect_lens?: boolean | null
          indirect_micro_prisma?: boolean | null
          indirect_omnidirectional?: boolean | null
          indirect_opal?: boolean | null
          indirect_reflector?: boolean | null
          indirect_sanitized?: boolean | null
          indirect_transparent?: boolean | null
          indirect_ugr?: number | null
          indirect_value?: number | null
          is_direct?: boolean | null
          is_indirect?: boolean | null
          l_value?: number | null
          light_color_colors?: Json | null
          light_color_dtw?: boolean | null
          light_color_rgb?: boolean | null
          light_color_rgbw?: boolean | null
          light_color_switchable?: boolean | null
          light_color_tw?: boolean | null
          light_output?: number | null
          luminaire_fluxes?: Json | null
          mac_adam?: number | null
          sensor_hf_extendable?: boolean | null
          sensor_hf_integrated?: boolean | null
          sensor_lux_extendable?: boolean | null
          sensor_lux_integrated?: boolean | null
          sensor_pir_extendable?: boolean | null
          sensor_pir_integrated?: boolean | null
          updated_at?: string | null
        }
        Update: {
          b_value?: number | null
          c_value?: number | null
          controls_bluetooth?: boolean | null
          controls_dali?: boolean | null
          controls_dali_two?: boolean | null
          controls_dmx?: boolean | null
          controls_matter?: boolean | null
          controls_on_off?: boolean | null
          controls_one_ten_v?: boolean | null
          controls_phase_section?: boolean | null
          controls_touch_dim?: boolean | null
          created_at?: string | null
          cri?: number | null
          default_true?: boolean | null
          direct_beam_angle_one?: number | null
          direct_beam_angle_two?: number | null
          direct_lens?: boolean | null
          direct_micro_prisma?: boolean | null
          direct_omnidirectional?: boolean | null
          direct_opal?: boolean | null
          direct_reflector?: boolean | null
          direct_sanitized?: boolean | null
          direct_transparent?: boolean | null
          direct_ugr?: number | null
          direct_value?: number | null
          eei?: number | null
          efficiency?: number | null
          hour?: number | null
          housing_anodized?: boolean | null
          housing_brushed?: boolean | null
          housing_ecopet?: boolean | null
          housing_fabric?: boolean | null
          housing_felt?: boolean | null
          housing_glossy?: boolean | null
          housing_lixes_color?: number | null
          housing_manufacturer_color?: number | null
          housing_mat?: boolean | null
          housing_material?: number | null
          housing_metallic?: boolean | null
          housing_ral_value?: string | null
          housing_textured?: boolean | null
          id?: never
          indirect_beam_angle_one?: number | null
          indirect_beam_angle_two?: number | null
          indirect_lens?: boolean | null
          indirect_micro_prisma?: boolean | null
          indirect_omnidirectional?: boolean | null
          indirect_opal?: boolean | null
          indirect_reflector?: boolean | null
          indirect_sanitized?: boolean | null
          indirect_transparent?: boolean | null
          indirect_ugr?: number | null
          indirect_value?: number | null
          is_direct?: boolean | null
          is_indirect?: boolean | null
          l_value?: number | null
          light_color_colors?: Json | null
          light_color_dtw?: boolean | null
          light_color_rgb?: boolean | null
          light_color_rgbw?: boolean | null
          light_color_switchable?: boolean | null
          light_color_tw?: boolean | null
          light_output?: number | null
          luminaire_fluxes?: Json | null
          mac_adam?: number | null
          sensor_hf_extendable?: boolean | null
          sensor_hf_integrated?: boolean | null
          sensor_lux_extendable?: boolean | null
          sensor_lux_integrated?: boolean | null
          sensor_pir_extendable?: boolean | null
          sensor_pir_integrated?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      article_chat_gpt_parsed_data: {
        Row: {
          article_id: string
          created_at: string | null
          default_true: boolean | null
          id: number
          parsed_response: Json | null
          prompt: string
          response: string | null
          updated_at: string | null
        }
        Insert: {
          article_id: string
          created_at?: string | null
          default_true?: boolean | null
          id?: never
          parsed_response?: Json | null
          prompt: string
          response?: string | null
          updated_at?: string | null
        }
        Update: {
          article_id?: string
          created_at?: string | null
          default_true?: boolean | null
          id?: never
          parsed_response?: Json | null
          prompt?: string
          response?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      article_classifications: {
        Row: {
          created_at: string | null
          default_true: boolean | null
          id: number
          inside: boolean | null
          luminaire_type_acoustic_luminaire: boolean | null
          luminaire_type_bollard_luminaire: boolean | null
          luminaire_type_cable_pendant: boolean | null
          luminaire_type_chains_pendant: boolean | null
          luminaire_type_clean_room: boolean | null
          luminaire_type_down_light: boolean | null
          luminaire_type_head_light: boolean | null
          luminaire_type_high_bay_luminaire: boolean | null
          luminaire_type_higher_protection_class: boolean | null
          luminaire_type_light_bands: boolean | null
          luminaire_type_light_management: boolean | null
          luminaire_type_light_strip: boolean | null
          luminaire_type_outdoor: boolean | null
          luminaire_type_power_rail: boolean | null
          luminaire_type_profile_luminaire: boolean | null
          luminaire_type_recessed: boolean | null
          luminaire_type_rope_pendant: boolean | null
          luminaire_type_safety_lighting: boolean | null
          luminaire_type_semi_recessed: boolean | null
          luminaire_type_special_luminaire: boolean | null
          luminaire_type_spot_light: boolean | null
          luminaire_type_surface_mounted: boolean | null
          luminaire_type_suspended: boolean | null
          luminaire_type_system_luminaire: boolean | null
          luminaire_type_tube_pendant: boolean | null
          mounting_method_ceiling: boolean | null
          mounting_method_floor: boolean | null
          mounting_method_power_rail: boolean | null
          mounting_method_table: boolean | null
          mounting_method_wall: boolean | null
          outside: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_true?: boolean | null
          id?: never
          inside?: boolean | null
          luminaire_type_acoustic_luminaire?: boolean | null
          luminaire_type_bollard_luminaire?: boolean | null
          luminaire_type_cable_pendant?: boolean | null
          luminaire_type_chains_pendant?: boolean | null
          luminaire_type_clean_room?: boolean | null
          luminaire_type_down_light?: boolean | null
          luminaire_type_head_light?: boolean | null
          luminaire_type_high_bay_luminaire?: boolean | null
          luminaire_type_higher_protection_class?: boolean | null
          luminaire_type_light_bands?: boolean | null
          luminaire_type_light_management?: boolean | null
          luminaire_type_light_strip?: boolean | null
          luminaire_type_outdoor?: boolean | null
          luminaire_type_power_rail?: boolean | null
          luminaire_type_profile_luminaire?: boolean | null
          luminaire_type_recessed?: boolean | null
          luminaire_type_rope_pendant?: boolean | null
          luminaire_type_safety_lighting?: boolean | null
          luminaire_type_semi_recessed?: boolean | null
          luminaire_type_special_luminaire?: boolean | null
          luminaire_type_spot_light?: boolean | null
          luminaire_type_surface_mounted?: boolean | null
          luminaire_type_suspended?: boolean | null
          luminaire_type_system_luminaire?: boolean | null
          luminaire_type_tube_pendant?: boolean | null
          mounting_method_ceiling?: boolean | null
          mounting_method_floor?: boolean | null
          mounting_method_power_rail?: boolean | null
          mounting_method_table?: boolean | null
          mounting_method_wall?: boolean | null
          outside?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_true?: boolean | null
          id?: never
          inside?: boolean | null
          luminaire_type_acoustic_luminaire?: boolean | null
          luminaire_type_bollard_luminaire?: boolean | null
          luminaire_type_cable_pendant?: boolean | null
          luminaire_type_chains_pendant?: boolean | null
          luminaire_type_clean_room?: boolean | null
          luminaire_type_down_light?: boolean | null
          luminaire_type_head_light?: boolean | null
          luminaire_type_high_bay_luminaire?: boolean | null
          luminaire_type_higher_protection_class?: boolean | null
          luminaire_type_light_bands?: boolean | null
          luminaire_type_light_management?: boolean | null
          luminaire_type_light_strip?: boolean | null
          luminaire_type_outdoor?: boolean | null
          luminaire_type_power_rail?: boolean | null
          luminaire_type_profile_luminaire?: boolean | null
          luminaire_type_recessed?: boolean | null
          luminaire_type_rope_pendant?: boolean | null
          luminaire_type_safety_lighting?: boolean | null
          luminaire_type_semi_recessed?: boolean | null
          luminaire_type_special_luminaire?: boolean | null
          luminaire_type_spot_light?: boolean | null
          luminaire_type_surface_mounted?: boolean | null
          luminaire_type_suspended?: boolean | null
          luminaire_type_system_luminaire?: boolean | null
          luminaire_type_tube_pendant?: boolean | null
          mounting_method_ceiling?: boolean | null
          mounting_method_floor?: boolean | null
          mounting_method_power_rail?: boolean | null
          mounting_method_table?: boolean | null
          mounting_method_wall?: boolean | null
          outside?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      article_group_sync_statuses: {
        Row: {
          completed_time: string | null
          created_at: string | null
          created_by_id: number | null
          id: number
          remarks: string
          start_time: string | null
          sync_status: string
        }
        Insert: {
          completed_time?: string | null
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          remarks: string
          start_time?: string | null
          sync_status?: string
        }
        Update: {
          completed_time?: string | null
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          remarks?: string
          start_time?: string | null
          sync_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_group_sync_statuses_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
        ]
      }
      article_groups: {
        Row: {
          blue_office_id: number | null
          created_at: string | null
          e_shop: number | null
          group_text: string
          id: number
          is_active: boolean | null
          label_text: string
          parent_group_name: string | null
          path_text: string
          updated_at: string | null
        }
        Insert: {
          blue_office_id?: number | null
          created_at?: string | null
          e_shop?: number | null
          group_text: string
          id?: never
          is_active?: boolean | null
          label_text: string
          parent_group_name?: string | null
          path_text: string
          updated_at?: string | null
        }
        Update: {
          blue_office_id?: number | null
          created_at?: string | null
          e_shop?: number | null
          group_text?: string
          id?: never
          is_active?: boolean | null
          label_text?: string
          parent_group_name?: string | null
          path_text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      article_media: {
        Row: {
          article_id: number | null
          created_at: string | null
          hash: number | null
          id: number
          language: string | null
          media_type: string | null
          new_path: string | null
          path: string
          size: number | null
          updated_at: string | null
        }
        Insert: {
          article_id?: number | null
          created_at?: string | null
          hash?: number | null
          id?: never
          language?: string | null
          media_type?: string | null
          new_path?: string | null
          path: string
          size?: number | null
          updated_at?: string | null
        }
        Update: {
          article_id?: number | null
          created_at?: string | null
          hash?: number | null
          id?: never
          language?: string | null
          media_type?: string | null
          new_path?: string | null
          path?: string
          size?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_media_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_sync_statuses: {
        Row: {
          article_id: number
          created_at: string | null
          default_true: boolean | null
          id: number
          message: string | null
          sync_data: boolean | null
          sync_media: boolean | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          article_id: number
          created_at?: string | null
          default_true?: boolean | null
          id?: never
          message?: string | null
          sync_data?: boolean | null
          sync_media?: boolean | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          article_id?: number
          created_at?: string | null
          default_true?: boolean | null
          id?: never
          message?: string | null
          sync_data?: boolean | null
          sync_media?: boolean | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_sync_statuses_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_technical_profiles: {
        Row: {
          article_logistic_delivery_next_day: boolean | null
          article_logistic_delivery_next_week: boolean | null
          article_logistic_depth: number | null
          article_logistic_length: number | null
          article_logistic_weight: number | null
          article_logistic_width: number | null
          ball_proof: boolean | null
          camera: boolean | null
          created_at: string | null
          cutout_depth: number | null
          cutout_diameter: number | null
          cutout_length: number | null
          cutout_width: number | null
          default_true: boolean | null
          device_type: number | null
          diameter: number | null
          electrical_b10: number | null
          electrical_b16: number | null
          electrical_c10: number | null
          electrical_c16: number | null
          electrical_constant_current: boolean | null
          electrical_constant_voltage: boolean | null
          electrical_current: number | null
          electrical_in_rush_current: Json | null
          electrical_input_frequency: Json | null
          electrical_input_voltage_ac: Json | null
          electrical_input_voltage_dc: Json | null
          electrical_power: number | null
          electrical_power_factor: number | null
          electrical_powers: Json | null
          electrical_surge_protection: number | null
          electrical_surge_protection_differential: number | null
          electrical_voltage_type: number | null
          electrical_voltage230: boolean | null
          electrical_voltage24: boolean | null
          electrical_voltage48: boolean | null
          emergency_light: boolean | null
          explosion_light: boolean | null
          filament: number | null
          height: number | null
          id: number
          ik_rating: number | null
          ip_rating: number | null
          ip_rating_two: number | null
          length: number | null
          max_temp: number | null
          min_temp: number | null
          no_self_test: boolean | null
          one_hour: boolean | null
          protection_class: number | null
          self_test: boolean | null
          three_hour: boolean | null
          updated_at: string | null
          weight: number | null
          width: number | null
          zone_one: boolean | null
          zone_two: boolean | null
        }
        Insert: {
          article_logistic_delivery_next_day?: boolean | null
          article_logistic_delivery_next_week?: boolean | null
          article_logistic_depth?: number | null
          article_logistic_length?: number | null
          article_logistic_weight?: number | null
          article_logistic_width?: number | null
          ball_proof?: boolean | null
          camera?: boolean | null
          created_at?: string | null
          cutout_depth?: number | null
          cutout_diameter?: number | null
          cutout_length?: number | null
          cutout_width?: number | null
          default_true?: boolean | null
          device_type?: number | null
          diameter?: number | null
          electrical_b10?: number | null
          electrical_b16?: number | null
          electrical_c10?: number | null
          electrical_c16?: number | null
          electrical_constant_current?: boolean | null
          electrical_constant_voltage?: boolean | null
          electrical_current?: number | null
          electrical_in_rush_current?: Json | null
          electrical_input_frequency?: Json | null
          electrical_input_voltage_ac?: Json | null
          electrical_input_voltage_dc?: Json | null
          electrical_power?: number | null
          electrical_power_factor?: number | null
          electrical_powers?: Json | null
          electrical_surge_protection?: number | null
          electrical_surge_protection_differential?: number | null
          electrical_voltage_type?: number | null
          electrical_voltage230?: boolean | null
          electrical_voltage24?: boolean | null
          electrical_voltage48?: boolean | null
          emergency_light?: boolean | null
          explosion_light?: boolean | null
          filament?: number | null
          height?: number | null
          id?: never
          ik_rating?: number | null
          ip_rating?: number | null
          ip_rating_two?: number | null
          length?: number | null
          max_temp?: number | null
          min_temp?: number | null
          no_self_test?: boolean | null
          one_hour?: boolean | null
          protection_class?: number | null
          self_test?: boolean | null
          three_hour?: boolean | null
          updated_at?: string | null
          weight?: number | null
          width?: number | null
          zone_one?: boolean | null
          zone_two?: boolean | null
        }
        Update: {
          article_logistic_delivery_next_day?: boolean | null
          article_logistic_delivery_next_week?: boolean | null
          article_logistic_depth?: number | null
          article_logistic_length?: number | null
          article_logistic_weight?: number | null
          article_logistic_width?: number | null
          ball_proof?: boolean | null
          camera?: boolean | null
          created_at?: string | null
          cutout_depth?: number | null
          cutout_diameter?: number | null
          cutout_length?: number | null
          cutout_width?: number | null
          default_true?: boolean | null
          device_type?: number | null
          diameter?: number | null
          electrical_b10?: number | null
          electrical_b16?: number | null
          electrical_c10?: number | null
          electrical_c16?: number | null
          electrical_constant_current?: boolean | null
          electrical_constant_voltage?: boolean | null
          electrical_current?: number | null
          electrical_in_rush_current?: Json | null
          electrical_input_frequency?: Json | null
          electrical_input_voltage_ac?: Json | null
          electrical_input_voltage_dc?: Json | null
          electrical_power?: number | null
          electrical_power_factor?: number | null
          electrical_powers?: Json | null
          electrical_surge_protection?: number | null
          electrical_surge_protection_differential?: number | null
          electrical_voltage_type?: number | null
          electrical_voltage230?: boolean | null
          electrical_voltage24?: boolean | null
          electrical_voltage48?: boolean | null
          emergency_light?: boolean | null
          explosion_light?: boolean | null
          filament?: number | null
          height?: number | null
          id?: never
          ik_rating?: number | null
          ip_rating?: number | null
          ip_rating_two?: number | null
          length?: number | null
          max_temp?: number | null
          min_temp?: number | null
          no_self_test?: boolean | null
          one_hour?: boolean | null
          protection_class?: number | null
          self_test?: boolean | null
          three_hour?: boolean | null
          updated_at?: string | null
          weight?: number | null
          width?: number | null
          zone_one?: boolean | null
          zone_two?: boolean | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          accessories: Json | null
          alternative_number: string | null
          article_accounting_id: number | null
          article_character_profile_id: number
          article_classification_id: number
          article_group_id: number | null
          article_number: string
          article_technical_profile_id: number
          bo_field_auto_bestellen: boolean | null
          bo_field_icons: string | null
          bo_field_kassen: boolean | null
          bo_field_mat_id: number | null
          bo_field_montage_gruppe: string | null
          bo_field_umsatz_rabatt_faehig: boolean | null
          bo_field_verbrauch: number | null
          bo_field_warn_text: string | null
          bo_field_warn_text_active: boolean | null
          bo_field_warnung_bestand: boolean | null
          created_at: string | null
          default_true: boolean | null
          edit_flags_flag_five: boolean | null
          edit_flags_flag_four: boolean | null
          edit_flags_flag_one: boolean | null
          edit_flags_flag_three: boolean | null
          edit_flags_flag_two: boolean | null
          etim_class: string | null
          etim_version: string | null
          gtin_number: string | null
          hero_image_url: string | null
          hr_number: string | null
          id: number
          is_current: boolean | null
          l_number: number
          light_category_id: number | null
          light_family_id: number | null
          long_description_de: string
          long_description_en: string | null
          long_description_fr: string | null
          long_description_it: string | null
          manufacturer_id: number | null
          netto_number: string | null
          price_delivery_time: number | null
          price_in_active: boolean | null
          price_netto: boolean | null
          price_pp_chf: string | null
          price_pp_euro: string | null
          price_sp_chf: string | null
          price_sp_euro: string | null
          price_supplier_discount: string | null
          price_supplier_netto_price: string | null
          price_supplier_price: string | null
          price_supplier_price_currency: string | null
          price_web_shop: boolean | null
          retailer_id: number | null
          short_description_de: string
          short_description_en: string | null
          short_description_fr: string | null
          short_description_it: string | null
          supplier_article_number: string | null
          sync_data: boolean | null
          sync_media: boolean | null
          tender_description_de: string
          tender_description_en: string | null
          tender_description_fr: string | null
          tender_description_it: string | null
          updated_at: string | null
          version: number
          very_short_description_de: string
          very_short_description_en: string | null
          very_short_description_fr: string | null
          very_short_description_it: string | null
        }
        Insert: {
          accessories?: Json | null
          alternative_number?: string | null
          article_accounting_id?: number | null
          article_character_profile_id: number
          article_classification_id: number
          article_group_id?: number | null
          article_number: string
          article_technical_profile_id: number
          bo_field_auto_bestellen?: boolean | null
          bo_field_icons?: string | null
          bo_field_kassen?: boolean | null
          bo_field_mat_id?: number | null
          bo_field_montage_gruppe?: string | null
          bo_field_umsatz_rabatt_faehig?: boolean | null
          bo_field_verbrauch?: number | null
          bo_field_warn_text?: string | null
          bo_field_warn_text_active?: boolean | null
          bo_field_warnung_bestand?: boolean | null
          created_at?: string | null
          default_true?: boolean | null
          edit_flags_flag_five?: boolean | null
          edit_flags_flag_four?: boolean | null
          edit_flags_flag_one?: boolean | null
          edit_flags_flag_three?: boolean | null
          edit_flags_flag_two?: boolean | null
          etim_class?: string | null
          etim_version?: string | null
          gtin_number?: string | null
          hero_image_url?: string | null
          hr_number?: string | null
          id?: never
          is_current?: boolean | null
          l_number: number
          light_category_id?: number | null
          light_family_id?: number | null
          long_description_de: string
          long_description_en?: string | null
          long_description_fr?: string | null
          long_description_it?: string | null
          manufacturer_id?: number | null
          netto_number?: string | null
          price_delivery_time?: number | null
          price_in_active?: boolean | null
          price_netto?: boolean | null
          price_pp_chf?: string | null
          price_pp_euro?: string | null
          price_sp_chf?: string | null
          price_sp_euro?: string | null
          price_supplier_discount?: string | null
          price_supplier_netto_price?: string | null
          price_supplier_price?: string | null
          price_supplier_price_currency?: string | null
          price_web_shop?: boolean | null
          retailer_id?: number | null
          short_description_de: string
          short_description_en?: string | null
          short_description_fr?: string | null
          short_description_it?: string | null
          supplier_article_number?: string | null
          sync_data?: boolean | null
          sync_media?: boolean | null
          tender_description_de: string
          tender_description_en?: string | null
          tender_description_fr?: string | null
          tender_description_it?: string | null
          updated_at?: string | null
          version: number
          very_short_description_de: string
          very_short_description_en?: string | null
          very_short_description_fr?: string | null
          very_short_description_it?: string | null
        }
        Update: {
          accessories?: Json | null
          alternative_number?: string | null
          article_accounting_id?: number | null
          article_character_profile_id?: number
          article_classification_id?: number
          article_group_id?: number | null
          article_number?: string
          article_technical_profile_id?: number
          bo_field_auto_bestellen?: boolean | null
          bo_field_icons?: string | null
          bo_field_kassen?: boolean | null
          bo_field_mat_id?: number | null
          bo_field_montage_gruppe?: string | null
          bo_field_umsatz_rabatt_faehig?: boolean | null
          bo_field_verbrauch?: number | null
          bo_field_warn_text?: string | null
          bo_field_warn_text_active?: boolean | null
          bo_field_warnung_bestand?: boolean | null
          created_at?: string | null
          default_true?: boolean | null
          edit_flags_flag_five?: boolean | null
          edit_flags_flag_four?: boolean | null
          edit_flags_flag_one?: boolean | null
          edit_flags_flag_three?: boolean | null
          edit_flags_flag_two?: boolean | null
          etim_class?: string | null
          etim_version?: string | null
          gtin_number?: string | null
          hero_image_url?: string | null
          hr_number?: string | null
          id?: never
          is_current?: boolean | null
          l_number?: number
          light_category_id?: number | null
          light_family_id?: number | null
          long_description_de?: string
          long_description_en?: string | null
          long_description_fr?: string | null
          long_description_it?: string | null
          manufacturer_id?: number | null
          netto_number?: string | null
          price_delivery_time?: number | null
          price_in_active?: boolean | null
          price_netto?: boolean | null
          price_pp_chf?: string | null
          price_pp_euro?: string | null
          price_sp_chf?: string | null
          price_sp_euro?: string | null
          price_supplier_discount?: string | null
          price_supplier_netto_price?: string | null
          price_supplier_price?: string | null
          price_supplier_price_currency?: string | null
          price_web_shop?: boolean | null
          retailer_id?: number | null
          short_description_de?: string
          short_description_en?: string | null
          short_description_fr?: string | null
          short_description_it?: string | null
          supplier_article_number?: string | null
          sync_data?: boolean | null
          sync_media?: boolean | null
          tender_description_de?: string
          tender_description_en?: string | null
          tender_description_fr?: string | null
          tender_description_it?: string | null
          updated_at?: string | null
          version?: number
          very_short_description_de?: string
          very_short_description_en?: string | null
          very_short_description_fr?: string | null
          very_short_description_it?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_article_accounting_id_fkey"
            columns: ["article_accounting_id"]
            isOneToOne: false
            referencedRelation: "article_accountings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_article_character_profile_id_fkey"
            columns: ["article_character_profile_id"]
            isOneToOne: false
            referencedRelation: "article_character_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_article_classification_id_fkey"
            columns: ["article_classification_id"]
            isOneToOne: false
            referencedRelation: "article_classifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_article_group_id_fkey"
            columns: ["article_group_id"]
            isOneToOne: false
            referencedRelation: "article_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_article_technical_profile_id_fkey"
            columns: ["article_technical_profile_id"]
            isOneToOne: false
            referencedRelation: "article_technical_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_light_category_id_fkey"
            columns: ["light_category_id"]
            isOneToOne: false
            referencedRelation: "light_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_light_family_id_fkey"
            columns: ["light_family_id"]
            isOneToOne: false
            referencedRelation: "light_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          added_at: string | null
          article_id: number
          id: number
          quantity: number
          user_id: string
        }
        Insert: {
          added_at?: string | null
          article_id: number
          id?: never
          quantity?: number
          user_id: string
        }
        Update: {
          added_at?: string | null
          article_id?: number
          id?: never
          quantity?: number
          user_id?: string
        }
        Relationships: []
      }
      contact_addresses: {
        Row: {
          canton: string | null
          city: string
          contact_id: number
          country: string
          created_at: string | null
          id: number
          is_default: boolean | null
          label: string | null
          postal_code: string
          street1: string
          street2: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          canton?: string | null
          city: string
          contact_id: number
          country?: string
          created_at?: string | null
          id?: never
          is_default?: boolean | null
          label?: string | null
          postal_code: string
          street1: string
          street2?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          canton?: string | null
          city?: string
          contact_id?: number
          country?: string
          created_at?: string | null
          id?: never
          is_default?: boolean | null
          label?: string | null
          postal_code?: string
          street1?: string
          street2?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_addresses_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_bank_accounts: {
        Row: {
          account_holder: string | null
          bank_name: string
          bic: string | null
          contact_id: number
          created_at: string | null
          iban: string
          id: number
          is_default: boolean | null
          updated_at: string | null
        }
        Insert: {
          account_holder?: string | null
          bank_name: string
          bic?: string | null
          contact_id: number
          created_at?: string | null
          iban: string
          id?: never
          is_default?: boolean | null
          updated_at?: string | null
        }
        Update: {
          account_holder?: string | null
          bank_name?: string
          bic?: string | null
          contact_id?: number
          created_at?: string | null
          iban?: string
          id?: never
          is_default?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_bank_accounts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_formalities: {
        Row: {
          contact_id: number
          created_at: string | null
          employee_id: number
          formality: string
          id: number
          updated_at: string | null
        }
        Insert: {
          contact_id: number
          created_at?: string | null
          employee_id: number
          formality?: string
          id?: never
          updated_at?: string | null
        }
        Update: {
          contact_id?: number
          created_at?: string | null
          employee_id?: number
          formality?: string
          id?: never
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_formalities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_formalities_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_methods: {
        Row: {
          contact_id: number
          created_at: string | null
          id: number
          is_default: boolean | null
          label: string | null
          sort_order: number | null
          type: string
          updated_at: string | null
          value: string
        }
        Insert: {
          contact_id: number
          created_at?: string | null
          id?: never
          is_default?: boolean | null
          label?: string | null
          sort_order?: number | null
          type: string
          updated_at?: string | null
          value: string
        }
        Update: {
          contact_id?: number
          created_at?: string | null
          id?: never
          is_default?: boolean | null
          label?: string | null
          sort_order?: number | null
          type?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_methods_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_notes: {
        Row: {
          contact_id: number
          content: string
          created_at: string | null
          created_by_id: number
          id: number
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          contact_id: number
          content: string
          created_at?: string | null
          created_by_id: number
          id?: never
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_id?: number
          content?: string
          created_at?: string | null
          created_by_id?: number
          id?: never
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_notes_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_notes_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_payment_terms: {
        Row: {
          contact_id: number
          created_at: string | null
          days: number
          discount_days: number | null
          discount_rate: number | null
          id: number
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          contact_id: number
          created_at?: string | null
          days: number
          discount_days?: number | null
          discount_rate?: number | null
          id?: never
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          contact_id?: number
          created_at?: string | null
          days?: number
          discount_days?: number | null
          discount_rate?: number | null
          id?: never
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_payment_terms_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_relations: {
        Row: {
          contact_id: number
          created_at: string | null
          department: string | null
          end_date: string | null
          id: number
          is_active: boolean | null
          notes: string | null
          percentage: number | null
          position: string | null
          related_contact_id: number
          start_date: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          contact_id: number
          created_at?: string | null
          department?: string | null
          end_date?: string | null
          id?: never
          is_active?: boolean | null
          notes?: string | null
          percentage?: number | null
          position?: string | null
          related_contact_id: number
          start_date?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          contact_id?: number
          created_at?: string | null
          department?: string | null
          end_date?: string | null
          id?: never
          is_active?: boolean | null
          notes?: string | null
          percentage?: number | null
          position?: string | null
          related_contact_id?: number
          start_date?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_relations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_relations_related_contact_id_fkey"
            columns: ["related_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          ahv_number: string | null
          assigned_salesperson_id: number | null
          birth_date: string | null
          bo_addr_id: string | null
          bo_addr_number: string | null
          bo_addr_searching: string | null
          bo_login: string | null
          bo_password: string | null
          che: string | null
          created_at: string | null
          created_by_id: number | null
          discount_group: string | null
          first_name: string | null
          function: string | null
          gender: string | null
          id: number
          industry: string | null
          is_active: boolean | null
          is_blocked: boolean | null
          is_employee: boolean | null
          last_name: string | null
          legal_name: string | null
          name: string
          notes: string | null
          payment_terms_id: number | null
          preferred_language: string | null
          status: string | null
          title: string | null
          type: string
          uid: string | null
          updated_at: string | null
          user_id: number | null
          vat_number: string | null
          zefix_id: string | null
        }
        Insert: {
          ahv_number?: string | null
          assigned_salesperson_id?: number | null
          birth_date?: string | null
          bo_addr_id?: string | null
          bo_addr_number?: string | null
          bo_addr_searching?: string | null
          bo_login?: string | null
          bo_password?: string | null
          che?: string | null
          created_at?: string | null
          created_by_id?: number | null
          discount_group?: string | null
          first_name?: string | null
          function?: string | null
          gender?: string | null
          id?: never
          industry?: string | null
          is_active?: boolean | null
          is_blocked?: boolean | null
          is_employee?: boolean | null
          last_name?: string | null
          legal_name?: string | null
          name: string
          notes?: string | null
          payment_terms_id?: number | null
          preferred_language?: string | null
          status?: string | null
          title?: string | null
          type: string
          uid?: string | null
          updated_at?: string | null
          user_id?: number | null
          vat_number?: string | null
          zefix_id?: string | null
        }
        Update: {
          ahv_number?: string | null
          assigned_salesperson_id?: number | null
          birth_date?: string | null
          bo_addr_id?: string | null
          bo_addr_number?: string | null
          bo_addr_searching?: string | null
          bo_login?: string | null
          bo_password?: string | null
          che?: string | null
          created_at?: string | null
          created_by_id?: number | null
          discount_group?: string | null
          first_name?: string | null
          function?: string | null
          gender?: string | null
          id?: never
          industry?: string | null
          is_active?: boolean | null
          is_blocked?: boolean | null
          is_employee?: boolean | null
          last_name?: string | null
          legal_name?: string | null
          name?: string
          notes?: string | null
          payment_terms_id?: number | null
          preferred_language?: string | null
          status?: string | null
          title?: string | null
          type?: string
          uid?: string | null
          updated_at?: string | null
          user_id?: number | null
          vat_number?: string | null
          zefix_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_assigned_salesperson_id_fkey"
            columns: ["assigned_salesperson_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contacts_payment_terms"
            columns: ["payment_terms_id"]
            isOneToOne: false
            referencedRelation: "contact_payment_terms"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_rates: {
        Row: {
          created_at: string | null
          from_currency: string
          id: number
          rate: number
          to_currency: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_currency: string
          id?: never
          rate: number
          to_currency: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_currency?: string
          id?: never
          rate?: number
          to_currency?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      defect_reports: {
        Row: {
          created_at: string | null
          description: string
          id: number
          project_item_id: number
          status: Database["public"]["Enums"]["defect_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: never
          project_item_id: number
          status?: Database["public"]["Enums"]["defect_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: never
          project_item_id?: number
          status?: Database["public"]["Enums"]["defect_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "defect_reports_project_item_id_fkey"
            columns: ["project_item_id"]
            isOneToOne: false
            referencedRelation: "project_items"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      goose_db_version: {
        Row: {
          id: number
          is_applied: boolean
          tstamp: string | null
          version_id: number
        }
        Insert: {
          id?: never
          is_applied: boolean
          tstamp?: string | null
          version_id: number
        }
        Update: {
          id?: never
          is_applied?: boolean
          tstamp?: string | null
          version_id?: number
        }
        Relationships: []
      }
      icon_articles: {
        Row: {
          article_id: number
          created_at: string | null
          icon_id: number
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          article_id: number
          created_at?: string | null
          icon_id: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          article_id?: number
          created_at?: string | null
          icon_id?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "icon_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_articles_icon_id_fkey"
            columns: ["icon_id"]
            isOneToOne: false
            referencedRelation: "icons"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_categories: {
        Row: {
          created_at: string | null
          id: number
          name_de: string | null
          name_en: string | null
          name_fr: string | null
          name_it: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          name_de?: string | null
          name_en?: string | null
          name_fr?: string | null
          name_it?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          name_de?: string | null
          name_en?: string | null
          name_fr?: string | null
          name_it?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      icon_icon_categories: {
        Row: {
          created_at: string | null
          icon_category_id: number
          icon_id: number
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon_category_id: number
          icon_id: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon_category_id?: number
          icon_id?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "icon_icon_categories_icon_category_id_fkey"
            columns: ["icon_category_id"]
            isOneToOne: false
            referencedRelation: "icon_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_icon_categories_icon_id_fkey"
            columns: ["icon_id"]
            isOneToOne: false
            referencedRelation: "icons"
            referencedColumns: ["id"]
          },
        ]
      }
      icons: {
        Row: {
          created_at: string | null
          description_de: string | null
          description_en: string | null
          description_fr: string | null
          description_it: string | null
          id: number
          image_path: string
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_it?: string | null
          id?: never
          image_path: string
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_de?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_it?: string | null
          id?: never
          image_path?: string
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventories: {
        Row: {
          bo_id: number | null
          company_name: string | null
          country: string | null
          created_at: string | null
          created_by_id: number | null
          id: number
          inventory_number: string | null
          inventory_type: number
          is_active: boolean
          location: string | null
          name: string | null
          post_code: string | null
          street_number: string | null
          telephone: string | null
          updated_at: string | null
          updated_by_id: number | null
          zusatz: string | null
        }
        Insert: {
          bo_id?: number | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          inventory_number?: string | null
          inventory_type?: number
          is_active?: boolean
          location?: string | null
          name?: string | null
          post_code?: string | null
          street_number?: string | null
          telephone?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
          zusatz?: string | null
        }
        Update: {
          bo_id?: number | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          inventory_number?: string | null
          inventory_type?: number
          is_active?: boolean
          location?: string | null
          name?: string | null
          post_code?: string | null
          street_number?: string | null
          telephone?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
          zusatz?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventories_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventories_updated_by_id_fkey"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_log_sync_statuses: {
        Row: {
          completed_time: string | null
          created_at: string | null
          created_by_id: number | null
          id: number
          remarks: string
          start_time: string | null
          sync_status: string
        }
        Insert: {
          completed_time?: string | null
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          remarks: string
          start_time?: string | null
          sync_status?: string
        }
        Update: {
          completed_time?: string | null
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          remarks?: string
          start_time?: string | null
          sync_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_log_sync_statuses_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_logs: {
        Row: {
          article_id: number
          available: number
          bo_lager_id: number | null
          bo_mat_id: number | null
          created_at: string | null
          created_by_id: number | null
          default_log: boolean
          id: number
          inventory_id: number
          is_active: boolean
          max_stock: number
          min_stock: number
          order_quantity: number
          ordered: number
          remarks: string | null
          reserved: number
          storage_bin_location: string | null
          storage_location: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          article_id: number
          available?: number
          bo_lager_id?: number | null
          bo_mat_id?: number | null
          created_at?: string | null
          created_by_id?: number | null
          default_log?: boolean
          id?: never
          inventory_id: number
          is_active?: boolean
          max_stock?: number
          min_stock?: number
          order_quantity?: number
          ordered?: number
          remarks?: string | null
          reserved?: number
          storage_bin_location?: string | null
          storage_location?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          article_id?: number
          available?: number
          bo_lager_id?: number | null
          bo_mat_id?: number | null
          created_at?: string | null
          created_by_id?: number | null
          default_log?: boolean
          id?: never
          inventory_id?: number
          is_active?: boolean
          max_stock?: number
          min_stock?: number
          order_quantity?: number
          ordered?: number
          remarks?: string | null
          reserved?: number
          storage_bin_location?: string | null
          storage_location?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_logs_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_logs_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_logs_updated_by_id_fkey"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_sync_statuses: {
        Row: {
          completed_time: string | null
          created_at: string | null
          created_by_id: number | null
          id: number
          remarks: string
          start_time: string | null
          sync_status: string
        }
        Insert: {
          completed_time?: string | null
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          remarks: string
          start_time?: string | null
          sync_status?: string
        }
        Update: {
          completed_time?: string | null
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          remarks?: string
          start_time?: string | null
          sync_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_sync_statuses_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
        ]
      }
      l_numbers: {
        Row: {
          id: number
        }
        Insert: {
          id?: never
        }
        Update: {
          id?: never
        }
        Relationships: []
      }
      light_categories: {
        Row: {
          created_at: string | null
          created_by_id: number | null
          id: number
          is_active: boolean | null
          name_de: string | null
          name_en: string | null
          name_fr: string | null
          name_it: string | null
          sort_order: number | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          is_active?: boolean | null
          name_de?: string | null
          name_en?: string | null
          name_fr?: string | null
          name_it?: string | null
          sort_order?: number | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          is_active?: boolean | null
          name_de?: string | null
          name_en?: string | null
          name_fr?: string | null
          name_it?: string | null
          sort_order?: number | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "light_categories_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "light_categories_updated_by_id_fkey"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
        ]
      }
      light_families: {
        Row: {
          created_at: string | null
          created_by_id: number | null
          id: number
          is_active: boolean | null
          name_de: string | null
          name_en: string | null
          name_fr: string | null
          name_it: string | null
          sort_order: number | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          is_active?: boolean | null
          name_de?: string | null
          name_en?: string | null
          name_fr?: string | null
          name_it?: string | null
          sort_order?: number | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: number | null
          id?: never
          is_active?: boolean | null
          name_de?: string | null
          name_en?: string | null
          name_fr?: string | null
          name_it?: string | null
          sort_order?: number | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "light_families_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "light_families_updated_by_id_fkey"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturers: {
        Row: {
          created_at: string | null
          id: number
          man_address: string | null
          man_country: string | null
          man_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          man_address?: string | null
          man_country?: string | null
          man_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          man_address?: string | null
          man_country?: string | null
          man_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mapper_articles: {
        Row: {
          article_id: number
          created_at: string | null
          group_order: number | null
          mapper_id: number
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          article_id: number
          created_at?: string | null
          group_order?: number | null
          mapper_id: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          article_id?: number
          created_at?: string | null
          group_order?: number | null
          mapper_id?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mapper_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mapper_articles_mapper_id_fkey"
            columns: ["mapper_id"]
            isOneToOne: false
            referencedRelation: "mappers"
            referencedColumns: ["id"]
          },
        ]
      }
      mapper_column_configs: {
        Row: {
          article_number: boolean | null
          beam_angles: boolean | null
          colors: boolean | null
          created_at: string | null
          cri: boolean | null
          delivery: boolean | null
          efficiency: boolean | null
          finish: boolean | null
          length: boolean | null
          lixe_color: boolean | null
          luminaire_flux: boolean | null
          mapper_id: number
          power: boolean | null
          price: boolean | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          article_number?: boolean | null
          beam_angles?: boolean | null
          colors?: boolean | null
          created_at?: string | null
          cri?: boolean | null
          delivery?: boolean | null
          efficiency?: boolean | null
          finish?: boolean | null
          length?: boolean | null
          lixe_color?: boolean | null
          luminaire_flux?: boolean | null
          mapper_id: number
          power?: boolean | null
          price?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          article_number?: boolean | null
          beam_angles?: boolean | null
          colors?: boolean | null
          created_at?: string | null
          cri?: boolean | null
          delivery?: boolean | null
          efficiency?: boolean | null
          finish?: boolean | null
          length?: boolean | null
          lixe_color?: boolean | null
          luminaire_flux?: boolean | null
          mapper_id?: number
          power?: boolean | null
          price?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mapper_icons: {
        Row: {
          created_at: string | null
          icon_id: number
          mapper_id: number
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icon_id: number
          mapper_id: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icon_id?: number
          mapper_id?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mapper_icons_icon_id_fkey"
            columns: ["icon_id"]
            isOneToOne: false
            referencedRelation: "icons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mapper_icons_mapper_id_fkey"
            columns: ["mapper_id"]
            isOneToOne: false
            referencedRelation: "mappers"
            referencedColumns: ["id"]
          },
        ]
      }
      mapper_mappers: {
        Row: {
          created_at: string | null
          mapper_children_id: number
          mapper_id: number
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          mapper_children_id: number
          mapper_id: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          mapper_children_id?: number
          mapper_id?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mapper_mappers_mapper_children_id_fkey"
            columns: ["mapper_children_id"]
            isOneToOne: false
            referencedRelation: "mappers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mapper_mappers_mapper_id_fkey"
            columns: ["mapper_id"]
            isOneToOne: false
            referencedRelation: "mappers"
            referencedColumns: ["id"]
          },
        ]
      }
      mappers: {
        Row: {
          a4_a_media_id: number | null
          a4_b_media_id: number | null
          a4a_media_text_de: string | null
          a4a_media_text_en: string | null
          a4a_media_text_fr: string | null
          a4a_media_text_it: string | null
          a4b_media_text_de: string | null
          a4b_media_text_en: string | null
          a4b_media_text_fr: string | null
          a4b_media_text_it: string | null
          application_media_id: number | null
          application_media_text_de: string | null
          application_media_text_en: string | null
          application_media_text_fr: string | null
          application_media_text_it: string | null
          article_number: boolean | null
          beam_angles: boolean | null
          color_options: Json | null
          colors: boolean | null
          created_at: string | null
          cri: boolean | null
          default_true: boolean | null
          delivery: boolean | null
          description: boolean | null
          diameter: boolean | null
          efficiency: boolean | null
          finish: boolean | null
          finish_options: Json | null
          group_text: string | null
          head_less: boolean | null
          hero_media_id: number | null
          hero_media_text_de: string | null
          hero_media_text_en: string | null
          hero_media_text_fr: string | null
          hero_media_text_it: string | null
          id: number
          is_full_width_hero: boolean | null
          label_text: string | null
          length: boolean | null
          lixe_color: boolean | null
          luminaire_flux: boolean | null
          media_flag: boolean | null
          optional: boolean | null
          path_text: string | null
          power: boolean | null
          price: boolean | null
          required: boolean | null
          sorting_field: string | null
          subtitle_de: string | null
          subtitle_en: string | null
          subtitle_fr: string | null
          subtitle_it: string | null
          sym_link_mappers: Json | null
          sym_linked_mapper_id: number | null
          tall_media_one_id: number | null
          text_description_de: string | null
          text_description_en: string | null
          text_description_fr: string | null
          text_description_it: string | null
          text_right_de: string | null
          text_right_en: string | null
          text_right_fr: string | null
          text_right_it: string | null
          title_de: string | null
          title_en: string | null
          title_fr: string | null
          title_it: string | null
          updated_at: string | null
        }
        Insert: {
          a4_a_media_id?: number | null
          a4_b_media_id?: number | null
          a4a_media_text_de?: string | null
          a4a_media_text_en?: string | null
          a4a_media_text_fr?: string | null
          a4a_media_text_it?: string | null
          a4b_media_text_de?: string | null
          a4b_media_text_en?: string | null
          a4b_media_text_fr?: string | null
          a4b_media_text_it?: string | null
          application_media_id?: number | null
          application_media_text_de?: string | null
          application_media_text_en?: string | null
          application_media_text_fr?: string | null
          application_media_text_it?: string | null
          article_number?: boolean | null
          beam_angles?: boolean | null
          color_options?: Json | null
          colors?: boolean | null
          created_at?: string | null
          cri?: boolean | null
          default_true?: boolean | null
          delivery?: boolean | null
          description?: boolean | null
          diameter?: boolean | null
          efficiency?: boolean | null
          finish?: boolean | null
          finish_options?: Json | null
          group_text?: string | null
          head_less?: boolean | null
          hero_media_id?: number | null
          hero_media_text_de?: string | null
          hero_media_text_en?: string | null
          hero_media_text_fr?: string | null
          hero_media_text_it?: string | null
          id?: never
          is_full_width_hero?: boolean | null
          label_text?: string | null
          length?: boolean | null
          lixe_color?: boolean | null
          luminaire_flux?: boolean | null
          media_flag?: boolean | null
          optional?: boolean | null
          path_text?: string | null
          power?: boolean | null
          price?: boolean | null
          required?: boolean | null
          sorting_field?: string | null
          subtitle_de?: string | null
          subtitle_en?: string | null
          subtitle_fr?: string | null
          subtitle_it?: string | null
          sym_link_mappers?: Json | null
          sym_linked_mapper_id?: number | null
          tall_media_one_id?: number | null
          text_description_de?: string | null
          text_description_en?: string | null
          text_description_fr?: string | null
          text_description_it?: string | null
          text_right_de?: string | null
          text_right_en?: string | null
          text_right_fr?: string | null
          text_right_it?: string | null
          title_de?: string | null
          title_en?: string | null
          title_fr?: string | null
          title_it?: string | null
          updated_at?: string | null
        }
        Update: {
          a4_a_media_id?: number | null
          a4_b_media_id?: number | null
          a4a_media_text_de?: string | null
          a4a_media_text_en?: string | null
          a4a_media_text_fr?: string | null
          a4a_media_text_it?: string | null
          a4b_media_text_de?: string | null
          a4b_media_text_en?: string | null
          a4b_media_text_fr?: string | null
          a4b_media_text_it?: string | null
          application_media_id?: number | null
          application_media_text_de?: string | null
          application_media_text_en?: string | null
          application_media_text_fr?: string | null
          application_media_text_it?: string | null
          article_number?: boolean | null
          beam_angles?: boolean | null
          color_options?: Json | null
          colors?: boolean | null
          created_at?: string | null
          cri?: boolean | null
          default_true?: boolean | null
          delivery?: boolean | null
          description?: boolean | null
          diameter?: boolean | null
          efficiency?: boolean | null
          finish?: boolean | null
          finish_options?: Json | null
          group_text?: string | null
          head_less?: boolean | null
          hero_media_id?: number | null
          hero_media_text_de?: string | null
          hero_media_text_en?: string | null
          hero_media_text_fr?: string | null
          hero_media_text_it?: string | null
          id?: never
          is_full_width_hero?: boolean | null
          label_text?: string | null
          length?: boolean | null
          lixe_color?: boolean | null
          luminaire_flux?: boolean | null
          media_flag?: boolean | null
          optional?: boolean | null
          path_text?: string | null
          power?: boolean | null
          price?: boolean | null
          required?: boolean | null
          sorting_field?: string | null
          subtitle_de?: string | null
          subtitle_en?: string | null
          subtitle_fr?: string | null
          subtitle_it?: string | null
          sym_link_mappers?: Json | null
          sym_linked_mapper_id?: number | null
          tall_media_one_id?: number | null
          text_description_de?: string | null
          text_description_en?: string | null
          text_description_fr?: string | null
          text_description_it?: string | null
          text_right_de?: string | null
          text_right_en?: string | null
          text_right_fr?: string | null
          text_right_it?: string | null
          title_de?: string | null
          title_en?: string | null
          title_fr?: string | null
          title_it?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mappers_a4_a_media_id_fkey"
            columns: ["a4_a_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mappers_a4_b_media_id_fkey"
            columns: ["a4_b_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mappers_application_media_id_fkey"
            columns: ["application_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mappers_hero_media_id_fkey"
            columns: ["hero_media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mappers_sym_linked_mapper_id_fkey"
            columns: ["sym_linked_mapper_id"]
            isOneToOne: false
            referencedRelation: "mappers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mappers_tall_media_one_id_fkey"
            columns: ["tall_media_one_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          content_type: string | null
          created_at: string | null
          cutout_path: string | null
          deleted_at: string | null
          deleted_by: number | null
          file_hash: string | null
          file_type: string | null
          id: number
          is_original: boolean | null
          language: string | null
          maximum_size_path: string | null
          medium_size_path: string | null
          original_name: string
          parent_id: number | null
          process_type: string | null
          processed_at: string | null
          processed_path: string | null
          processing_status: string | null
          size: number | null
          small_size_path: string | null
          storage_path: string
          thumbnail_path: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          cutout_path?: string | null
          deleted_at?: string | null
          deleted_by?: number | null
          file_hash?: string | null
          file_type?: string | null
          id?: never
          is_original?: boolean | null
          language?: string | null
          maximum_size_path?: string | null
          medium_size_path?: string | null
          original_name: string
          parent_id?: number | null
          process_type?: string | null
          processed_at?: string | null
          processed_path?: string | null
          processing_status?: string | null
          size?: number | null
          small_size_path?: string | null
          storage_path: string
          thumbnail_path?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          cutout_path?: string | null
          deleted_at?: string | null
          deleted_by?: number | null
          file_hash?: string | null
          file_type?: string | null
          id?: never
          is_original?: boolean | null
          language?: string | null
          maximum_size_path?: string | null
          medium_size_path?: string | null
          original_name?: string
          parent_id?: number | null
          process_type?: string | null
          processed_at?: string | null
          processed_path?: string | null
          processing_status?: string | null
          size?: number | null
          small_size_path?: string | null
          storage_path?: string
          thumbnail_path?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "media_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      media_articles: {
        Row: {
          article_id: number
          created_at: string | null
          function: string | null
          media_id: number
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          article_id: number
          created_at?: string | null
          function?: string | null
          media_id: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          article_id?: number
          created_at?: string | null
          function?: string | null
          media_id?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_articles_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_verifications: {
        Row: {
          code: string
          created_at: string
          expires_at: string
          id: number
          phone: string
          verified: boolean
        }
        Insert: {
          code: string
          created_at?: string
          expires_at: string
          id?: never
          phone: string
          verified?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string
          id?: never
          phone?: string
          verified?: boolean
        }
        Relationships: []
      }
      pim_users: {
        Row: {
          avatar: string | null
          created_at: string | null
          email: string
          id: number
          language: string
          name: string
          password: string
          role: string
          theme: string
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          email: string
          id?: never
          language?: string
          name: string
          password: string
          role: string
          theme?: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          email?: string
          id?: never
          language?: string
          name?: string
          password?: string
          role?: string
          theme?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_interactions: {
        Row: {
          article_id: number | null
          carousel_position: number | null
          constraint_suggestions: Json | null
          context: Json | null
          created_at: string
          defect_description: string | null
          dwell_ms: number | null
          id: number
          interaction_type: string
          llm_reply: string | null
          mara_scores: Json | null
          previous_interactions_in_session: number | null
          project_name: string | null
          quantity: number | null
          returned_article_ids: number[] | null
          search_query: string | null
          session_id: string
          user_id: string | null
          wishlist_name: string | null
        }
        Insert: {
          article_id?: number | null
          carousel_position?: number | null
          constraint_suggestions?: Json | null
          context?: Json | null
          created_at?: string
          defect_description?: string | null
          dwell_ms?: number | null
          id?: never
          interaction_type: string
          llm_reply?: string | null
          mara_scores?: Json | null
          previous_interactions_in_session?: number | null
          project_name?: string | null
          quantity?: number | null
          returned_article_ids?: number[] | null
          search_query?: string | null
          session_id: string
          user_id?: string | null
          wishlist_name?: string | null
        }
        Update: {
          article_id?: number | null
          carousel_position?: number | null
          constraint_suggestions?: Json | null
          context?: Json | null
          created_at?: string
          defect_description?: string | null
          dwell_ms?: number | null
          id?: never
          interaction_type?: string
          llm_reply?: string | null
          mara_scores?: Json | null
          previous_interactions_in_session?: number | null
          project_name?: string | null
          quantity?: number | null
          returned_article_ids?: number[] | null
          search_query?: string | null
          session_id?: string
          user_id?: string | null
          wishlist_name?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_role:
            | Database["public"]["Enums"]["user_business_role"]
            | null
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_approved: boolean | null
          language: string
          phone: string | null
          phone_verified: boolean | null
          updated_at: string | null
        }
        Insert: {
          business_role?:
            | Database["public"]["Enums"]["user_business_role"]
            | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_approved?: boolean | null
          language?: string
          phone?: string | null
          phone_verified?: boolean | null
          updated_at?: string | null
        }
        Update: {
          business_role?:
            | Database["public"]["Enums"]["user_business_role"]
            | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_approved?: boolean | null
          language?: string
          phone?: string | null
          phone_verified?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_items: {
        Row: {
          article_id: number
          created_at: string | null
          delivery_date: string | null
          delivery_status: string | null
          id: number
          project_id: number
          quantity: number
          unit_price_chf: number | null
        }
        Insert: {
          article_id: number
          created_at?: string | null
          delivery_date?: string | null
          delivery_status?: string | null
          id?: never
          project_id: number
          quantity?: number
          unit_price_chf?: number | null
        }
        Update: {
          article_id?: number
          created_at?: string | null
          delivery_date?: string | null
          delivery_status?: string | null
          id?: never
          project_id?: number
          quantity?: number
          unit_price_chf?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          id: number
          notes: string | null
          project_name: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          notes?: string | null
          project_name?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          notes?: string | null
          project_name?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      range_wise_flat_margins: {
        Row: {
          created_at: string | null
          id: number
          lower_limit: number
          margin: number
          updated_at: string | null
          upper_limit: number
        }
        Insert: {
          created_at?: string | null
          id?: never
          lower_limit: number
          margin: number
          updated_at?: string | null
          upper_limit: number
        }
        Update: {
          created_at?: string | null
          id?: never
          lower_limit?: number
          margin?: number
          updated_at?: string | null
          upper_limit?: number
        }
        Relationships: []
      }
      rejected_articles: {
        Row: {
          article_id: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          article_id: number
          created_at?: string
          id?: never
          user_id: string
        }
        Update: {
          article_id?: number
          created_at?: string
          id?: never
          user_id?: string
        }
        Relationships: []
      }
      retailers: {
        Row: {
          address: string | null
          bo_addr_id: number | null
          code: string | null
          country: string | null
          created_at: string | null
          discount: number | null
          id: number
          is_active: boolean | null
          margin: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          bo_addr_id?: number | null
          code?: string | null
          country?: string | null
          created_at?: string | null
          discount?: number | null
          id?: never
          is_active?: boolean | null
          margin?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          bo_addr_id?: number | null
          code?: string | null
          country?: string | null
          created_at?: string | null
          discount?: number | null
          id?: never
          is_active?: boolean | null
          margin?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          article_id: number
          bo_adr_id: number | null
          bo_id: number | null
          bo_mat_id: number | null
          created_at: string | null
          created_by_id: number | null
          default_supplier: boolean | null
          id: number
          minimum_order_quantity: number | null
          packaging_unit: number | null
          retailer_id: number
          supplier_base_price: string | null
          supplier_discount: string | null
          supplier_order_number: string | null
          supplier_price_currency: string | null
          updated_at: string | null
          updated_by_id: number | null
        }
        Insert: {
          article_id: number
          bo_adr_id?: number | null
          bo_id?: number | null
          bo_mat_id?: number | null
          created_at?: string | null
          created_by_id?: number | null
          default_supplier?: boolean | null
          id?: never
          minimum_order_quantity?: number | null
          packaging_unit?: number | null
          retailer_id: number
          supplier_base_price?: string | null
          supplier_discount?: string | null
          supplier_order_number?: string | null
          supplier_price_currency?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Update: {
          article_id?: number
          bo_adr_id?: number | null
          bo_id?: number | null
          bo_mat_id?: number | null
          created_at?: string | null
          created_by_id?: number | null
          default_supplier?: boolean | null
          id?: never
          minimum_order_quantity?: number | null
          packaging_unit?: number | null
          retailer_id?: number
          supplier_base_price?: string | null
          supplier_discount?: string | null
          supplier_order_number?: string | null
          supplier_price_currency?: string | null
          updated_at?: string | null
          updated_by_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_updated_by_id_fkey"
            columns: ["updated_by_id"]
            isOneToOne: false
            referencedRelation: "pim_users"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_events: {
        Row: {
          article_id: number | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          article_id?: number | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          article_id?: number | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          article_id: number
          created_at: string
          id: number
          wishlist_id: number
        }
        Insert: {
          article_id: number
          created_at?: string
          id?: never
          wishlist_id: number
        }
        Update: {
          article_id?: number
          created_at?: string
          id?: never
          wishlist_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          color: string
          created_at: string
          id: number
          name: string
          sort_order: number
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: never
          name?: string
          sort_order?: number
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: never
          name?: string
          sort_order?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      defect_status:
        | "reported"
        | "in_review"
        | "approved"
        | "rejected"
        | "resolved"
      project_status:
        | "draft"
        | "submitted"
        | "checking_delivery"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      user_business_role:
        | "architect"
        | "light_planner"
        | "electrician"
        | "dealer"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      defect_status: [
        "reported",
        "in_review",
        "approved",
        "rejected",
        "resolved",
      ],
      project_status: [
        "draft",
        "submitted",
        "checking_delivery",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      user_business_role: [
        "architect",
        "light_planner",
        "electrician",
        "dealer",
        "other",
      ],
    },
  },
} as const
