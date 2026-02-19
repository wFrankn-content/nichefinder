import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/prompts?search_id=xxx
export async function GET(req: NextRequest) {
  const searchId = req.nextUrl.searchParams.get("search_id");

  if (!searchId) {
    return NextResponse.json(
      { error: "search_id is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("generated_prompts")
    .select("*")
    .eq("search_id", searchId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}
