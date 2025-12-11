import { useState } from 'react';
import { Wand2, Copy, Check, ArrowRight } from 'lucide-react';
import { AddressGeneratorProps } from '@/app/address-util/components/addressGenerator';

export function BitcoinAG({ network, onGenerate }: AddressGeneratorProps) {
    
    const [privateKey, setPrivateKey] = useState('');
    const [step, setStep] = useState(0);
    const [copied, setCopied] = useState<'address' | 'key' | 'pubUncompressed' | 'pubCompressed' | 'base58' | 'bech32' | null>(null);
      
    // Move copyToClipboard above all usages
    const copyToClipboard = (text: string, type: typeof copied) => {
      navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    };

    // BTC specific states
    const [btcPubUncompressed, setBtcPubUncompressed] = useState('');
    const [btcPubCompressed, setBtcPubCompressed] = useState('');
    const [btcBase58, setBtcBase58] = useState('');
    const [btcBech32, setBtcBech32] = useState('');


    // BTC Step 1: Generate Keypair
    const generateBTCKeypair = async () => {
      setStep(1);
      try {
        const res = await fetch('/api/bitcoin/generate-keypair', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        const data = await res.json();
        setPrivateKey(data.privateKey || '');
        setBtcPubUncompressed(data.publicKeyUncompressed || '');
        setBtcPubCompressed(data.publicKeyCompressed || '');
        onGenerate('Generated new BTC keypair');
      } catch (err) {
        // handle error
      }
    };  
    // BTC Step 2: Derive Addresses
    const deriveBTCAddresses = async () => {
      setStep(2);
      try {
        // Base58
        const resBase58 = await fetch('/api/bitcoin/derive-base58', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicKeyCompressed: btcPubCompressed })
        });
        const dataBase58 = await resBase58.json();
        setBtcBase58(dataBase58.address || ''); 
        // Bech32
        const resBech32 = await fetch('/api/bitcoin/derive-bech32', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicKeyCompressed: btcPubCompressed })
        });
        const dataBech32 = await resBech32.json();
        setBtcBech32(dataBech32.address || ''); 
        onGenerate('Derived BTC addresses');
        setStep(3);
      } catch (err) {
        // handle error
      }
    };



    return (
      <div className="bg-background border border-background rounded-2xl p-8 card-shadow">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-btn-primary/20 rounded-xl shadow">
            <Wand2 className="w-7 h-7 text-icon-color" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground drop-shadow">BTC Address Generator</h2>
            <p className="text-foreground text-base">Step-by-step Bitcoin address generation</p>
          </div>
        </div>

        {/* Step-by-step Flow */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-lg font-bold transition-all ${
                    step >= s
                      ? 'border-btn-primary bg-background text-foreground'
                      : 'border-btn-primary/30 text-btn-primary bg-background/40'
                  }`}
                  style={step >= s ? {
                    borderColor: 'var(--btn-primary)',
                    background: 'var(--background)',
                    color: 'var(--foreground)'
                  } : {
                    borderColor: 'rgba(212,175,55,0.3)',
                    color: 'var(--btn-primary)',
                    background: 'rgba(245,245,235,0.4)'
                  }}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all`}
                    style={{ background: step > s ? 'var(--btn-primary)' : 'rgba(212,175,55,0.3)' }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className={step >= 1 ? 'text-foreground font-semibold' : 'text-btn-primary'}>Initialize</p>
            </div>
            <div className="text-center">
              <p className={step >= 2 ? 'text-foreground font-semibold' : 'text-btn-primary'}>Generate</p>
            </div>
            <div className="text-center">
              <p className={step >= 3 ? 'text-foreground font-semibold' : 'text-btn-primary'}>Complete</p>
            </div>
          </div>
        </div>

        {/* Step 1: Generate Keypair (always visible) */}
        <button
          onClick={generateBTCKeypair}
          className="w-full bg-btn-primary hover:bg-btn-primary/80 text-btn-text py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
        >
          <Wand2 className="w-5 h-5" />
          Generate BTC Keys
        </button>

        {/* Show Keypair */}
        {step >= 1 && (
          <div className="space-y-6 mb-8">
            <div className="bg-background border-2 border-btn-primary rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-btn-primary font-semibold text-lg">Private Key</label>
                <button
                  onClick={() => copyToClipboard(privateKey, 'key')}
                  className="p-2 hover:bg-btn-primary/20 rounded transition-colors"
                >
                  {copied === 'key' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-btn-primary" />
                  )}
                </button>
              </div>
              <p className="font-mono text-foreground break-all text-lg">{privateKey}</p>
              <p className="text-red-700 mt-2 font-semibold">⚠️ Never share your private key</p>
            </div>
            <div className="bg-background border-2 border-btn-primary rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-btn-primary font-semibold text-lg">Public Key (Uncompressed)</label>
                <button
                  onClick={() => copyToClipboard(btcPubUncompressed, 'pubUncompressed')}
                  className="p-2 hover:bg-btn-primary/20 rounded transition-colors"
                >
                  {copied === 'pubUncompressed' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-btn-primary" />
                  )}
                </button>
              </div>
              <p className="font-mono text-btn-primary break-all text-lg">{btcPubUncompressed}</p>
            </div>
            <div className="bg-background border-2 border-btn-primary rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-btn-primary font-semibold text-lg">Public Key (Compressed)</label>
                <button
                  onClick={() => copyToClipboard(btcPubCompressed, 'pubCompressed')}
                  className="p-2 hover:bg-btn-primary/20 rounded transition-colors"
                >
                  {copied === 'pubCompressed' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-btn-primary" />
                  )}
                </button>
              </div>
              <p className="font-mono text-btn-primary break-all text-lg">{btcPubCompressed}</p>
            </div>
          </div>
        )}

        {/* Step 2: Derive Addresses */}
        {step === 1 && btcPubCompressed && (
          <button
            onClick={deriveBTCAddresses}
            className="w-full bg-btn-primary hover:bg-btn-primary/80 text-btn-text py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
          >
            <ArrowRight className="w-5 h-5" />
            Generate BTC Addresses
          </button>
        )}

        {/* Show Derived Addresses */}
        {step >= 2 && (
          <div className="space-y-6 mb-8">
            <div className="bg-background border-2 border-btn-primary rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-btn-primary font-semibold text-lg">Address derived from Base58</label>
                <button
                  onClick={() => copyToClipboard(btcBase58, 'base58')}
                  className="p-2 hover:bg-btn-primary/20 rounded transition-colors"
                >
                  {copied === 'base58' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-btn-primary" />
                  )}
                </button>
              </div>
              <p className="font-mono text-btn-primary break-all text-lg">{btcBase58}</p>
            </div>
            <div className="bg-background border-2 border-btn-primary rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-btn-primary font-semibold text-lg">Address derived from Bech32</label>
                <button
                  onClick={() => copyToClipboard(btcBech32, 'bech32')}
                  className="p-2 hover:bg-btn-primary/20 rounded transition-colors"
                >
                  {copied === 'bech32' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-btn-primary" />
                  )}
                </button>
              </div>
              <p className="font-mono text-btn-primary break-all text-lg">{btcBech32}</p>
            </div>
          </div>
        )}
        {/* Static Brief Section */}
        <div className="bg-background border-2 border-btn-primary rounded-xl p-5 shadow-lg">
          <p className="mb-2"><span className="font-semibold text-btn-primary">Key Generation:</span> When you click <span className="font-semibold">Generate BTC Keys</span>, a new private key and public keys are created. The private key lets you control your funds, while the public keys are used to create wallet addresses. Never share your private key.</p>
          <p className="mb-2"><span className="font-semibold text-btn-primary">Legacy (Base58) Address:</span> Also called P2PKH or P2SH, these are the classic Bitcoin address formats, starting with '1' or '3'. They are widely supported and easy to read, but do not support SegWit features.</p>
          <p className="mb-2"><span className="font-semibold text-btn-primary">SegWit (Bech32) Address:</span> These addresses start with 'bc1' and use the Bech32 format. SegWit (short for Segregated Witness) enables lower transaction fees and better security. Bech32 addresses are recommended for new wallets and transactions.</p>
          <p>Both address types let you receive Bitcoin, but SegWit (Bech32) is more modern and efficient.</p>
        </div>
      </div>
    );
}