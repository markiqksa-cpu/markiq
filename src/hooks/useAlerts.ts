// hooks/useAlerts.ts
// ============================================
// Alerts hooks — Supabase integration
// ============================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Alert, AlertFilters } from "@/types";

export function useAlerts(filters?: AlertFilters) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("alerts")
        .select(`
          *,
          clients(id, name),
          campaigns(id, name)
        `)
        .eq("is_resolved", false)
        .order("created_at", { ascending: false });

      if (filters?.clientId) query = query.eq("client_id", filters.clientId);
      if (filters?.priority) query = query.eq("priority", filters.priority);
      if (filters?.isRead !== undefined) query = query.eq("is_read", filters.isRead);

      const { data, error } = await query;
      if (!error) {
        setAlerts((data || []) as unknown as Alert[]);
        setUnreadCount((data || []).filter((a: Record<string, unknown>) => !a.is_read).length);
      }
    } finally {
      setLoading(false);
    }
  }, [filters?.clientId, filters?.priority]);

  useEffect(() => { fetch(); }, [fetch]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("alerts-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, () => fetch())
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "alerts" }, () => fetch())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function markRead(id: string) {
    await supabase.from("alerts").update({ is_read: true }).eq("id", id);
    fetch();
  }

  async function markAllRead() {
    await supabase.from("alerts").update({ is_read: true }).eq("is_resolved", false);
    fetch();
  }

  async function resolve(id: string) {
    await supabase.from("alerts").update({ is_resolved: true, resolved_at: new Date().toISOString() }).eq("id", id);
    fetch();
  }

  return { alerts, loading, unreadCount, markRead, markAllRead, resolve, refetch: fetch };
}

// ============================================
// hooks/useAI.ts
// AI integration hooks
// ============================================

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate strategy via API route
  async function generateStrategy(clientData: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientData }),
      });
      if (!res.ok) throw new Error("فشل في توليد الاستراتيجية");
      const { strategy } = await res.json();
      return strategy;
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Generate content via API route
  async function generateContent(params: {
    clientName: string;
    platform: string;
    contentType: string;
    goal: string;
    language?: string;
    notes?: string;
    occasion?: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("فشل في توليد المحتوى");
      const { content } = await res.json();
      return content;
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Chat with AI assistant
  async function chat(
    message: string,
    history: Array<{ role: string; content: string }>,
    clientContext?: Record<string, unknown>
  ) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, clientContext }),
      });
      if (!res.ok) throw new Error("فشل في الاتصال بـ AI");
      const { reply } = await res.json();
      return reply as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Optimize budget allocation
  async function optimizeBudget(params: {
    totalBudget: number;
    platforms: string[];
    currentPerformance: Record<string, { roi: number; spend: number }>;
    goal: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("فشل في تحليل الميزانية");
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { generateStrategy, generateContent, chat, optimizeBudget, loading, error };
}

// ============================================
// hooks/useDashboard.ts
// Dashboard stats hook
// ============================================

export function useDashboard() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [clientsRes, campaignsRes, alertsRes, tasksRes] = await Promise.all([
          supabase.from("clients").select("id, status, budget_monthly").eq("status", "active"),
          supabase.from("campaigns").select("id, status, spend, orders, impressions").eq("status", "active"),
          supabase.from("alerts").select("id, priority").eq("is_resolved", false),
          supabase.from("tasks").select("id, status, due_at").eq("status", "todo"),
        ]);

        const activeClients = (clientsRes.data || []).length;
        const activeCampaigns = (campaignsRes.data || []).length;
        const totalRevenue = (clientsRes.data || []).reduce(
          (s: number, c: Record<string, unknown>) => s + ((c.budget_monthly as number) || 0), 0
        );
        const urgentAlerts = (alertsRes.data || []).filter(
          (a: Record<string, unknown>) => a.priority === "urgent"
        ).length;

        setStats({
          activeClients,
          activeCampaigns,
          monthlyRevenue: totalRevenue,
          urgentAlerts,
          todayTasks: (tasksRes.data || []).length,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading };
}
