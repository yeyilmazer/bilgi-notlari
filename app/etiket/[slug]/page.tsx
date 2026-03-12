import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { NoteCard } from "@/components/note-card";
import { getTagBySlug, getPublishedNotesByTag } from "@/lib/data";

export default async function TagDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const notes = await getPublishedNotesByTag(tag.id);

  return (
    <div className="container">
      <PublicHeader />
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>#{tag.name}</h1>
      </div>
      <div className="grid">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} highlightedExcerpt={note.excerpt || ""} />
        ))}
      </div>
    </div>
  );
}
