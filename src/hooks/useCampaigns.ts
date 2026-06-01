// hooks/useCampaigns.ts
// ============================================
// Campaign + Content hooks — Supabase integration
// ============================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Campaign, Content, CampaignFilters, ContentFilters } from "@/types";

// ===== FETCH CAMPAIGNS =====
export function useCampaigns(filters?: CampaignFilters) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("campaigns")
        .select(`
          *,
          clients(id, name, sector),
          campaign_platform_budgets(*),
          content(id, status, platform)
        `)
        .order("created_at", { ascending: false });

      if (filters?.clientId) query = query.eq("client_id", filters.clientId);
      if (filters?.status) query = query.eq("status", filters.status);
      if (filters?.platform) query = query.contains("platforms", [filters.platform]);

      const { data, error: err } = await query;
      if (err) throw err;

      const enriched = (data || []).map((c: Record<string, unknown>) => {
        const content = (c.content as Array<Record<string, unknown>>) || [];
        const platformBudgets = (c.campaign_platform_budgets as Array<Record<string, unknown>>) || [];
        const spend = platformBudgets.reduce((s: number, pb) => s + ((pb.spent as number) || 0), 0);
        const roi = spend > 0 && (c.orders as number) > 0
          ? Math.round(((c.orders as number) * 50 / spend) * 10) / 10
          : 0;
        const ctr = (c.impressions as number) > 0
          ? Math.round(((c.clicks as number) / (c.impressions as number)) * 1000) / 10
          : 0;
        const cpo = (c.orders as number) > 0 ? Math.round(spend / (c.orders as number)) : 0;

        return { ...c, spend, roi, ctr, cpo, platformBudgets, pendingContent: content.filter((ct) => ct.status === "pending_review").length };
      });

      setCampaigns(enriched as unknown as Campaign[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }, [filters?.clientId, filters?.status]);

  useEffect(() => { fetch(); }, [fetch]);

  return { campaigns, loading, error, refetch: fetch };
}

// ===== FETCH SINGLE CAMPAIGN =====
export function useCampaign(id: string) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    async function fetchCampaign() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("campaigns")
          .select(`*, clients(*), campaign_platform_budgets(*), content(*)`)
          .eq("id", id)
          .single();
        if (!error) setCampaign(data as unknown as Campaign);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaign();
  }, [id]);

  return { campaign, loading };
}

// ===== CREATE CAMPAIGN =====
export function useCreateCampaign() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function createCampaign(data: Partial<Campaign>): Promise<Campaign | null> {
    setLoading(true);
    try {
      const { data: result, error } = await supabase
        .from("campaigns")
        .insert([{
          client_id: data.clientId,
          name: data.name,
          goal: data.goal,
          platforms: data.platforms || [],
          budget_total: data.budgetTotal,
          budget_distribution: data.budgetDistribution || {},
          start_date: data.startDate,
          end_date: data.endDate,
          ai_notes: data.aiNotes,
          status: "draft",
        }])
        .select()
        .single();

      if (error) throw error;

      // Create platform budget records
      if (result && data.budgetDistribution) {
        const platformBudgets = Object.entries(data.budgetDistribution).map(([platform, budget]) => ({
          campaign_id: result.id,
          platform,
          budget_limit: budget,
          spent: 0,
        }));

        if (platformBudgets.length > 0) {
          await supabase.from("campaign_platform_budgets").insert(platformBudgets);
        }
      }

      return result as unknown as Campaign;
    } finally {
      setLoading(false);
    }
  }

  return { createCampaign, loading };
}

// ===== UPDATE CAMPAIGN STATUS =====
export function useUpdateCampaignStatus() {
  const supabase = createClient();

  async function updateStatus(id: string, status: Campaign["status"]): Promise<boolean> {
    const { error } = await supabase
      .from("campaigns")
      .update({ status })
      .eq("id", id);
    return !error;
  }

  return { updateStatus };
}

// ============================================
// CONTENT HOOKS
// ============================================

// ===== FETCH CONTENT =====
export function useContent(filters?: ContentFilters) {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("content")
        .select("*, campaigns(id, name, clients(id, name))")
        .order("created_at", { ascending: false });

      if (filters?.campaignId) query = query.eq("campaign_id", filters.campaignId);
      if (filters?.clientId) query = query.eq("client_id", filters.clientId);
      if (filters?.status) query = query.eq("status", filters.status);
      if (filters?.platform) query = query.eq("platform", filters.platform);

      const { data, error } = await query;
      if (!error) setContent((data || []) as unknown as Content[]);
    } finally {
      setLoading(false);
    }
  }, [filters?.campaignId, filters?.clientId, filters?.status]);

  useEffect(() => { fetch(); }, [fetch]);

  return { content, loading, refetch: fetch };
}

// ===== UPDATE CONTENT STATUS =====
export function useUpdateContentStatus() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function updateStatus(
    id: string,
    status: Content["status"],
    rejectionReason?: string
  ): Promise<boolean> {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("content")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          ...(rejectionReason ? { rejection_reason: rejectionReason } : {}),
        })
        .eq("id", id);
      return !error;
    } finally {
      setLoading(false);
    }
  }

  async function updateCaption(id: string, caption: string): Promise<boolean> {
    const { error } = await supabase
      .from("content")
      .update({ caption })
      .eq("id", id);
    return !error;
  }

  return { updateStatus, updateCaption, loading };
}

// ===== SAVE AI GENERATED CONTENT =====
export function useSaveContent() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function saveContent(items: Partial<Content>[]): Promise<boolean> {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("content")
        .insert(items.map((item) => ({
          campaign_id: item.campaignId,
          client_id: item.clientId,
          platform: item.platform,
          type: item.type,
          caption: item.caption,
          hashtags: item.hashtags || [],
          image_url: item.imageUrl,
          ai_prompt: item.aiPrompt,
          ai_score: item.aiScore,
          ai_feedback: item.aiFeedback || {},
          scheduled_at: item.scheduledAt,
          status: "draft",
        })));
      return !error;
    } finally {
      setLoading(false);
    }
  }

  return { saveContent, loading };
}
