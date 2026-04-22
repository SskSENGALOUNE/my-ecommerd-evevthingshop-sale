export default async function QrPaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">ຊຳລະເງິນຜ່ານ QR</h1>
      <p className="mt-2 text-muted-foreground">Order ID: {orderId}</p>
    </div>
  );
}
