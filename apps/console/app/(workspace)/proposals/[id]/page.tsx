import { TxlineModulePage } from '../../txline-module-page';
import {
  buildLiveModules,
  buildTxlineDataMode,
  getTxlineLiveSnapshot,
} from '../../../txline-live-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snapshot = await getTxlineLiveSnapshot();
  const modules = buildLiveModules(snapshot);

  return (
    <TxlineModulePage
      context={`Proposal / ${id}`}
      dataMode={buildTxlineDataMode(snapshot)}
      module={modules.proposal}
    />
  );
}
