"use server";

import { createClient } from "@/lib/supabase/server";

export async function selectTrack(trackTitle: string) {
  // FIX 1: Add 'await' here because createClient is async
  const supabase = await createClient();
  
  // 1. Authenticate
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // 2. Find the Track ID (e.g., "The Creator")
  const { data: track } = await supabase
    .from("tracks")
    .select("id")
    .ilike("title", `%${trackTitle}%`)
    .single();

  if (!track) return { success: false, error: "Track not found" };

  // 3. Get all nodes for this track
  const { data: nodes } = await supabase
    .from("nodes")
    .select("id, order_index")
    .eq("track_id", track.id);

  if (!nodes || nodes.length === 0) return { success: false, error: "No nodes found" };

  // 4. Create Progress Entries
  // FIX 2: Explicitly type 'node' to avoid "implicitly has an 'any' type" error
  const entries = nodes.map((node: { id: string; order_index: number }) => ({
    user_id: user.id,
    node_id: node.id,
    status: node.order_index === 1 ? "ACTIVE" : "LOCKED",
  }));

  const { error } = await supabase
    .from("user_progress")
    .upsert(entries, { onConflict: "user_id, node_id" });

  if (error) {
    console.error("DB Error:", error);
    return { success: false, error: "Failed to save progress" };
  }

  return { success: true };
}