export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">ລາຍລະອຽດຄຳສັ່ງຊື້</h1>
      <p className="mt-2 text-muted-foreground">Order ID: {id}</p>
    </div>
  );
}
