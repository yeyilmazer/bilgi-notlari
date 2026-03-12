import Link from "next/link";
import { BookOpen, Home, LayoutGrid, LogIn } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="card" style={{ position: "sticky", top: 12, zIndex: 20, padding: 16, marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "#0f172a", color: "white", borderRadius: 16, padding: 10 }}>
            <BookOpen size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>Bilgi Sitesi</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Notlar, kategoriler ve etiketler</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn" href="/"><Home size={16} />Ana Sayfa</Link>
          <Link className="btn" href="/kategoriler"><LayoutGrid size={16} />Kategoriler</Link>
          <Link className="btn" href="/login"><LogIn size={16} />Admin Girişi</Link>
        </div>
      </div>
    </header>
  );
}
