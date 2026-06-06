// app/api/locations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // "cities" or "districts"
  const query = searchParams.get("q") || "";
  const cityName = searchParams.get("city") || "";

  try {
    if (type === "cities") {
      // جلب المدن مع البحث
      const { data, error } = await supabase
        .from("saudi_locations")
        .select("city_id, city_name")
        .ilike("city_name", `%${query}%`)
        .order("city_name")
        .limit(50);

      if (error) throw error;

      // إزالة التكرار
      const unique = Array.from(
        new Map(data?.map(r => [r.city_id, r.city_name]) ?? []).entries()
      ).map(([city_id, city_name]) => ({ city_id, city_name }));

      return NextResponse.json({ cities: unique });

    } else if (type === "districts") {
      // جلب أحياء مدينة معينة مع البحث
      if (!cityName) return NextResponse.json({ districts: [] });

      const { data, error } = await supabase
        .from("saudi_locations")
        .select("district_name")
        .eq("city_name", cityName)
        .ilike("district_name", `%${query}%`)
        .order("district_name")
        .limit(200);

      if (error) throw error;

      const districts = data?.map(r => r.district_name).filter(Boolean) ?? [];
      return NextResponse.json({ districts });
    }

    return NextResponse.json({ error: "نوع غير معروف" }, { status: 400 });

  } catch (error) {
    console.error("Locations API error:", error);
    return NextResponse.json({ error: "فشل جلب البيانات" }, { status: 500 });
  }
}
