export default async function EntitlementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main>
      <p>Entitlement / {id}</p>
      <h1>Verification timeline</h1>
      <p>
        Subscription, API state, league, fixture, latency, period, network, program and proposal
        hash.
      </p>
      <p>Mismatch blocks repurchase and opens recovery incident.</p>
    </main>
  );
}
