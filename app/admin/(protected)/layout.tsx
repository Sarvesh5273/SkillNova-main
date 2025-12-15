import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Check if user is logged in
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/admin/login");
  }

  // 2. Check Database Role (The Real Security Gate)
  // We check the database, NOT a hardcoded list in the browser
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/"); // Kick unauthorized users to home
  }

  // 3. Render the child page (Your Dashboard)
  return (
    <div className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
}