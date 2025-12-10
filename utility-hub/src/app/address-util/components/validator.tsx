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
    <div className="bg-background border border-background rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-btn-primary/20 rounded-xl shadow">
          <Search className="w-7 h-7 text-icon-color" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground drop-shadow">Address Validator</h2>
          <p className="text-foreground text-base">Verify address formats</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-8">
        <label className="block text-foreground font-semibold mb-2 text-lg">
          Enter {network} Address
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            placeholder={`Paste ${network} address here...`}
            className="w-full bg-background border-2 border-btn-primary rounded-xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-btn-primary font-mono text-lg text-foreground placeholder:text-btn-primary shadow"
            onKeyDown={(e) => e.key === 'Enter' && validateAddress()}
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-icon-color" />
        </div>
      </div>

      {/* Validate Button */}
      <button
        onClick={validateAddress}
        disabled={!inputAddress.trim() || isValidating}
        className="w-full bg-btn-primary hover:bg-btn-primary/80 disabled:bg-btn-primary/40 disabled:cursor-not-allowed text-btn-text py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-lg font-semibold shadow-lg mb-8"
      >
        {isValidating ? (
          <>
            <div className="w-5 h-5 border-2 border-btn-primary/30 border-t-btn-primary rounded-full animate-spin" />
            Validating...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5 text-icon-color" />
            Validate Address
          </>
        )}
      </button>

      {/* Validation Result */}
      {validationResult && (
        <div className="space-y-6">
          <div className={`p-5 rounded-xl border-2 text-lg font-semibold flex items-center gap-3 shadow-lg ${
            isValid
              ? 'bg-btn-primary/10 border-btn-primary/50 text-foreground'
              : 'bg-red-200/20 border-red-400/50 text-red-700'
          }`}>
            {isValid ? (
              <CheckCircle2 className="w-7 h-7 text-icon-color" />
            ) : (
              <XCircle className="w-7 h-7 text-red-400" />
            )}
            <span>
              {isValid ? 'Valid Address' : 'Invalid Address'}
            </span>
          </div>

          {/* Validation Details as plain lines */}
          <div className="bg-background border border-btn-primary rounded-xl p-5 shadow">
            <div className="space-y-2">
              {Object.values(validationResult)
                .filter(v => v && typeof v === 'string')
                .map((value, idx) => (
                  <div key={idx}>
                    <span className={
                      value && value.startsWith('✓') ? 'text-btn-primary'
                      : value && value.startsWith('✗') ? 'text-red-400'
                      : 'text-foreground'
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

