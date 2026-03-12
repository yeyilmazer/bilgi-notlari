import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { TagManager } from "@/components/simple-manager";
import { getAllTags } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function AdminTagsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const tags = await getAllTags();

  return (
    <AdminShell active="tags">
      <TagManager items={tags} />
    </AdminShell>
  );
}
