"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUserRoadmap() {
  // FIX: Add 'await' here
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch nodes joined with user_progress
  const { data, error } = await supabase
    .from("user_progress")
    .select(`
      status,
      nodes (
        id,
        title,
        position_x,
        position_y,
        is_boss,
        order_index
      )
    `)
    .eq("user_id", user.id)
    .order("nodes(order_index)", { ascending: true });

  if (error || !data) return [];

  // Transform data for the UI
  return data.map((item: any) => ({
    id: item.nodes.id,
    title: item.nodes.title,
    x: item.nodes.position_x,
    y: item.nodes.position_y,
    status: item.status,
    isBoss: item.nodes.is_boss
  }));
}