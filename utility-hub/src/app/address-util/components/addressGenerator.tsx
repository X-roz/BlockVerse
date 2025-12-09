import { useState } from 'react';
import { Wand2, Copy, Check, ArrowRight } from 'lucide-react';
import { Network } from '@/app/address-util/page';

interface AddressGeneratorProps {
  network: Network;
  onGenerate: (message: string) => void;
}

export function AddressGenerator({ network, onGenerate }: AddressGeneratorProps) {
  const [privateKey, setPrivateKey] = useState('');
  const [copied, setCopied] = useState<'address' | 'key' | 'pubUncompressed' | 'pubCompressed' | 'base58' | 'bech32' | null>(null);
  const [step, setStep] = useState(0);
  // BTC specific states
  const [btcPubUncompressed, setBtcPubUncompressed] = useState('');
  const [btcPubCompressed, setBtcPubCompressed] = useState('');
  const [btcBase58, setBtcBase58] = useState('');
  const [btcBech32, setBtcBech32] = useState('');

  // ETH specific states
  const [ethStep, setEthStep] = useState(0);
  const [ethPrivateKey, setEthPrivateKey] = useState('');
  const [ethPublicKey, setEthPublicKey] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [ethChecksumAddress, setEthChecksumAddress] = useState('');

  // SOL specific states
  const [solStep, setSolStep] = useState(0);
  const [solPrivateKey, setSolPrivateKey] = useState('');
  const [solPublicKey, setSolPublicKey] = useState('');

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
  // ETH-specific UI
  if (network === 'ETH') {
    // Ocean Haze: #e0f7fa, Driftwood Teal: #4e8e8e, Tidal Depths: #183a3a
    return (
      <div className="bg-gradient-to-br from-[#d0efec] via-[#b8e0e6] to-[#7fc8c8] border border-[#4e8e8e]/30 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#4e8e8e]/20 rounded-xl shadow">
            <Wand2 className="w-7 h-7 text-[#183a3a]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#183a3a] drop-shadow">ETH Address Generator</h2>
            <p className="text-[#244747] text-base">Step-by-step Ethereum address generation</p>
          </div>
        </div>

        {/* Step-by-step Flow */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-lg font-bold transition-all ${
                  ethStep >= s ? 'border-[#4e8e8e] bg-[#e0f7fa] text-[#183a3a]' : 'border-[#b8e0e6] text-[#4e8e8e] bg-[#e0f7fa]/40'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    ethStep > s ? 'bg-[#4e8e8e]' : 'bg-[#b8e0e6]'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className={ethStep >= 1 ? 'text-[#183a3a] font-semibold' : 'text-[#4e8e8e]'}>Initialize</p>
            </div>
            <div className="text-center">
              <p className={ethStep >= 2 ? 'text-[#183a3a] font-semibold' : 'text-[#4e8e8e]'}>Generate</p>
            </div>
            <div className="text-center">
              <p className={ethStep >= 3 ? 'text-[#183a3a] font-semibold' : 'text-[#4e8e8e]'}>Apply Checksum</p>
            </div>
          </div>
        </div>

        {/* Step 1: Generate Keypair (always visible) */}
        <button
          onClick={generateETHKeypair}
          className="w-full bg-[#244747] hover:bg-[#183a3a] text-[#f4f7fa] py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
        >
          <Wand2 className="w-5 h-5" />
          Generate ETH Keys
        </button>

        {/* Show Keypair */}
        {ethStep >= 1 && (
          <div className="space-y-6 mb-8">
            <div className="bg-[#e0f7fa] border-2 border-[#b8e0e6] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#183a3a] font-semibold text-lg">Private Key</label>
                <button
                  onClick={() => copyToClipboard(ethPrivateKey, 'key')}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied === 'key' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-yellow-400" />
                  )}
                </button>
              </div>
              <p className="font-mono text-[#183a3a] break-all text-lg">{ethPrivateKey}</p>
              <p className="text-[#b80000] mt-2 font-semibold">⚠️ Never share your private key</p>
            </div>
            <div className="bg-[#e0f7fa] border-2 border-[#4e8e8e] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-400 font-semibold text-lg">Public Key</label>
                <button
                  onClick={() => copyToClipboard(ethPublicKey, 'pubUncompressed')}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied === 'pubUncompressed' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-blue-400" />
                  )}
                </button>
              </div>
              <p className="font-mono text-[#4e8e8e] break-all text-lg">{ethPublicKey}</p>
            </div>
          </div>
        )}

        {/* Step 2: Derive Address */}
        {ethStep === 1 && ethPublicKey && (
          <button
            onClick={deriveETHAddress}
            className="w-full bg-[#244747] hover:bg-[#183a3a] text-[#f4f7fa] py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
          >
            <ArrowRight className="w-5 h-5" />
            Generate ETH Address
          </button>
        )}

        {/* Show Derived Address */}
        {ethStep >= 2 && (
          <div className="space-y-6 mb-8">
            <div className="bg-[#e0f7fa] border-2 border-[#4e8e8e] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-400 font-semibold text-lg">Address</label>
                <button
                  onClick={() => copyToClipboard(ethAddress, 'address')}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied === 'address' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-blue-400" />
                  )}
                </button>
              </div>
              <p className="font-mono text-[#244747] break-all text-lg">{ethAddress}</p>
            </div>
          </div>
        )}

        {/* Step 3: Apply Checksum */}
        {ethStep === 2 && ethAddress && (
          <button
            onClick={applyETHChecksum}
            className="w-full bg-[#244747] hover:bg-[#183a3a] text-[#f4f7fa] py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
          >
            <ArrowRight className="w-5 h-5" />
            Apply EIP-55 Checksum
          </button>
        )}

        {/* Show Checksum Address */}
        {ethStep >= 3 && (
          <div className="space-y-6 mb-8">
            <div className="bg-[#e0f7fa] border-2 border-[#4e8e8e] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-400 font-semibold text-lg">Checksummed Address</label>
                <button
                  onClick={() => copyToClipboard(ethChecksumAddress, 'address')}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied === 'address' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-blue-400" />
                  )}
                </button>
              </div>
              <p className="font-mono text-[#244747] break-all text-lg">{ethChecksumAddress}</p>
            </div>
          </div>
        )}
        {/* Static Brief Section */}
        <div className="mb-6 p-4 bg-[#f4f7fa] border border-[#4e8e8e]/40 rounded-xl shadow text-[#45553D] text-base">
          <p className="mb-2"><span className="font-semibold text-[#244747]">Key Generation:</span> When you click <span className="font-semibold">Generate ETH Keys</span>, a new private key and public key are created. The private key lets you control your funds, while the public key is used to create your Ethereum address. Never share your private key.</p>
          <p className="mb-2"><span className="font-semibold text-[#244747]">EIP-55 Checksum:</span> Ethereum addresses are long hexadecimal strings. The EIP-55 proposal introduced a checksum using capital and lowercase letters to help prevent errors when typing or sharing addresses. Applying the checksum makes your address safer and easier to verify.</p>
        </div>
      </div>
    );
  }

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

  // BTC-specific UI
  if (network === 'BTC') {
    // Ocean Haze: #e0f7fa, Driftwood Teal: #4e8e8e, Tidal Depths: #183a3a
    return (
      <div className="bg-gradient-to-br from-[#e0f7fa] via-[#4e8e8e] to-[#183a3a] border border-[#4e8e8e]/40 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#4e8e8e]/20 rounded-xl shadow">
            <Wand2 className="w-7 h-7 text-[#183a3a]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#183a3a] drop-shadow">BTC Address Generator</h2>
            <p className="text-[#244747] text-base">Step-by-step Bitcoin address generation</p>
          </div>
        </div>

        {/* Step-by-step Flow */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-lg font-bold transition-all ${
                  step >= s ? 'border-[#4e8e8e] bg-[#e0f7fa] text-[#183a3a]' : 'border-[#b8e0e6] text-[#4e8e8e] bg-[#e0f7fa]/40'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    step > s ? 'bg-[#4e8e8e]' : 'bg-[#b8e0e6]'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className={step >= 1 ? 'text-[#183a3a] font-semibold' : 'text-[#4e8e8e]'}>Initialize</p>
            </div>
            <div className="text-center">
              <p className={step >= 2 ? 'text-[#183a3a] font-semibold' : 'text-[#4e8e8e]'}>Generate</p>
            </div>
            <div className="text-center">
              <p className={step >= 3 ? 'text-[#183a3a] font-semibold' : 'text-[#4e8e8e]'}>Complete</p>
            </div>
          </div>
        </div>

        {/* Step 1: Generate Keypair (always visible) */}
        <button
          onClick={generateBTCKeypair}
          className="w-full bg-[#244747] hover:bg-[#183a3a] text-[#f4f7fa] py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
        >
          <Wand2 className="w-5 h-5" />
          Generate BTC Keys
        </button>

        {/* Show Keypair */}
        {step >= 1 && (
          <div className="space-y-6 mb-8">
            <div className="bg-[#e0f7fa] border-2 border-[#b8e0e6] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-yellow-400 font-semibold text-lg">Private Key</label>
                <button
                  onClick={() => copyToClipboard(privateKey, 'key')}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied === 'key' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-yellow-400" />
                  )}
                </button>
              </div>
              <p className="font-mono text-[#183a3a] break-all text-lg">{privateKey}</p>
              <p className="text-[#b80000] mt-2 font-semibold">⚠️ Never share your private key</p>
            </div>
            <div className="bg-[#e0f7fa] border-2 border-[#4e8e8e] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-400 font-semibold text-lg">Public Key (Uncompressed)</label>
                <button
                  onClick={() => copyToClipboard(btcPubUncompressed, 'pubUncompressed')}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied === 'pubUncompressed' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-blue-400" />
                  )}
                </button>
              </div>
              <p className="font-mono text-[#4e8e8e] break-all text-lg">{btcPubUncompressed}</p>
            </div>
            <div className="bg-[#e0f7fa] border-2 border-[#4e8e8e] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-400 font-semibold text-lg">Public Key (Compressed)</label>
                <button
                  onClick={() => copyToClipboard(btcPubCompressed, 'pubCompressed')}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied === 'pubCompressed' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-blue-400" />
                  )}
                </button>
              </div>
              <p className="font-mono text-[#4e8e8e] break-all text-lg">{btcPubCompressed}</p>
            </div>
          </div>
        )}

        {/* Step 2: Derive Addresses */}
        {step === 1 && btcPubCompressed && (
          <button
            onClick={deriveBTCAddresses}
            className="w-full bg-[#244747] hover:bg-[#183a3a] text-[#f4f7fa] py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
          >
            <ArrowRight className="w-5 h-5" />
            Generate BTC Addresses
          </button>
        )}

        {/* Show Derived Addresses */}
        {step >= 2 && (
          <div className="space-y-6 mb-8">
            <div className="bg-[#e0f7fa] border-2 border-[#4e8e8e] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-400 font-semibold text-lg">Address derived from Base58</label>
                <button
                  onClick={() => copyToClipboard(btcBase58, 'base58')}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied === 'base58' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-blue-400" />
                  )}
                </button>
              </div>
              <p className="font-mono text-[#244747] break-all text-lg">{btcBase58}</p>
            </div>
            <div className="bg-[#e0f7fa] border-2 border-[#4e8e8e] rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-blue-400 font-semibold text-lg">Address derived from Bech32</label>
                <button
                  onClick={() => copyToClipboard(btcBech32, 'bech32')}
                  className="p-2 hover:bg-slate-800 rounded transition-colors"
                >
                  {copied === 'bech32' ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-blue-400" />
                  )}
                </button>
              </div>
              <p className="font-mono text-[#244747] break-all text-lg">{btcBech32}</p>
            </div>
          </div>
        )}
        {/* Static Brief Section */}
        <div className="mb-6 p-4 bg-[#f4f7fa] border border-[#4e8e8e]/40 rounded-xl shadow text-[#45553D] text-base">
          <p className="mb-2"><span className="font-semibold text-[#244747]">Key Generation:</span> When you click <span className="font-semibold">Generate BTC Keys</span>, a new private key and public keys are created. The private key lets you control your funds, while the public keys are used to create wallet addresses. Never share your private key.</p>
          <p className="mb-2"><span className="font-semibold text-[#244747]">Legacy (Base58) Address:</span> Also called P2PKH or P2SH, these are the classic Bitcoin address formats, starting with '1' or '3'. They are widely supported and easy to read, but do not support SegWit features.</p>
          <p className="mb-2"><span className="font-semibold text-[#244747]">SegWit (Bech32) Address:</span> These addresses start with 'bc1' and use the Bech32 format. SegWit (short for Segregated Witness) enables lower transaction fees and better security. Bech32 addresses are recommended for new wallets and transactions.</p>
          <p>Both address types let you receive Bitcoin, but SegWit (Bech32) is more modern and efficient.</p>
        </div>
      </div>
    );
  }

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

  // SOL-specific UI
  if (network === 'SOL') {
    // Ocean Haze: #e0f7fa, Driftwood Teal: #4e8e8e, Tidal Depths: #183a3a
    return (
      <div className="bg-gradient-to-br from-[#e0f7fa] via-[#4e8e8e] to-[#183a3a] border border-[#4e8e8e]/40 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#4e8e8e]/20 rounded-xl shadow">
            <Wand2 className="w-7 h-7 text-[#183a3a]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#183a3a] drop-shadow">SOL Address Generator</h2>
            <p className="text-[#244747] text-base">Step-by-step Solana address generation</p>
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
}
