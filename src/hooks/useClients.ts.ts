// hooks/useClients.ts
// ============================================
// Client data hooks — Supabase integration
// ============================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import type { Client, ClientFilters, PaginatedResponse } from "@/types";

// ===== FETCH ALL CLIENTS =====
export function useClients(filters?: ClientFilters) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("clients")
        .select(`
          *,
          strategies(id, summary, kpi_orders_target, kpi_roi_target),
          campaigns(id, status, budget_total, spend)
        `)
        .order("created_at", { ascending: false });

      if (filters?.status) query = query.eq("status", filters.status);
      if (filters?.assignedTo) query = query.eq("assigned_to", filters.assignedTo);
      if (filters?.search) query = query.ilike("name", `%${filters.search}%`);

      const { data, error: err } = await query;
      if (err) throw err;

      // Calculate derived metrics
      const enriched = (data || []).map((c: Record<string, unknown>) => {
        const campaigns = (c.campaigns as Array<Record<string, unknown>>) || [];
        const activeCampaigns = campaigns.filter((camp) => camp.status === "active").length;
        const totalSpend = campaigns.reduce((s: number, camp) => s + ((camp.spend as number) || 0), 0);
        const totalBudget = campaigns.reduce((s: number, camp) => s + ((camp.budget_total as number) || 0), 0);
        const roi = totalSpend > 0 ? (totalBudget / totalSpend) : 0;

        return {
          ...c,
          activeCampaigns,
          totalSpend,
          roi: Math.round(roi * 10) / 10,
        };
      });

      setClients(enriched as unknown as Client[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }, [filters?.status, filters?.assignedTo, filters?.search]);

  useEffect(() => { fetch(); }, [fetch]);

  return { clients, loading, error, refetch: fetch };
}

// ===== FETCH SINGLE CLIENT =====
export function useClient(id: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  useEffect(() => {
    if (!id) return;

    async function fetchClient() {
      setLoading(true);
      try {
        const { data, error: err } = await supabase
          .from("clients")
          .select(`
            *,
            strategies(*),
            campaigns(
              *,
              campaign_platform_budgets(*),
              content(id, status, platform, type)
            ),
            contracts(*),
            invoices(*),
            client_cards(*)
          `)
          .eq("id", id)
          .single();

        if (err) throw err;
        setClient(data as unknown as Client);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [id]);

  return { client, loading, error };
}

// ===== CREATE CLIENT =====
export function useCreateClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  async function createClient(data: Partial<Client>): Promise<Client | null> {
    setLoading(true);
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from("clients")
        .insert([{
          name: data.name,
          name_en: data.nameEn,
          sector: data.sector,
          city: data.city,
          neighborhood: data.neighborhood,
          target_areas: data.targetAreas || [],
          target_age: data.targetAge,
          target_gender: data.targetGender || "all",
          interests: data.interests || [],
          content_language: data.contentLanguage || "arabic_saudi",
          platforms: data.platforms || [],
          goals: data.goals || [],
          seo_keywords: data.seoKeywords || [],
          seo_level: data.seoLevel || "none",
          website_url: data.websiteUrl,
          instagram_url: data.instagramUrl,
          competitors: data.competitors || [],
          description: data.description,
          budget_monthly: data.budgetMonthly,
          status: "pending",
        }])
        .select()
        .single();

      if (err) throw err;
      return result as unknown as Client;
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في إنشاء العميل");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createClient, loading, error };
}

// ===== UPDATE CLIENT =====
export function useUpdateClient() {
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseClient();

  async function updateClient(id: string, data: Partial<Client>): Promise<boolean> {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("clients")
        .update(data)
        .eq("id", id);

      return !error;
    } finally {
      setLoading(false);
    }
  }

  return { updateClient, loading };
}
