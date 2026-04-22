export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">ແກ້ໄຂສິນຄ້າ</h1>
      <p className="mt-2 text-muted-foreground">Product ID: {id}</p>
    </div>
  );
}
