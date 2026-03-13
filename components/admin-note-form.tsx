'use client';

import { useMemo, useState } from "react";
import { CheckCircle2, PlusSquare } from "lucide-react";
import type { Category, NoteWithRelations, Tag } from "@/types";
import { saveNoteAction } from "@/lib/actions";
import { normalizePastedTextToHtml } from "@/lib/utils";

type FootnoteInput = {
  mode: "text" | "book";
  book?: string;
  volume?: string;
  page?: string;
  hadith_number?: string;
  note_text?: string;
};

function buildFootnoteAnchor(id: number) {
  return `<a href="#footnote-${id}" id="footnote-ref-${id}"><sup>[${id}]</sup></a>`;
}

export function AdminNoteForm({
  categories,
  tags,
  note
}: {
  categories: Category[];
  tags: Tag[];
  note?: NoteWithRelations;
}) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [contentHtml, setContentHtml] = useState(note?.content_html ?? "");
  const [excerpt, setExcerpt] = useState(note?.excerpt ?? "");
  const [publishedDate, setPublishedDate] = useState(note?.published_date ?? "");
  const [status, setStatus] = useState<"draft" | "published">(note?.status ?? "draft");
  const [isFavorite, setIsFavorite] = useState<boolean>(note?.is_favorite ?? false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    note?.categories.map((c) => c.id) ?? []
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    note?.tags.map((t) => t.id) ?? []
  );
  const [footnotes, setFootnotes] = useState<FootnoteInput[]>(
    note?.footnotes.map((f) => ({
      mode: f.mode,
      book: f.book ?? "",
      volume: f.volume ?? "",
      page: f.page ?? "",
      hadith_number: f.hadith_number ?? "",
      note_text: f.note_text ?? ""
    })) ?? []
  );
  const [footnoteDraft, setFootnoteDraft] = useState<FootnoteInput>({
    mode: "text",
    book: "",
    volume: "",
    page: "",
    hadith_number: "",
    note_text: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const orderedFootnotes = useMemo(
    () => footnotes.map((f, index) => ({ ...f, sort: index + 1 })),
    [footnotes]
  );

  async function onSubmit(formData: FormData) {
    setError("");
    setMessage("");

    formData.set("id", note?.id ?? "");
    formData.set("title", title);
    formData.set("content_html", contentHtml);
    formData.set("excerpt", excerpt);
    formData.set("published_date", publishedDate);
    formData.set("status", status);
    formData.set("categories_json", JSON.stringify(selectedCategories));
    formData.set("tags_json", JSON.stringify(selectedTags));
    formData.set("footnotes_json", JSON.stringify(orderedFootnotes));

    if (isFavorite) {
      formData.set("is_favorite", "on");
    }

    try {
      await saveNoteAction(formData);
      setMessage(
        status === "published"
          ? "Not başarıyla yayımlandı."
          : "Taslak başarıyla kaydedildi."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    }
  }

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleTag(id: string) {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function insertFootnoteRef() {
    const nextId = footnotes.length + 1;
    setContentHtml((prev) => `${prev}${buildFootnoteAnchor(nextId)}`);
  }

  function addFootnote() {
    const hasUsefulBook =
      footnoteDraft.mode === "book" &&
      Boolean(footnoteDraft.book || footnoteDraft.note_text);

    const hasUsefulText =
      footnoteDraft.mode === "text" && Boolean(footnoteDraft.note_text);

    if (!hasUsefulBook && !hasUsefulText) return;

    setFootnotes((prev) => [...prev, footnoteDraft]);
    setFootnoteDraft({
      mode: footnoteDraft.mode,
      book: "",
      volume: "",
      page: "",
      hadith_number: "",
      note_text: ""
    });
  }

  function removeFootnote(index: number) {
    const footnoteNumber = index + 1;

    setFootnotes((prev) => prev.filter((_, i) => i !== index));

    setContentHtml((prev) =>
      prev.replace(
        new RegExp(
          `<a href="#footnote-${footnoteNumber}" id="footnote-ref-${footnoteNumber}"><sup>\$begin:math:display$\$\{footnoteNumber\}\\$end:math:display$</sup></a>`,
          "g"
        ),
        ""
      )
    );
  }

  function handlePaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    const html = normalizePastedTextToHtml(text);
    setContentHtml((prev) => `${prev}${html}`);
  }

  return (
    <form action={onSubmit} className="card" style={{ padding: 24 }}>
      {(message || error) && (
        <div
          className="card"
          style={{
            padding: 12,
            marginBottom: 16,
            background: message ? "#ecfdf5" : "#fef2f2",
            borderColor: message ? "#bbf7d0" : "#fecaca",
            color: message ? "#047857" : "#b91c1c"
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={18} />
            {message || error}
          </div>
        </div>
      )}

      <div className="grid grid-3" style={{ marginBottom: 16 }}>
        <input
          className="input"
          placeholder="Not başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input"
          type="date"
          value={publishedDate}
          onChange={(e) => setPublishedDate(e.target.value)}
        />
        <label className="btn" style={{ justifyContent: "space-between" }}>
          <span>Favori Not</span>
          <input
            type="checkbox"
            checked={isFavorite}
            onChange={(e) => setIsFavorite(e.target.checked)}
          />
        </label>
      </div>

      <div className="grid grid-2">
        <div>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Kategoriler</div>
          <div className="card" style={{ padding: 14, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className="btn"
                  style={{
                    background: selectedCategories.includes(category.id)
                      ? "#0f172a"
                      : "#f8fafc",
                    color: selectedCategories.includes(category.id)
                      ? "white"
                      : "#334155"
                  }}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 8, fontWeight: 600 }}>Etiketler</div>
          <div className="card" style={{ padding: 14, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className="btn"
                  style={{
                    background: selectedTags.includes(tag.id)
                      ? "#0f172a"
                      : "#f8fafc",
                    color: selectedTags.includes(tag.id)
                      ? "white"
                      : "#334155"
                  }}
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 8, fontWeight: 600 }}>Editör</div>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <button type="button" className="btn" onClick={insertFootnoteRef}>
                Dipnot İşareti Ekle
              </button>
            </div>

            <textarea
              className="input"
              style={{ minHeight: 420, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              onPaste={handlePaste}
              placeholder="HTML içerik"
            />

            <textarea
              className="input"
              style={{ marginTop: 12, minHeight: 90 }}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Özet"
            />
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Dipnotlar / Kaynaklar</div>
          <div className="card" style={{ padding: 14 }}>
            <select
              className="select"
              value={footnoteDraft.mode}
              onChange={(e) =>
                setFootnoteDraft((prev) => ({
                  ...prev,
                  mode: e.target.value as "text" | "book"
                }))
              }
            >
              <option value="text">Normal Metin</option>
              <option value="book">Kitap / Kaynak Kaydı</option>
            </select>

            {footnoteDraft.mode === "book" && (
              <div className="grid grid-2" style={{ marginTop: 12 }}>
                <input
                  className="input"
                  placeholder="Kitap"
                  value={footnoteDraft.book ?? ""}
                  onChange={(e) =>
                    setFootnoteDraft((prev) => ({ ...prev, book: e.target.value }))
                  }
                />
                <input
                  className="input"
                  placeholder="Cilt"
                  value={footnoteDraft.volume ?? ""}
                  onChange={(e) =>
                    setFootnoteDraft((prev) => ({ ...prev, volume: e.target.value }))
                  }
                />
                <input
                  className="input"
                  placeholder="Sayfa"
                  value={footnoteDraft.page ?? ""}
                  onChange={(e) =>
                    setFootnoteDraft((prev) => ({ ...prev, page: e.target.value }))
                  }
                />
                <input
                  className="input"
                  placeholder="Hadis Numarası"
                  value={footnoteDraft.hadith_number ?? ""}
                  onChange={(e) =>
                    setFootnoteDraft((prev) => ({
                      ...prev,
                      hadith_number: e.target.value
                    }))
                  }
                />
              </div>
            )}

            <textarea
              className="input"
              style={{ marginTop: 12, minHeight: 90 }}
              placeholder="Dipnot metni"
              value={footnoteDraft.note_text ?? ""}
              onChange={(e) =>
                setFootnoteDraft((prev) => ({ ...prev, note_text: e.target.value }))
              }
            />

            <button
              type="button"
              className="btn"
              style={{ marginTop: 12 }}
              onClick={addFootnote}
            >
              Dipnotu Kaydet
            </button>

            <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
              {orderedFootnotes.map((footnote, index) => (
                <div
                  key={index}
                  className="card"
                  style={{ padding: 12, background: "#f8fafc" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 8
                    }}
                  >
                    <strong>[{footnote.sort}] Dipnot</strong>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => removeFootnote(index)}
                    >
                      Sil
                    </button>
                  </div>

                  <div style={{ fontSize: 14, color: "#475569" }}>
                    {footnote.mode === "book"
                      ? [
                          footnote.book,
                          footnote.volume && `Cilt: ${footnote.volume}`,
                          footnote.page && `Sayfa: ${footnote.page}`,
                          footnote.hadith_number && `Hadis No: ${footnote.hadith_number}`,
                          footnote.note_text
                        ]
                          .filter(Boolean)
                          .join(" | ")
                      : footnote.note_text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button
          type="submit"
          className="btn"
          onClick={() => setStatus("draft")}
        >
          Taslak Kaydet
        </button>
        <button
          type="submit"
          className="btn btn-green"
          onClick={() => setStatus("published")}
        >
          <PlusSquare size={16} />
          Notu Yayımla
        </button>
      </div>
    </form>
  );
}
