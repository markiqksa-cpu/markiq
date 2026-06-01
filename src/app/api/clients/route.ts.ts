// app/api/clients/route.ts
// GET /api/clients — list all clients
// POST /api/clients — create new client

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const assignedTo = searchParams.get("assignedTo");

    let query = supabase
      .from("clients")
      .select(`*, strategies(id, summary), campaigns(id, status, spend)`)
      .order("created_at", { ascending: false });

    if (status) query = query.eq("status", status);
    if (search) query = query.ilike("name", `%${search}%`);
    if (assignedTo) query = query.eq("assigned_to", assignedTo);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ clients: data || [] });
  } catch (error) {
    return NextResponse.json({ error: "فشل في جلب العملاء" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await req.json();

    const { data, error } = await supabase
      .from("clients")
      .insert([{
        name: body.name,
        name_en: body.nameEn,
        sector: body.sector,
        city: body.city,
        neighborhood: body.neighborhood,
        target_areas: body.targetAreas || [],
        target_age: body.targetAge,
        target_gender: body.targetGender || "all",
        interests: body.interests || [],
        content_language: body.contentLanguage || "arabic_saudi",
        platforms: body.platforms || [],
        goals: body.goals || [],
        seo_keywords: body.seoKeywords || [],
        seo_level: body.seoLevel || "none",
        website_url: body.websiteUrl,
        instagram_url: body.instagramUrl,
        competitors: body.competitors || [],
        description: body.description,
        budget_monthly: body.budgetMonthly,
        status: "pending",
      }])
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabase.from("audit_log").insert([{
      action: "create_client",
      entity_type: "client",
      entity_id: data.id,
      new_value: { name: data.name },
    }]);

    return NextResponse.json({ client: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "فشل في إنشاء العميل" }, { status: 500 });
  }
}


// ============================================
// app/api/clients/[id]/route.ts
// GET /api/clients/:id — single client
// PUT /api/clients/:id — update client
// DELETE /api/clients/:id — delete client
// ============================================

