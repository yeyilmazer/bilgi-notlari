import { PublicHeader } from "@/components/public-header";
import { getAllCategories, getPublishedNotesByCategory } from "@/lib/data";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="container">
      <PublicHeader />
      <div className="grid grid-3">
        {await Promise.all(categories.map(async (category) => {
          const notes = await getPublishedNotesByCategory(category.id);
          return (
            <a key={category.id} href={`/kategori/${category.slug}`} className="card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700 }}>{category.name}</div>
              <div style={{ marginTop: 8, color: "#64748b" }}>{notes.length} not</div>
            </a>
          );
        }))}
      </div>
    </div>
  );
}
