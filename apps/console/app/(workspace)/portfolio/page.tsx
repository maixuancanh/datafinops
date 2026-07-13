import { TxlineModulePage } from '../txline-module-page';
import { portfolioModule } from '../txline-worldcup-modules';

export default function PortfolioPage() {
  return <TxlineModulePage context="Workspace / Portfolio" module={portfolioModule} />;
}
