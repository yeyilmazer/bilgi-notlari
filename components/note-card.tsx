import Link from "next/link";
import { CalendarDays, Eye, Share2, Star, Tags } from "lucide-react";
import type { NoteWithRelations } from "@/types";
import { formatDateTR } from "@/lib/utils";

export function NoteCard({ note, highlightedExcerpt }: { note: NoteWithRelations; highlightedExcerpt: string }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {note.categories.map((category) => (
          <span className="badge" key={category.id}>{category.name}</span>
        ))}
        {note.is_favorite && <span className="badge" style={{ background: "#fef3c7", color: "#92400e" }}><Star size={12} />Favori</span>}
        <span className="badge">{note.views} görüntülenme</span>
      </div>

      <h2 style={{ margin: 0, fontSize: 28 }}>{note.title}</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 12, color: "#64748b", fontSize: 13 }}>
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><CalendarDays size={14} />{formatDateTR(note.published_date)}</span>
        <span style={{ display: "inline-flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <Tags size={14} />
          {note.tags.length ? note.tags.map((tag) => (
            <Link key={tag.id} className="badge" href={`/etiket/${tag.slug}`}>{tag.name}</Link>
          )) : "-"}
        </span>
      </div>

      <div style={{ marginTop: 16, color: "#475569", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: highlightedExcerpt }} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
        <Link className="btn" href={`/not/${note.slug}`}><Eye size={16} />Oku</Link>
        <a className="btn btn-blue" href={`/not/${note.slug}`}><Share2 size={16} />Paylaş</a>
      </div>
    </div>
  );
}
