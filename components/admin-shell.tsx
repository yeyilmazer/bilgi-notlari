import Link from "next/link";
import { Edit3, FileText, FolderPlus, Tags } from "lucide-react";

export function AdminShell({ active, children }: { active: "notes" | "categories" | "tags"; children: React.ReactNode }) {
  const items = [
    { href: "/admin", key: "notes", label: "Düzenle", icon: Edit3 },
    { href: "/admin/categories", key: "categories", label: "Kategoriler", icon: FolderPlus },
    { href: "/admin/tags", key: "tags", label: "Etiketler", icon: Tags }
  ] as const;

  return (
    <div className="container">
      <div className="card" style={{ padding: 16, marginBottom: 24 }}>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                className="btn"
                style={{
                  justifyContent: "space-between",
                  background: isActive ? "#0f172a" : "#f8fafc",
                  color: isActive ? "white" : "#334155",
                  borderColor: isActive ? "#0f172a" : "#e2e8f0"
                }}
              >
                <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><Icon size={16} />{item.label}</span>
                <FileText size={14} />
              </Link>
            );
          })}
        </div>
      </div>
      {children}
    </div>
  );
}
