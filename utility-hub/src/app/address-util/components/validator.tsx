import { useState } from 'react';
import { CheckCircle2, XCircle, Search } from 'lucide-react';
import { Network } from '@/app/address-util/page';

interface ValidatorProps {
  network: Network;
  onValidate: () => void;
}

type ValidationResponse = Record<string, string | null>;

export function Validator({ network }: ValidatorProps) {
  const [inputAddress, setInputAddress] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateAddress = async () => {
    if (!inputAddress.trim()) return;
    setIsValidating(true);
    setValidationResult(null);
    setIsValid(null);
    try {
      const res = await fetch('/api/address-validator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ network, address: inputAddress })
      });
      const data = await res.json();
      setValidationResult(data);
      setIsValid(data.validText?.startsWith('✓'));
    } catch (err) {
      setValidationResult({ validText: '✗ Validation failed. Try again.' });
      setIsValid(false);
    }
    setIsValidating(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#d0efec] via-[#b8e0e6] to-[#7fc8c8] border border-[#4e8e8e]/30 rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#4e8e8e]/20 rounded-xl shadow">
          <Search className="w-7 h-7 text-[#4e8e8e]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#183a3a] drop-shadow">Address Validator</h2>
          <p className="text-[#4e8e8e] text-base">Verify address formats</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-8">
        <label className="block text-[#4e8e8e] font-semibold mb-2 text-lg">
          Enter {network} Address
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder={`Paste ${network} address here...`}
            className="w-full bg-[#f4f7fa] border-2 border-[#4e8e8e] rounded-xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-[#4e8e8e] font-mono text-lg text-[#183a3a] placeholder:text-[#b8e0e6] shadow"
            onKeyDown={(e) => e.key === 'Enter' && validateAddress()}
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4e8e8e]" />
        </div>
      </div>

      {/* Validate Button */}
      <button
        onClick={validateAddress}
        disabled={!inputAddress.trim() || isValidating}
        className="w-full bg-[#244747] hover:bg-[#183a3a] disabled:bg-[#447F99]/40 disabled:cursor-not-allowed text-[#fefefe] py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
      >
        {isValidating ? (
          <>
            <div className="w-5 h-5 border-2 border-[#b8e0e6]/30 border-t-[#4e8e8e] rounded-full animate-spin" />
            Validating...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Validate Address
          </>
        )}
      </button>

      {/* Validation Result */}
      {validationResult && (
        <div className="space-y-6">
          <div className={`p-5 rounded-xl border-2 text-lg font-semibold flex items-center gap-3 shadow-lg ${
            isValid 
              ? 'bg-[#b8e0e6]/20 border-[#4e8e8e]/50 text-[#183a3a]' 
              : 'bg-red-200/20 border-red-400/50 text-red-700'
          }`}>
            {isValid ? (
              <CheckCircle2 className="w-7 h-7 text-[#4e8e8e]" />
            ) : (
              <XCircle className="w-7 h-7 text-red-400" />
            )}
            <span>
              {isValid ? 'Valid Address' : 'Invalid Address'}
            </span>
          </div>

          {/* Validation Details as plain lines */}
          <div className="bg-[#f4f7fa] border border-[#b8e0e6] rounded-xl p-5 shadow">
            <div className="space-y-2">
              {Object.values(validationResult)
                .filter(v => v && typeof v === 'string')
                .map((value, idx) => (
                  <div key={idx}>
                    <span className={
                      value && value.startsWith('✓') ? 'text-[#4e8e8e]'
                      : value && value.startsWith('✗') ? 'text-red-400'
                      : 'text-[#183a3a]'
                    }>
                      {value}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

