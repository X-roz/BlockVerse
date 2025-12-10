import { useState } from 'react';
import { Wand2, Copy, Check, ArrowRight } from 'lucide-react';
import { AddressGeneratorProps } from '@/app/address-util/components/addressGenerator';

export function SolanaAG({ network, onGenerate }: AddressGeneratorProps) {

    const [copied, setCopied] = useState<'address' | 'key' | 'pubUncompressed' | 'pubCompressed' | 'base58' | 'bech32' | null>(null);
    
    // Move copyToClipboard above all usages
    const copyToClipboard = (text: string, type: typeof copied) => {
      navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    };   

    // SOL specific states
    const [solStep, setSolStep] = useState(0);
    const [solPrivateKey, setSolPrivateKey] = useState('');
    const [solPublicKey, setSolPublicKey] = useState('');    

    // SOL Step 1: Generate Keypair
    const generateSOLKeypair = async () => {
      setSolStep(1);
      try {
        const res = await fetch('/api/solana/generate-keypair', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        const data = await res.json();
        setSolPrivateKey(data.privateKey || '');
        setSolPublicKey(data.publicKey || '');
        onGenerate('Generated new SOL keypair');
        setSolStep(2);
      } catch (err) {
        // handle error
      }
    };

    return (
      <div className="bg-background border border-background rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-btn-primary/20 rounded-xl shadow">
            <Wand2 className="w-7 h-7 text-icon-color" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground drop-shadow">SOL Address Generator</h2>
            <p className="text-foreground text-base">Step-by-step Solana address generation</p>
          </div>
        </div>

        {/* Step-by-step Flow */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-lg font-bold transition-all ${
                  solStep >= s ? 'border-[#4e8e8e] bg-[#e0f7fa] text-[#183a3a]' : 'border-[#b8e0e6] text-[#4e8e8e] bg-[#e0f7fa]/40'
                }`}>
                  {s}
                </div>
                {s < 2 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    solStep > s ? 'bg-[#4e8e8e]' : 'bg-[#b8e0e6]'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <p className={solStep >= 1 ? 'text-[#183a3a] font-semibold' : 'text-[#4e8e8e]'}>Initialize</p>
            </div>
            <div className="text-center">
              <p className={solStep >= 2 ? 'text-[#183a3a] font-semibold' : 'text-[#4e8e8e]'}>Complete</p>
            </div>
          </div>
        </div>

        {/* Step 1: Generate Keypair (always visible) */}
        <button
          onClick={generateSOLKeypair}
          className="w-full bg-[#244747] hover:bg-[#183a3a] text-[#f4f7fa] py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
        >
          <Wand2 className="w-5 h-5" />
          Generate SOL Keys
        </button>

        {/* Show Keypair and Address */}
        {solStep >= 1 && (
          <div className="space-y-6 mb-8">
            <div className="bg-[#e0f7fa] border-2 border-[#b8e0e6] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-yellow-400 font-semibold text-lg">Private Key</label>
                <button
                  onClick={() => copyToClipboard(solPrivateKey, 'key')}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied === 'key' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-yellow-400" />
                  )}
                </button>
              </div>
              <p className="font-mono text-[#183a3a] break-all text-lg">{solPrivateKey}</p>
              <p className="text-[#b80000] mt-2 font-semibold">⚠️ Never share your private key</p>
            </div>
            <div className="bg-[#e0f7fa] border-2 border-[#4e8e8e] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-400 font-semibold text-lg">Public Key / Address (Base58)</label>
                <button
                  onClick={() => copyToClipboard(solPublicKey, 'address')}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied === 'address' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-blue-400" />
                  )}
                </button>
              </div>
              <p className="font-mono text-[#244747] break-all text-lg">{solPublicKey}</p>
            </div>
          </div>
        )}
        {/* Static Brief Section */}
        <div className="mb-6 p-4 bg-[#f4f7fa] border border-[#4e8e8e]/40 rounded-xl shadow text-[#45553D] text-base">
          <p className="mb-2"><span className="font-semibold text-[#244747]">Key Generation:</span> When you click <span className="font-semibold">Generate SOL Keys</span>, a new private key and public key are created. The private key lets you control your funds, while the public key is your Solana address.</p>
          <p>On Solana, the public key is always used as your wallet address, and it is shown in Base58 format. Never share your private key.</p>
        </div>
      </div>
    );
}