import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/types/product";

export interface ProjectItem {
  id: number;
  article_id: number;
  quantity: number;
  unit_price_chf: number | null;
  delivery_status: string;
}

export interface ProjectWithItems {
  id: number;
  project_name: string;
  status: string;
  notes: string | null;
  created_at: string;
  items: ProjectItem[];
  article_ids: number[];
}

const PROJECT_COLORS = [
  '#C8932A', '#A0A0A0', '#6B8E8E', '#8B6BA0', '#6B8E6B', '#C87A5A',
];

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectWithItems[]>([]);

  const loadProjects = useCallback(async () => {
    if (!user) { setProjects([]); return; }
    const { data: projs } = await supabase
      .from("projects")
      .select("id, project_name, status, notes, created_at")
      .eq("user_id", user.id)
      .in("status", ["draft"] as any)
      .order("created_at", { ascending: true });

    if (!projs) { setProjects([]); return; }

    const result: ProjectWithItems[] = [];
    for (const p of projs) {
      const { data: items } = await supabase
        .from("project_items")
        .select("id, article_id, quantity, unit_price_chf, delivery_status")
        .eq("project_id", p.id);
      result.push({
        ...p,
        project_name: p.project_name || `Projekt ${result.length + 1}`,
        status: p.status || 'draft',
        items: items || [],
        article_ids: (items || []).map(i => i.article_id),
      });
    }
    setProjects(result);
  }, [user]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const createProject = useCallback(async (name?: string) => {
    if (!user) return;
    const n = name || `Projekt ${projects.length + 1}`;
    await supabase.from("projects").insert({
      user_id: user.id,
      project_name: n,
      status: "draft" as any,
    });
    await loadProjects();
  }, [user, projects.length, loadProjects]);

  const renameProject = useCallback(async (projectId: number, name: string) => {
    if (!user) return;
    await supabase.from("projects").update({ project_name: name }).eq("id", projectId);
    await loadProjects();
  }, [user, loadProjects]);

  const deleteProject = useCallback(async (projectId: number) => {
    if (!user) return;
    await supabase.from("project_items").delete().eq("project_id", projectId);
    await supabase.from("projects").delete().eq("id", projectId);
    await loadProjects();
  }, [user, loadProjects]);

  const addToProject = useCallback(async (projectId: number, articleId: number, qty = 1) => {
    if (!user) return;
    const proj = projects.find(p => p.id === projectId);
    const existing = proj?.items.find(i => i.article_id === articleId);
    if (existing) {
      await supabase.from("project_items").update({ quantity: existing.quantity + qty }).eq("id", existing.id);
    } else {
      const product = await supabase.from("articles").select("price_sp_chf").eq("id", articleId).single();
      await supabase.from("project_items").insert({
        project_id: projectId,
        article_id: articleId,
        quantity: qty,
        unit_price_chf: product.data?.price_sp_chf ? parseFloat(product.data.price_sp_chf) : null,
      });
    }
    await loadProjects();
  }, [user, projects, loadProjects]);

  const updateItemQuantity = useCallback(async (itemId: number, quantity: number) => {
    if (!user) return;
    await supabase.from("project_items").update({ quantity }).eq("id", itemId);
    await loadProjects();
  }, [user, loadProjects]);

  const removeItem = useCallback(async (itemId: number) => {
    if (!user) return;
    await supabase.from("project_items").delete().eq("id", itemId);
    await loadProjects();
  }, [user, loadProjects]);

  const submitProject = useCallback(async (projectId: number) => {
    if (!user) return;
    await supabase.from("projects").update({ status: "submitted" as any }).eq("id", projectId);
    await loadProjects();
  }, [user, loadProjects]);

  const getColor = (index: number) => PROJECT_COLORS[index % PROJECT_COLORS.length];

  return {
    projects, createProject, renameProject, deleteProject,
    addToProject, updateItemQuantity, removeItem, submitProject,
    getColor, loadProjects,
  };
}
