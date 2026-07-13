import { TxlineModulePage } from '../txline-module-page';
import { savingsModule } from '../txline-worldcup-modules';

export default function SavingsPage() {
  return <TxlineModulePage context="Workspace / Savings" module={savingsModule} />;
}
