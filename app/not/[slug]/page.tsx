import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { getPublishedNoteBySlug } from "@/lib/data";
import { formatDateTR } from "@/lib/utils";

export default async function NoteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = await getPublishedNoteBySlug(slug);
  if (!note) notFound();

  return (
    <div className="container">
      <PublicHeader />
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {note.categories.map((category) => (
            <span key={category.id} className="badge">{category.name}</span>
          ))}
        </div>

        <h1 style={{ marginTop: 0 }}>{note.title}</h1>
        <div style={{ color: "#64748b", marginBottom: 16 }}>{formatDateTR(note.published_date)}</div>

        <div className="prose" dangerouslySetInnerHTML={{ __html: note.content_html }} />

        {!!note.footnotes.length && (
          <div style={{ marginTop: 28, borderTop: "1px solid #e2e8f0", paddingTop: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Dipnotlar</div>
            <div style={{ display: "grid", gap: 10 }}>
              {note.footnotes.map((footnote) => (
                <div key={footnote.id} id={`footnote-${footnote.sort_order}`} style={{ padding: "6px 8px", borderRadius: 10 }}>
                  <button className="btn" style={{ padding: "4px 8px", marginRight: 8 }} onClick={() => {}}>
                    <sup>[{footnote.sort_order}]</sup>
                  </button>
                  {[footnote.book, footnote.volume && `Cilt: ${footnote.volume}`, footnote.page && `Sayfa: ${footnote.page}`, footnote.hadith_number && `Hadis No: ${footnote.hadith_number}`, footnote.note_text].filter(Boolean).join(" | ")}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
