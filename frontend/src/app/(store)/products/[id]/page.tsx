export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">ລາຍລະອຽດສິນຄ້າ</h1>
      <p className="mt-2 text-muted-foreground">Product ID: {id}</p>
    </div>
  );
}
