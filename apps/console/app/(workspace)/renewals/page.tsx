import { TxlineModulePage } from '../txline-module-page';
import {
  buildLiveModules,
  buildTxlineDataMode,
  getTxlineLiveSnapshot,
} from '../../txline-live-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RenewalsPage() {
  const snapshot = await getTxlineLiveSnapshot();
  const modules = buildLiveModules(snapshot);

  return (
    <TxlineModulePage
      context="Workspace / Renewals"
      dataMode={buildTxlineDataMode(snapshot)}
      module={modules.renewals}
    />
  );
}
