'use client';

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { deleteCategoryAction, deleteTagAction, saveCategoryAction, saveTagAction } from "@/lib/actions";
import type { Category, Tag } from "@/types";

export function CategoryManager({ items }: { items: Category[] }) {
  const [editingId, setEditingId] = useState("");
  const [value, setValue] = useState("");

  return (
    <div className="grid" style={{ gap: 16 }}>
      <form action={saveCategoryAction} className="card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Kategori Ekle</div>
        <input className="input" name="name" placeholder="Kategori adı" />
        <button className="btn btn-primary" style={{ marginTop: 12 }}>Kaydet</button>
      </form>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Kategorileri Düzenle</div>
        <div className="grid" style={{ gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ padding: 14, background: "#fff" }}>
              {editingId === item.id ? (
                <form action={saveCategoryAction} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input type="hidden" name="id" value={item.id} />
                  <input className="input" name="name" value={value} onChange={(e) => setValue(e.target.value)} />
                  <button className="btn btn-primary">Kaydet</button>
                </form>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <div>{item.name}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" className="btn" onClick={() => { setEditingId(item.id); setValue(item.name); }}><Pencil size={16} />Düzenle</button>
                    <form action={deleteCategoryAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button className="btn"><Trash2 size={16} />Sil</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TagManager({ items }: { items: Tag[] }) {
  const [editingId, setEditingId] = useState("");
  const [value, setValue] = useState("");

  return (
    <div className="grid" style={{ gap: 16 }}>
      <form action={saveTagAction} className="card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Etiket Ekle</div>
        <input className="input" name="name" placeholder="Etiket adı" />
        <button className="btn btn-primary" style={{ marginTop: 12 }}>Kaydet</button>
      </form>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Etiketleri Düzenle</div>
        <div className="grid" style={{ gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} className="card" style={{ padding: 14, background: "#fff" }}>
              {editingId === item.id ? (
                <form action={saveTagAction} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input type="hidden" name="id" value={item.id} />
                  <input className="input" name="name" value={value} onChange={(e) => setValue(e.target.value)} />
                  <button className="btn btn-primary">Kaydet</button>
                </form>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <div>{item.name}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" className="btn" onClick={() => { setEditingId(item.id); setValue(item.name); }}><Pencil size={16} />Düzenle</button>
                    <form action={deleteTagAction}>
                      <input type="hidden" name="id" value={item.id} />
                      <button className="btn"><Trash2 size={16} />Sil</button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
