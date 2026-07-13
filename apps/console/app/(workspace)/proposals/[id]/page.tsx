import { TxlineModulePage } from '../../txline-module-page';
import { proposalModule } from '../../txline-worldcup-modules';

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <TxlineModulePage context={`Proposal / ${id}`} module={proposalModule} />;
}
