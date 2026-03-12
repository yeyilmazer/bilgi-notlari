import { createClient } from "@/lib/supabase/server";
import type { Category, Footnote, Note, NoteWithRelations, Tag } from "@/types";

type NoteRow = Note;
type CategoryRow = Category;
type TagRow = Tag;
type FootnoteRow = Footnote;

export async function getPublishedNotes(search?: string): Promise<NoteWithRelations[]> {
  const supabase = await createClient();

  let query = supabase
    .from("notes")
    .select("id,title,slug,excerpt,content_html,status,published_date,is_favorite,views,created_at,updated_at")
    .eq("status", "published")
    .order("published_date", { ascending: false });

  if (search?.trim()) {
    query = query.or(`title.ilike.%${search.trim()}%,excerpt.ilike.%${search.trim()}%,content_html.ilike.%${search.trim()}%`);
  }

  const { data: notes, error } = await query;
  if (error) throw error;

  return hydrateNotes((notes ?? []) as NoteRow[]);
}

export async function getPublishedNoteBySlug(slug: string): Promise<NoteWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id,title,slug,excerpt,content_html,status,published_date,is_favorite,views,created_at,updated_at")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const hydrated = await hydrateNotes([data as NoteRow]);
  return hydrated[0] ?? null;
}

export async function getAdminNotes(): Promise<NoteWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id,title,slug,excerpt,content_html,status,published_date,is_favorite,views,created_at,updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return hydrateNotes((data ?? []) as NoteRow[]);
}

export async function getAllCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as CategoryRow[];
}

export async function getAllTags(): Promise<TagRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("*").order("name");
  if (error) throw error;
  return (data ?? []) as TagRow[];
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as CategoryRow | null) ?? null;
}

export async function getTagBySlug(slug: string): Promise<TagRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tags").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as TagRow | null) ?? null;
}

export async function getPublishedNotesByCategory(categoryId: string): Promise<NoteWithRelations[]> {
  const supabase = await createClient();
  const { data: joins, error } = await supabase
    .from("note_categories")
    .select("note_id")
    .eq("category_id", categoryId);

  if (error) throw error;
  const ids = (joins ?? []).map((j) => j.note_id);
  if (!ids.length) return [];

  const { data: notes, error: notesError } = await supabase
    .from("notes")
    .select("id,title,slug,excerpt,content_html,status,published_date,is_favorite,views,created_at,updated_at")
    .in("id", ids)
    .eq("status", "published")
    .order("published_date", { ascending: false });

  if (notesError) throw notesError;
  return hydrateNotes((notes ?? []) as NoteRow[]);
}

export async function getPublishedNotesByTag(tagId: string): Promise<NoteWithRelations[]> {
  const supabase = await createClient();
  const { data: joins, error } = await supabase
    .from("note_tags")
    .select("note_id")
    .eq("tag_id", tagId);

  if (error) throw error;
  const ids = (joins ?? []).map((j) => j.note_id);
  if (!ids.length) return [];

  const { data: notes, error: notesError } = await supabase
    .from("notes")
    .select("id,title,slug,excerpt,content_html,status,published_date,is_favorite,views,created_at,updated_at")
    .in("id", ids)
    .eq("status", "published")
    .order("published_date", { ascending: false });

  if (notesError) throw notesError;
  return hydrateNotes((notes ?? []) as NoteRow[]);
}

async function hydrateNotes(notes: NoteRow[]): Promise<NoteWithRelations[]> {
  if (!notes.length) return [];

  const supabase = await createClient();
  const noteIds = notes.map((n) => n.id);

  const [{ data: noteCategories, error: ncError }, { data: noteTags, error: ntError }, { data: footnotes, error: fError }, { data: categories, error: cError }, { data: tags, error: tError }] = await Promise.all([
    supabase.from("note_categories").select("note_id, category_id").in("note_id", noteIds),
    supabase.from("note_tags").select("note_id, tag_id").in("note_id", noteIds),
    supabase.from("footnotes").select("*").in("note_id", noteIds).order("sort_order"),
    supabase.from("categories").select("*"),
    supabase.from("tags").select("*")
  ]);

  if (ncError) throw ncError;
  if (ntError) throw ntError;
  if (fError) throw fError;
  if (cError) throw cError;
  if (tError) throw tError;

  const categoryMap = new Map((categories ?? []).map((c) => [c.id, c as CategoryRow]));
  const tagMap = new Map((tags ?? []).map((t) => [t.id, t as TagRow]));

  return notes.map((note) => {
    const linkedCategoryIds = (noteCategories ?? []).filter((row) => row.note_id === note.id).map((row) => row.category_id);
    const linkedTagIds = (noteTags ?? []).filter((row) => row.note_id === note.id).map((row) => row.tag_id);
    const linkedFootnotes = ((footnotes ?? []) as FootnoteRow[]).filter((row) => row.note_id === note.id).sort((a, b) => a.sort_order - b.sort_order);

    return {
      ...note,
      categories: linkedCategoryIds.map((id) => categoryMap.get(id)).filter(Boolean) as CategoryRow[],
      tags: linkedTagIds.map((id) => tagMap.get(id)).filter(Boolean) as TagRow[],
      footnotes: linkedFootnotes
    };
  });
}
