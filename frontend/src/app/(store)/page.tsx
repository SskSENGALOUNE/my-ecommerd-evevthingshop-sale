import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getPublicBanners } from "@/lib/api/banner";
import { getPublicCategories } from "@/lib/api/category";
import { BannerCarousel } from "@/components/store/banner-carousel";
import { CategoryGrid } from "@/components/store/category-grid";

export default async function HomePage() {
  const [banners, categories] = await Promise.all([
    getPublicBanners().catch(() => []),
    getPublicCategories().catch(() => []),
  ]);

  const activeBanners = banners.filter((b) => b.isActive);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-8">
      {/* Banner carousel */}
      {activeBanners.length > 0 ? (
        <BannerCarousel banners={activeBanners} />
      ) : (
        <div className="w-full rounded-2xl bg-zinc-900 text-white aspect-16/6 flex flex-col items-center justify-center gap-2">
          <p className="text-2xl font-bold">Everything Shop</p>
          <p className="text-zinc-400">ຮ້ານຄ້າອອນລາຍ ສິນຄ້າຄຸນນະພາບ</p>
        </div>
      )}

      {/* Categories */}
      <CategoryGrid categories={categories} />

      {/* Featured products — placeholder จนกว่า product module จะพร้อม */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">ສິນຄ້າແນະນຳ</h2>
          <Link
            href="/products"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ເບິ່ງທັງໝົດ →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-muted/40 aspect-square flex flex-col items-center justify-center gap-2 text-muted-foreground"
            >
              <ShoppingBag className="size-8 opacity-30" />
              <span className="text-xs">ກຳລັງໂຫລດ...</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
