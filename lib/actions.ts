'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function saveNoteAction(formData: FormData) {
  const admin = createAdminClient();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const contentHtml = String(formData.get("content_html") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as "draft" | "published";
  const publishedDate = String(formData.get("published_date") ?? "").trim() || null;
  const isFavorite = String(formData.get("is_favorite") ?? "") === "on";
  const categories = JSON.parse(String(formData.get("categories_json") ?? "[]")) as string[];
  const tags = JSON.parse(String(formData.get("tags_json") ?? "[]")) as string[];
  const footnotes = JSON.parse(String(formData.get("footnotes_json") ?? "[]")) as Array<{
    mode: "text" | "book";
    book?: string;
    volume?: string;
    page?: string;
    hadith_number?: string;
    note_text?: string;
  }>;

  if (!title || !contentHtml) {
    throw new Error("Başlık ve içerik zorunludur.");
  }

  if (!categories.length) {
    throw new Error("En az bir kategori seçmelisin.");
  }

  const slug = slugify(title);

  let noteId = id;

  if (id) {
    const { error } = await admin
      .from("notes")
      .update({
        title,
        slug,
        excerpt,
        content_html: contentHtml,
        status,
        published_date: publishedDate,
        is_favorite: isFavorite
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await admin
      .from("notes")
      .insert({
        title,
        slug,
        excerpt,
        content_html: contentHtml,
        status,
        published_date: publishedDate,
        is_favorite: isFavorite
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Not kaydedilemedi.");
    }

    noteId = data.id;
  }

  await admin.from("note_categories").delete().eq("note_id", noteId);
  await admin.from("note_tags").delete().eq("note_id", noteId);
  await admin.from("footnotes").delete().eq("note_id", noteId);

  if (categories.length) {
    const { error } = await admin.from("note_categories").insert(
      categories.map((categoryId) => ({
        note_id: noteId,
        category_id: categoryId
      }))
    );
    if (error) throw new Error(error.message);
  }

  if (tags.length) {
    const { error } = await admin.from("note_tags").insert(
      tags.map((tagId) => ({
        note_id: noteId,
        tag_id: tagId
      }))
    );
    if (error) throw new Error(error.message);
  }

  if (footnotes.length) {
    const { error } = await admin.from("footnotes").insert(
      footnotes.map((footnote, index) => ({
        note_id: noteId,
        sort_order: index + 1,
        mode: footnote.mode,
        book: footnote.book ?? null,
        volume: footnote.volume ?? null,
        page: footnote.page ?? null,
        hadith_number: footnote.hadith_number ?? null,
        note_text: footnote.note_text ?? null
      }))
    );
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/not/${slug}`);
}

export async function saveCategoryAction(formData: FormData) {
  const admin = createAdminClient();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) return;

  const payload = { name, slug: slugify(name) };

  if (id) {
    const { error } = await admin.from("categories").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("categories").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveTagAction(formData: FormData) {
  const admin = createAdminClient();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) return;

  const payload = { name, slug: slugify(name) };

  if (id) {
    const { error } = await admin.from("tags").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await admin.from("tags").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteCategoryAction(formData: FormData) {
  const admin = createAdminClient();
  const id = String(formData.get("id") ?? "").trim();

  if (!id) return;

  await admin.from("note_categories").delete().eq("category_id", id);

  const { error } = await admin.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteTagAction(formData: FormData) {
  const admin = createAdminClient();
  const id = String(formData.get("id") ?? "").trim();

  if (!id) return;

  await admin.from("note_tags").delete().eq("tag_id", id);

  const { error } = await admin.from("tags").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
}
