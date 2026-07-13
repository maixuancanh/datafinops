import { TxlineModulePage } from '../txline-module-page';
import { usageModule } from '../txline-worldcup-modules';

export default function UsagePage() {
  return <TxlineModulePage context="Workspace / Usage" module={usageModule} />;
}
