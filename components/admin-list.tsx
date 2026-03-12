import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import type { NoteWithRelations } from "@/types";
import { formatDateTR } from "@/lib/utils";

export function AdminNoteList({ notes }: { notes: NoteWithRelations[] }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "grid", gap: 12 }}>
        {notes.map((note) => (
          <div key={note.id} className="card" style={{ padding: 16, background: "#fff" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <span className="badge" style={{ background: note.status === "published" ? "#dcfce7" : "#fef3c7", color: note.status === "published" ? "#166534" : "#92400e" }}>
                {note.status === "published" ? "Yayımlandı" : "Taslak"}
              </span>
            </div>
            <div style={{ fontWeight: 700 }}>{note.title}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{formatDateTR(note.published_date)}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Link className="btn" href={`/admin?edit=${note.id}`}><Pencil size={16} />Düzenle</Link>
              <Link className="btn" href={`/not/${note.slug}`}><Eye size={16} />Aç</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
