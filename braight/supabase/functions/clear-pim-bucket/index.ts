import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let totalDeleted = 0;
    let hasMore = true;

    while (hasMore) {
      const { data: files, error: listError } = await supabase.storage
        .from("pim")
        .list("", { limit: 1000 });

      if (listError) throw listError;
      if (!files || files.length === 0) {
        hasMore = false;
        break;
      }

      // Separate folders and files
      const fileNames = files.filter(f => f.id).map(f => f.name);
      const folders = files.filter(f => !f.id).map(f => f.name);

      // Delete files at root level
      if (fileNames.length > 0) {
        const { error: delError } = await supabase.storage
          .from("pim")
          .remove(fileNames);
        if (delError) throw delError;
        totalDeleted += fileNames.length;
      }

      // Recursively delete folder contents
      for (const folder of folders) {
        totalDeleted += await deleteFolder(supabase, folder);
      }

      // Check if there's more
      if (files.length < 1000 && folders.length === 0) {
        hasMore = false;
      }
    }

    return new Response(
      JSON.stringify({ success: true, deleted: totalDeleted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function deleteFolder(supabase: any, prefix: string): Promise<number> {
  let deleted = 0;
  let hasMore = true;

  while (hasMore) {
    const { data: files, error } = await supabase.storage
      .from("pim")
      .list(prefix, { limit: 1000 });

    if (error) throw error;
    if (!files || files.length === 0) {
      hasMore = false;
      break;
    }

    const fileNames = files.filter((f: any) => f.id).map((f: any) => `${prefix}/${f.name}`);
    const folders = files.filter((f: any) => !f.id).map((f: any) => f.name);

    if (fileNames.length > 0) {
      const { error: delError } = await supabase.storage
        .from("pim")
        .remove(fileNames);
      if (delError) throw delError;
      deleted += fileNames.length;
    }

    for (const folder of folders) {
      deleted += await deleteFolder(supabase, `${prefix}/${folder}`);
    }

    if (files.length < 1000 && folders.length === 0) {
      hasMore = false;
    }
  }

  return deleted;
}
