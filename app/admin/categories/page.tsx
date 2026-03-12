import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { CategoryManager } from "@/components/simple-manager";
import { getAllCategories } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const categories = await getAllCategories();

  return (
    <AdminShell active="categories">
      <CategoryManager items={categories} />
    </AdminShell>
  );
}
