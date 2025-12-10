import { Network } from '@/app/address-util/page';
import { EthereumAG } from './addressGenerator/ethereumAG';
import { BitcoinAG } from './addressGenerator/bitcoinAG';
import { SolanaAG } from './addressGenerator/solanaAG';

export interface AddressGeneratorProps {
  network: Network;
  onGenerate: (message: string) => void;
}

export function AddressGenerator({ network, onGenerate }: AddressGeneratorProps) {

  // ETH-specific UI
  if (network === 'ETH') {
    return <EthereumAG network={network} onGenerate={onGenerate} />;
  }

  // BTC-specific UI
  if (network === 'BTC') {
    return <BitcoinAG network={network} onGenerate={onGenerate} />;
  }

  // SOL-specific UI
  if (network === 'SOL') {
    return <SolanaAG network={network} onGenerate={onGenerate} />;
  }
}
