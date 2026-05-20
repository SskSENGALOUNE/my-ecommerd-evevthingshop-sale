import Link from "next/link";
import type { Category } from "@/lib/api/category";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">ໝວດໝູ່ສິນຄ້າ</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/products"
          className="shrink-0 flex flex-col items-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-medium hover:bg-accent transition-colors"
        >
          <span className="text-xl">🛍️</span>
          <span>ທັງໝົດ</span>
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.id}`}
            className="shrink-0 flex flex-col items-center gap-2 rounded-xl border bg-card px-5 py-3 text-sm font-medium hover:bg-accent transition-colors"
          >
            <span className="text-xl">📦</span>
            <span className="whitespace-nowrap">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
