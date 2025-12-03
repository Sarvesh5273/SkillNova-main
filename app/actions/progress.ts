"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function completeNode(nodeId: string) {
  const supabase = await createClient();
  
  // 1. Get Current User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  // 2. Mark Current Node as COMPLETED
  const { error: updateError } = await supabase
    .from("user_progress")
    .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("node_id", nodeId);

  if (updateError) {
    console.error("Error completing node:", updateError);
    return { success: false, error: "Failed to update progress" };
  }

  // 3. Find Current Node Details (to get track_id & order_index)
  const { data: currentNode } = await supabase
    .from("nodes")
    .select("track_id, order_index")
    .eq("id", nodeId)
    .single();

  if (!currentNode) return { success: true }; // Progress saved, but logic ends here

  // 4. Find the NEXT Node
  const { data: nextNode } = await supabase
    .from("nodes")
    .select("id")
    .eq("track_id", currentNode.track_id)
    .eq("order_index", currentNode.order_index + 1)
    .single();

  // 5. Unlock Next Node (Set to ACTIVE)
  if (nextNode) {
    await supabase
      .from("user_progress")
      .upsert({
        user_id: user.id,
        node_id: nextNode.id,
        status: "ACTIVE"
      }, { onConflict: "user_id, node_id" });
  }

  // 6. Refresh Data
  revalidatePath("/dashboard");
  
  return { success: true };
}