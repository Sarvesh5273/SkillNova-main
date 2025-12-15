"use server";

import { createClient } from "@/lib/supabase/server";

export async function selectTrack(trackTitle: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // 1. Find the Track
  const { data: track } = await supabase
    .from("tracks")
    .select("id")
    .ilike("title", `%${trackTitle}%`)
    .single();

  if (!track) return { success: false, error: "Track not found" };

  // 2. Get Nodes
  const { data: nodes } = await supabase
    .from("nodes")
    .select("id, order_index")
    .eq("track_id", track.id);

  if (!nodes || nodes.length === 0) return { success: false, error: "No nodes found" };

  // 3. Prepare Entries (Don't Delete!)
  // We only set status="ACTIVE" for the first node if the user hasn't started it yet.
  const entries = nodes.map((node: { id: string; order_index: number }) => ({
    user_id: user.id,
    node_id: node.id,
    // Only set ACTIVE/LOCKED if it's a new entry. Existing entries retain their status via onConflict below.
    status: node.order_index === 1 ? "ACTIVE" : "LOCKED", 
  }));

  // 4. Safe Upsert
  // "ignoreDuplicates: true" ensures we don't overwrite existing progress (like 'COMPLETED')
  const { error } = await supabase
    .from("user_progress")
    .upsert(entries, { 
      onConflict: "user_id, node_id", 
      ignoreDuplicates: true 
    });

  if (error) {
    console.error("DB Error:", error);
    return { success: false, error: "Failed to save progress" };
  }

  return { success: true };
}