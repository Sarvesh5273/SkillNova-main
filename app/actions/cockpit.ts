"use server";

import { createClient } from "@/lib/supabase/server";

export async function getNodeDetails(nodeId: string) {
  const supabase = await createClient();

  // 1. Fetch Node Data (Crucial: Select video_url)
  const { data: node, error } = await supabase
    .from("nodes")
    .select("id, title, description, video_url")
    .eq("id", nodeId)
    .single();

  if (error || !node) {
    console.error("Error fetching node:", error);
    return null;
  }

  return { node };
}