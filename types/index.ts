export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Footnote = {
  id: string;
  note_id: string;
  sort_order: number;
  mode: "text" | "book";
  book: string | null;
  volume: string | null;
  page: string | null;
  hadith_number: string | null;
  note_text: string | null;
  created_at: string;
};

export type Note = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_html: string;
  status: "draft" | "published";
  published_date: string | null;
  is_favorite: boolean;
  views: number;
  created_at: string;
  updated_at: string;
};

export type NoteWithRelations = Note & {
  categories: Category[];
  tags: Tag[];
  footnotes: Footnote[];
};
