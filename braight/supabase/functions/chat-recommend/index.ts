import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const lower = (message || '').toLowerCase().trim();

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Check if user sent comma-separated l_numbers for testing
    const lNumberPattern = /^[\d\s,]+$/;
    const isLNumberQuery = lNumberPattern.test(lower) && lower.length > 0;

    let products: any[] = [];

    if (isLNumberQuery) {
      // Parse l_numbers from comma-separated input
      const lNumbers = lower.split(',').map((s: string) => parseInt(s.trim(), 10)).filter((n: number) => !isNaN(n));

      if (lNumbers.length > 0) {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id, l_number, article_number, version,
            short_description_de, long_description_de,
            very_short_description_de, hero_image_url, is_current,
            article_classifications (
              inside, outside,
              luminaire_type_down_light, luminaire_type_surface_mounted,
              luminaire_type_recessed, luminaire_type_suspended,
              luminaire_type_outdoor, luminaire_type_high_bay_luminaire,
              luminaire_type_spot_light, luminaire_type_profile_luminaire,
              luminaire_type_acoustic_luminaire, luminaire_type_safety_lighting,
              mounting_method_wall, mounting_method_ceiling, mounting_method_floor
            ),
            article_character_profiles (
              cri, efficiency, controls_dali, controls_bluetooth,
              controls_on_off, controls_phase_section, controls_one_ten_v,
              light_color_colors, light_color_tw, light_color_rgb, light_color_rgbw,
              is_direct, is_indirect, direct_ugr, direct_beam_angle_one,
              direct_beam_angle_two, indirect_ugr, light_output, hour,
              housing_material, housing_ral_value
            ),
            article_technical_profiles (
              ip_rating, ik_rating, length, width, height, diameter, weight,
              electrical_power, electrical_current,
              electrical_voltage230, electrical_voltage24, electrical_voltage48,
              protection_class, min_temp, max_temp
            ),
            light_families ( name_de ),
            light_categories ( name_de ),
            manufacturers ( man_name )
          `)
          .in('l_number', lNumbers)
          .eq('is_current', true);

        if (error) throw error;
        products = data || [];
      }
    } else {
      // Keyword-based classification filter
      let query = supabase
        .from('articles')
        .select(`
          id, l_number, article_number, version,
          short_description_de, long_description_de,
          very_short_description_de, hero_image_url, is_current,
          article_classifications!inner (
            inside, outside,
            luminaire_type_down_light, luminaire_type_surface_mounted,
            luminaire_type_recessed, luminaire_type_suspended,
            luminaire_type_outdoor, luminaire_type_high_bay_luminaire,
            luminaire_type_spot_light, luminaire_type_profile_luminaire,
            luminaire_type_acoustic_luminaire, luminaire_type_safety_lighting,
            mounting_method_wall, mounting_method_ceiling, mounting_method_floor
          ),
          article_character_profiles (
            cri, efficiency, controls_dali, controls_bluetooth,
            controls_on_off, controls_phase_section, controls_one_ten_v,
            light_color_colors, light_color_tw, light_color_rgb, light_color_rgbw,
            is_direct, is_indirect, direct_ugr, direct_beam_angle_one,
            direct_beam_angle_two, indirect_ugr, light_output, hour,
            housing_material, housing_ral_value
          ),
          article_technical_profiles (
            ip_rating, ik_rating, length, width, height, diameter, weight,
            electrical_power, electrical_current,
            electrical_voltage230, electrical_voltage24, electrical_voltage48,
            protection_class, min_temp, max_temp
          ),
          light_families ( name_de ),
          light_categories ( name_de ),
          manufacturers ( man_name )
        `)
        .eq('is_current', true);

      if (lower.includes('büro') || lower.includes('office') || lower.includes('konferenz')) {
        query = query.eq('article_classifications.inside', true);
      } else if (lower.includes('aussen') || lower.includes('outdoor') || lower.includes('garten')) {
        query = query.eq('article_classifications.outside', true);
      } else if (lower.includes('halle') || lower.includes('industrie') || lower.includes('warehouse')) {
        query = query.eq('article_classifications.luminaire_type_high_bay_luminaire', true);
      } else if (lower.includes('downlight') || lower.includes('einbau')) {
        query = query.eq('article_classifications.luminaire_type_down_light', true);
      } else if (lower.includes('pendel') || lower.includes('hängend') || lower.includes('suspended')) {
        query = query.eq('article_classifications.luminaire_type_suspended', true);
      } else if (lower.includes('spot') || lower.includes('strahler')) {
        query = query.eq('article_classifications.luminaire_type_spot_light', true);
      } else if (lower.includes('wand') || lower.includes('fassade')) {
        query = query.eq('article_classifications.mounting_method_wall', true);
      } else if (lower.includes('notlicht') || lower.includes('notbeleuchtung') || lower.includes('safety')) {
        query = query.eq('article_classifications.luminaire_type_safety_lighting', true);
      } else if (lower.includes('akustik') || lower.includes('acoustic')) {
        query = query.eq('article_classifications.luminaire_type_acoustic_luminaire', true);
      } else if (lower.includes('profil') || lower.includes('lichtband') || lower.includes('profile')) {
        query = query.eq('article_classifications.luminaire_type_profile_luminaire', true);
      }

      const { data, error } = await query.order('id').limit(20);
      if (error) throw error;
      products = data || [];
    }

    // Enrich products with storage URLs for media
    const enriched = await Promise.all(products.map(async (p: any) => {
      const lNum = p.l_number;
      const artNum = p.article_number;

      // Build hero image URL from storage using hero_image_url path
      let hero_storage_url: string | null = null;
      if (p.hero_image_url) {
        // hero_image_url is like "images/flpl333round_opal_lp.jpg"
        const storagePath = `opt/LO/LOwebserver/${p.hero_image_url}`;
        const { data: urlData } = supabase.storage
          .from('pim')
          .getPublicUrl(storagePath);
        hero_storage_url = urlData?.publicUrl || null;
      }

      // Get media files for this article (by l_number subfolder)
      const mediaFiles: any[] = [];
      const { data: mediaList } = await supabase.storage
        .from('pim')
        .list(`opt/LO/LOwebserver/media/${lNum}`);
      if (mediaList) {
        for (const f of mediaList.slice(0, 20)) {
          const { data: urlData } = supabase.storage
            .from('pim')
            .getPublicUrl(`opt/LO/LOwebserver/media/${lNum}/${f.name}`);
          mediaFiles.push({
            path: f.name,
            storage_url: urlData?.publicUrl || '',
            media_type: f.name.split('.').pop()?.toLowerCase(),
          });
        }
      }

      // Find datasheets (by article_number)
      const datasheets: string[] = [];
      const { data: dsFiles } = await supabase.storage
        .from('pim')
        .list('opt/LO/LOwebserver/datasheets', { search: artNum });
      if (dsFiles) {
        for (const f of dsFiles.filter((f: any) => f.name.toLowerCase().includes(artNum.toLowerCase())).slice(0, 5)) {
          const { data: urlData } = supabase.storage
            .from('pim')
            .getPublicUrl(`opt/LO/LOwebserver/datasheets/${f.name}`);
          datasheets.push(urlData?.publicUrl || '');
        }
      }

      // Find light diagrams
      const light_diagrams: string[] = [];
      const { data: ldFiles } = await supabase.storage
        .from('pim')
        .list('opt/LO/LOwebserver/light-diagrams', { search: artNum });
      if (ldFiles) {
        for (const f of ldFiles.filter((f: any) => f.name.toLowerCase().includes(artNum.toLowerCase())).slice(0, 5)) {
          const { data: urlData } = supabase.storage
            .from('pim')
            .getPublicUrl(`opt/LO/LOwebserver/light-diagrams/${f.name}`);
          light_diagrams.push(urlData?.publicUrl || '');
        }
      }

      // Find mounting instructions
      const mounting_instructions: string[] = [];
      const { data: miFiles } = await supabase.storage
        .from('pim')
        .list('opt/LO/LOwebserver/mounting-instructions', { search: String(lNum) });
      if (miFiles) {
        for (const f of miFiles.filter((f: any) => f.name.includes(String(lNum))).slice(0, 3)) {
          const { data: urlData } = supabase.storage
            .from('pim')
            .getPublicUrl(`opt/LO/LOwebserver/mounting-instructions/${f.name}`);
          mounting_instructions.push(urlData?.publicUrl || '');
        }
      }

      // Find drawings
      const drawings: string[] = [];
      const { data: drFiles } = await supabase.storage
        .from('pim')
        .list('opt/LO/LOwebserver/drawings', { search: String(lNum) });
      if (drFiles) {
        for (const f of drFiles.filter((f: any) => f.name.includes(String(lNum))).slice(0, 3)) {
          const { data: urlData } = supabase.storage
            .from('pim')
            .getPublicUrl(`opt/LO/LOwebserver/drawings/${f.name}`);
          drawings.push(urlData?.publicUrl || '');
        }
      }

      return {
        ...p,
        classification: p.article_classifications,
        character_profile: p.article_character_profiles,
        technical_profile: p.article_technical_profiles,
        light_family: p.light_families,
        light_category: p.light_categories,
        manufacturer: p.manufacturers,
        hero_storage_url,
        media: mediaFiles,
        datasheets,
        light_diagrams,
        mounting_instructions,
        drawings,
      };
    }));

    const count = enriched.length;
    const reply = isLNumberQuery
      ? count > 0
        ? `Ich habe **${count} Artikel** für die angegebenen L-Nummern gefunden.`
        : `Keine Artikel mit diesen L-Nummern gefunden. Stelle sicher, dass die Daten importiert sind.`
      : count > 0
        ? `Ich habe **${count} Produkte** gefunden, die zu deiner Anfrage passen. Klicke auf eine Karte für mehr Details!`
        : `Leider habe ich keine passenden Produkte gefunden. Beschreibe genauer, was du suchst — Raum, Zweck oder Stimmung!`;

    return new Response(JSON.stringify({ reply, products: enriched }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
