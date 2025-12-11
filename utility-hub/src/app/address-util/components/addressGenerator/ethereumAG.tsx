import { useState } from 'react';
import { Wand2, Copy, Check, ArrowRight } from 'lucide-react';
import { AddressGeneratorProps } from '@/app/address-util/components/addressGenerator';

export function EthereumAG({ network, onGenerate }: AddressGeneratorProps) {

    // ETH specific states
    const [ethStep, setEthStep] = useState(0);
    const [ethPrivateKey, setEthPrivateKey] = useState('');
    const [ethPublicKey, setEthPublicKey] = useState('');
    const [ethAddress, setEthAddress] = useState('');
    const [ethChecksumAddress, setEthChecksumAddress] = useState('');
    
    const [copied, setCopied] = useState<'address' | 'privatekey' | 'checksumAddress' | 'pubkey' | null>(null);

    // Move copyToClipboard above all usages
    const copyToClipboard = (text: string, type: typeof copied) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    };

    // ETH Step 1: Generate Keypair
    const generateETHKeypair = async () => {
        setEthStep(1);
        try {
        const res = await fetch('/api/ethereum/generate-keypair', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const data = await res.json();
        setEthPrivateKey(data.privateKey || '');
        setEthPublicKey(data.publicKey || '');
        onGenerate('Generated new ETH keypair');
        } catch (err) {
        // handle error
        }
    };

    // ETH Step 2: Derive Address
    const deriveETHAddress = async () => {
        setEthStep(2);
        try {
        const res = await fetch('/api/ethereum/derive-address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicKey: ethPublicKey })
        });
        const data = await res.json();
        setEthAddress(data.address || '');
        onGenerate('Derived ETH address');
        } catch (err) {
        // handle error
        }
    };

    // ETH Step 3: Apply Checksum
    const applyETHChecksum = async () => {
        setEthStep(3);
        try {
        const res = await fetch('/api/ethereum/apply-checksum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: ethAddress })
        });
        const data = await res.json();
        setEthChecksumAddress(data.checksumAddress || '');
        onGenerate('Applied EIP-55 checksum');
        } catch (err) {
        // handle error
        }
    };

    return (
      <div className="bg-background border border-background rounded-2xl p-8 card-shadow">
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-btn-primary/20 rounded-xl shadow">
              <Wand2 className="w-7 h-7" style={{ color: 'var(--icon-color)' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground drop-shadow">ETH Address Generator</h2>
            <p className="text-foreground text-base">Step-by-step Ethereum address generation</p>
          </div>
        </div>

        {/* Step-by-step Flow */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-lg font-bold transition-all ${
                    ethStep >= s
                      ? 'border-btn-primary bg-background text-foreground'
                      : 'border-btn-primary/30 text-btn-primary bg-background/60'
                  }`}
                  style={ethStep >= s ? {
                    borderColor: 'var(--btn-primary)',
                    background: 'var(--background)',
                    color: 'var(--foreground)'
                  } : {
                    borderColor: 'rgba(212,175,55,0.3)',
                    color: 'var(--btn-primary)',
                    background: 'rgba(245,245,235,0.6)'
                  }}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all`}
                    style={{ background: ethStep > s ? 'var(--btn-primary)' : 'rgba(212,175,55,0.3)' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className={ethStep >= 1 ? 'text-foreground font-semibold' : 'text-btn-primary'}>Initialize</p>
            </div>
            <div className="text-center">
              <p className={ethStep >= 2 ? 'text-foreground font-semibold' : 'text-btn-primary'}>Generate</p>
            </div>
            <div className="text-center">
              <p className={ethStep >= 3 ? 'text-foreground font-semibold' : 'text-btn-primary'}>Apply Checksum</p>
            </div>
          </div>
        </div>

        {/* Step 1: Generate Keypair (always visible) */}
        <button
          onClick={generateETHKeypair}
          className="w-full bg-btn-primary hover:bg-btn-primary/80 text-btn-text py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
        >
          <Wand2 className="w-5 h-5" style={{ color: 'var(--icon-color)' }} />
          Generate ETH Keys
        </button>

        {/* Show Keypair */}
        {ethStep >= 1 && (
          <div className="space-y-6 mb-8">
            <div className="bg-background border-2 border-btn-primary rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-btn-primary font-semibold text-lg">Private Key</label>
                <button
                  onClick={() => copyToClipboard(ethPrivateKey, 'privatekey')}
                  className="p-2 hover:bg-btn-primary/20 rounded transition-colors"
                >
                  {copied === 'privatekey' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-btn-primary" />
                  )}
                </button>
              </div>
              <p className="font-mono text-foreground break-all text-lg">{ethPrivateKey}</p>
              <p className="mt-2 font-semibold text-red-700">⚠️ Never share your private key</p>
            </div>
            <div className="bg-background border-2 border-btn-primary rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-btn-primary font-semibold text-lg">Public Key</label>
                <button
                  onClick={() => copyToClipboard(ethPublicKey, 'pubkey')}
                  className="p-2 hover:bg-btn-primary/20 rounded transition-colors"
                >
                  {copied === 'pubkey' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-btn-primary" />
                  )}
                </button>
              </div>
              <p className="font-mono text-btn-primary break-all text-lg">{ethPublicKey}</p>
            </div>
          </div>
        )}

        {/* Step 2: Derive Address */}
        {ethStep === 1 && ethPublicKey && (
          <button
            onClick={deriveETHAddress}
            className="w-full bg-btn-primary hover:bg-btn-primary/80 text-btn-text py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
          >
            <ArrowRight className="w-5 h-5" style={{ color: 'var(--icon-color)' }}/>
            Generate ETH Address
          </button>
        )}

        {/* Show Derived Address */}
        {ethStep >= 2 && (
          <div className="space-y-6 mb-8">
            <div className="bg-background border-2 border-btn-primary rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-btn-primary font-semibold text-lg">Address</label>
                <button
                  onClick={() => copyToClipboard(ethAddress, 'address')}
                  className="p-2 hover:bg-btn-primary/40 rounded transition-colors"
                >
                  {copied === 'address' ? (
                    <Check className="w-5 h-5  text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-btn-primary" />
                  )}
                </button>
              </div>
              <p className="font-mono text-btn-primary break-all text-lg">{ethAddress}</p>
            </div>
          </div>
        )}

        {/* Step 3: Apply Checksum */}
        {ethStep === 2 && ethAddress && (
          <button
            onClick={applyETHChecksum}
            className="w-full bg-btn-primary hover:bg-btn-primary/80 text-btn-text py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
          >
            <ArrowRight className="w-5 h-5" style={{ color: 'var(--icon-color)' }}/>
            Apply EIP-55 Checksum
          </button>
        )}

        {/* Show Checksum Address */}
        {ethStep >= 3 && (
          <div className="space-y-6 mb-8">
            <div className="bg-background border-2 border-btn-primary rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-btn-primary font-semibold text-lg">Checksummed Address</label>
                <button
                  onClick={() => copyToClipboard(ethChecksumAddress, 'checksumAddress')}
                  className="p-2 hover:bg-btn-primary/40 rounded transition-colors"
                >
                  {copied === 'checksumAddress' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="font-mono text-btn-primary break-all text-lg">{ethChecksumAddress}</p>
            </div>
          </div>
        )}
        {/* Static Brief Section */}
        <div className="bg-background border-2 border-btn-primary rounded-xl p-5 shadow-lg">
          <p className="mb-2"><span className="font-semibold">Key Generation:</span> When you click <span className="font-semibold">Generate ETH Keys</span>, a new private key and public key are created. The private key lets you control your funds, while the public key is used to create your Ethereum address.</p>
          <p className="mb-2"><span className="font-semibold">EIP-55 Checksum:</span> Ethereum addresses are long hexadecimal strings. The EIP-55 proposal introduced a checksum using capital and lowercase letters to help prevent errors when typing or sharing addresses. Applying the checksum makes your address safer and easier to verify.</p>
        </div>
      </div>
    );

}