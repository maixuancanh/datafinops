import { TxlineModulePage } from '../txline-module-page';
import { scenariosModule } from '../txline-worldcup-modules';

export default function ScenariosPage() {
  return <TxlineModulePage context="Workspace / Scenarios" module={scenariosModule} />;
}
