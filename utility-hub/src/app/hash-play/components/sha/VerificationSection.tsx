"use client";
import { useState } from "react";
import { InputEncoding, ShaAlgorithm } from "../page";

type VerificationSectionProps = {
  inputText: string;
  inputEncoding: InputEncoding;
  algorithm: ShaAlgorithm;
};

const hashEncodings = [
  { value: 'Hex', label: 'Hex' },
  { value: 'Base64', label: 'Base64' },
];

export default function VerificationSection({ inputText, inputEncoding, algorithm }: VerificationSectionProps) {
  const [hashToVerify, setHashToVerify] = useState("");
  const [hashEncoding, setHashEncoding] = useState<'Hex' | 'Base64'>('Hex');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<null | {
    verified: boolean;
    algorithm: string;
    generatedHash: { hex: string; base64: string };
    hashMetadata?: { bits: number; bytes: number; hexChars: number };
    reason?: string;
  }>(null);

  // Map frontend values to backend-expected values
  const encodingMap: Record<string, string> = {
    'utf-8': 'UTF-8',
    'hex': 'Hex',
    'base64': 'Base64',
  };
  const algoMap: Record<string, string> = {
    'sha224': 'SHA-224',
    'sha256': 'SHA-256',
    'sha384': 'SHA-384',
    'sha512': 'SHA-512',
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!inputText.trim()) {
      setError('Input Text is required.');
      return;
    }
    if (!hashToVerify.trim()) {
      setError('Hash to Verify is required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/sha-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputValue: inputText,
          inputEncoding: encodingMap[inputEncoding],
          algorithm: algoMap[algorithm],
          hashToVerify: {
            value: hashToVerify,
            encoding: hashEncoding,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || 'Verification failed.');
      } else {
        setResult(data);
      }
    } catch {
      setError('Network or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-5">
      <div>
        <label htmlFor="hashToVerify" className="block font-medium mb-1">Hash to Verify</label>
        <textarea
          id="hashToVerify"
          className="w-full border rounded px-2 py-1 font-mono"
          rows={2}
          placeholder="Paste the hash value to compare"
          value={hashToVerify}
          onChange={e => setHashToVerify(e.target.value)}
          aria-required
        />
      </div>
      <div>
        <label htmlFor="hashEncoding" className="block font-medium mb-1">Hash Encoding</label>
        <select
          id="hashEncoding"
          className="w-full border rounded px-2 py-1"
          value={hashEncoding}
          onChange={e => setHashEncoding(e.target.value as 'Hex' | 'Base64')}
        >
          {hashEncodings.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="text-xs text-gray-500 mt-1">This encoding refers only to the hash value, not the input text.</div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-60"
        disabled={loading}
        aria-disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify Hash'}
      </button>
      {error && (
        <div className="text-yellow-700 bg-yellow-100 border border-yellow-300 rounded px-2 py-1 text-sm mt-1 flex items-center gap-2">
          <span role="img" aria-label="warning">⚠️</span> {error}
        </div>
      )}
      {result && (
        <div className="mt-8 space-y-4">
          {result.verified ? (
            <div className="flex items-center gap-2 text-green-700 font-semibold text-base">
              <span role="img" aria-label="check">✅</span> The generated hash matches the provided hash.
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700 font-semibold text-base">
              <span role="img" aria-label="cross">❌</span> The generated hash does not match the provided hash.
            </div>
          )}
          <div className="text-sm text-gray-700 border rounded px-2 py-2 bg-gray-50">
            <div>
              <span className="font-medium">Algorithm:</span> {result.algorithm}
            </div>
            {result.hashMetadata && (
              <div>
                <span className="font-medium">Length:</span> {result.hashMetadata.bits} bits ({result.hashMetadata.hexChars} hex chars, {result.hashMetadata.bytes} bytes)
              </div>
            )}
            <div>
              <span className="font-medium">Generated Hash (Hex):</span>
              <div className="select-all break-all font-mono text-xs bg-white border rounded px-1 py-1 mt-1">{result.generatedHash.hex}</div>
            </div>
            <div>
              <span className="font-medium">Generated Hash (Base64):</span>
              <div className="select-all break-all font-mono text-xs bg-white border rounded px-1 py-1 mt-1">{result.generatedHash.base64}</div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}