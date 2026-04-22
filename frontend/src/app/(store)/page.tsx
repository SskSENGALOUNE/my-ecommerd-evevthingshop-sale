export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tight">
          EveVthing Shop
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          ຮ້ານຄ້າອອນລາຍ
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">ສິນຄ້າແນະນຳ</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div className="h-64 rounded-lg border bg-muted/50 flex items-center justify-center text-muted-foreground">
            ສິນຄ້າ
          </div>
          <div className="h-64 rounded-lg border bg-muted/50 flex items-center justify-center text-muted-foreground">
            ສິນຄ້າ
          </div>
          <div className="h-64 rounded-lg border bg-muted/50 flex items-center justify-center text-muted-foreground">
            ສິນຄ້າ
          </div>
          <div className="h-64 rounded-lg border bg-muted/50 flex items-center justify-center text-muted-foreground">
            ສິນຄ້າ
          </div>
        </div>
      </section>
    </div>
  );
}
