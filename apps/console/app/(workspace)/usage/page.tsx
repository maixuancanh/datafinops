import { TxlineModulePage } from '../txline-module-page';
import {
  buildLiveModules,
  buildTxlineDataMode,
  getTxlineLiveSnapshot,
} from '../../txline-live-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function UsagePage() {
  const snapshot = await getTxlineLiveSnapshot();
  const modules = buildLiveModules(snapshot);

  return (
    <TxlineModulePage
      context="Workspace / Usage"
      dataMode={buildTxlineDataMode(snapshot)}
      module={modules.usage}
    />
  );
}
