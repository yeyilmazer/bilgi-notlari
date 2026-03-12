import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { NoteCard } from "@/components/note-card";
import { getCategoryBySlug, getPublishedNotesByCategory } from "@/lib/data";

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const notes = await getPublishedNotesByCategory(category.id);

  return (
    <div className="container">
      <PublicHeader />
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>{category.name}</h1>
      </div>
      <div className="grid">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} highlightedExcerpt={note.excerpt || ""} />
        ))}
      </div>
    </div>
  );
}
