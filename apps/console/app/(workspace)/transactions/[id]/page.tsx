export default async function TransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main>
      <p>Transaction / {id}</p>
      <h1>Operation timeline</h1>
      <p>Submitted → confirmed/failed/expired with duplicate and callback reorder protection.</p>
    </main>
  );
}
