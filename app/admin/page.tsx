import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { AdminNoteForm } from "@/components/admin-note-form";
import { AdminNoteList } from "@/components/admin-list";
import { getAdminNotes, getAllCategories, getAllTags } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/login");

  const [notes, categories, tags] = await Promise.all([
    getAdminNotes(),
    getAllCategories(),
    getAllTags()
  ]);

  const editing = params.edit ? notes.find((note) => note.id === params.edit) : undefined;

  return (
    <AdminShell active="notes">
      <div className="grid" style={{ gap: 24 }}>
        <AdminNoteForm categories={categories} tags={tags} note={editing} />
        <AdminNoteList notes={notes} />
      </div>
    </AdminShell>
  );
}
