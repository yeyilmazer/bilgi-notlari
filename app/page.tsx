import { PublicHeader } from "@/components/public-header";
import { NoteCard } from "@/components/note-card";
import { getPublishedNotes, getAllCategories, getAllTags } from "@/lib/data";
import { highlightText } from "@/lib/highlight";

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const notes = await getPublishedNotes(q);
  const categories = await getAllCategories();
  const tags = await getAllTags();

  return (
    <div className="container">
      <PublicHeader />

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}><div style={{ fontSize: 12, color: "#64748b" }}>Yayımlanan Not</div><div style={{ fontSize: 28, fontWeight: 700 }}>{notes.length}</div></div>
        <div className="card" style={{ padding: 20 }}><div style={{ fontSize: 12, color: "#64748b" }}>Kategori</div><div style={{ fontSize: 28, fontWeight: 700 }}>{categories.length}</div></div>
        <div className="card" style={{ padding: 20 }}><div style={{ fontSize: 12, color: "#64748b" }}>Etiket</div><div style={{ fontSize: 28, fontWeight: 700 }}>{tags.length}</div></div>
      </div>

      <form className="card" style={{ padding: 16, marginBottom: 24 }}>
        <div className="sidebar" style={{ gridTemplateColumns: "minmax(0,1fr) 220px" }}>
          <input className="input" name="q" defaultValue={q} placeholder="Başlık, içerik, etiket veya kategori ara" />
          <button className="btn btn-primary" type="submit">Ara</button>
        </div>
      </form>

      <div className="sidebar">
        <div className="grid">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              highlightedExcerpt={q ? highlightText(note.excerpt || "", q) : (note.excerpt || "")}
            />
          ))}
        </div>

        <div className="grid">
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Popüler Etiketler</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tags.map((tag) => (
                <a key={tag.id} className="badge" href={`/etiket/${tag.slug}`}>#{tag.name}</a>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Kategoriler</div>
            <div className="grid" style={{ gap: 8 }}>
              {categories.map((category) => (
                <a key={category.id} className="btn" href={`/kategori/${category.slug}`}>{category.name}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
