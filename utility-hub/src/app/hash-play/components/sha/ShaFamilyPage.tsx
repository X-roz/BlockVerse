"use client"

import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import VerificationSection from './VerificationSection';
import { Selector } from '@/app/components/Selector';

const shaAlgorithms: { value: ShaAlgorithm; label: string }[] = [
    { value: 'sha256', label: 'SHA-256' },
    { value: 'sha512', label: 'SHA-512' },
    { value: 'sha224', label: 'SHA-224' },
    { value: 'sha384', label: 'SHA-384' },
];

const inputEncodings: { value: InputEncoding; label: string }[] = [
    { value: 'utf-8', label: 'UTF-8' },
    { value: 'hex', label: 'Hex' },
    { value: 'base64', label: 'Base64' },
];

export type ShaAlgorithm = 'sha256' | 'sha512' | 'sha224' | 'sha384';
export type InputEncoding = 'utf-8' | 'hex' | 'base64';

export default function ShaFamilyPage() {

    const [inputText, setInputText] = useState('');
    const [inputEncoding, setInputEncoding] = useState<InputEncoding>('utf-8');
    const [algorithm, setAlgorithm] = useState<ShaAlgorithm>('sha256');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<null | {
        hex: string;
        base64: string;
        length: { bits: number; hexChars: number; bytes: number };
        algorithm: string;
        inputEncoding: string;
    }>(null);
    const [copied, setCopied] = useState<{ hex: boolean; base64: boolean }>({ hex: false, base64: false });

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError(null);
            setResult(null);
            if (!inputText.trim()) {
                setError('Input text is required.');
                return;
            }
            setLoading(true);
            try {
                const res = await fetch('/api/sha-hashing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inputText, inputEncoding, algorithm }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Hashing failed.');
                } else {
                    setResult({
                        hex: data.output.hex,
                        base64: data.output.base64,
                        length: data.length,
                        algorithm: data.algorithm,
                        inputEncoding: data.inputEncoding,
                    });
                }
            } catch {
                setError('Network or server error.');
            } finally {
                setLoading(false);
            }
    };

    const handleCopy = (type: 'hex' | 'base64') => {
            if (!result) return;
            const value = type === 'hex' ? result.hex : result.base64;
            navigator.clipboard.writeText(value);
            setCopied((prev) => ({ ...prev, [type]: true }));
            setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 1200);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Shared Input Section */}
                <div className="rounded-2xl card-shadow p-8 mb-8 bg-background border border-background">
                    <form className="flex flex-col gap-4">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-btn-primary/20 rounded-xl shadow">
                                <KeyRound className="w-7 h-7 text-icon-color" />
                                </div>
                                <div>
                                <h2 className="text-2xl font-bold text-foreground drop-shadow">Secure Hash Algorithms</h2>
                                <p className="text-foreground text-base">Explore various SHA hashing algorithms</p>
                                </div>
                            </div>
                            <label className="block text-foreground font-semibold mb-2 text-lg">Input Data</label>
                            <textarea
                                id="inputText"
                                className="w-full bg-background border-2 border-btn-primary rounded-xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-btn-primary font-mono text-lg text-foreground placeholder:text-btn-primary shadow"
                                rows={4}
                                placeholder="Enter text to hash"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                aria-required
                                style={{
                                    border: '1px solid var(--btn-primary)',
                                    background: 'var(--background)',
                                    color: 'var(--foreground)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div className="flex gap-4">
                            {/* Replace Input Encoding dropdown */}
                            <div className="flex-1">
                                <label htmlFor="inputEncoding" className="block font-medium mb-1">Input Encoding</label>
                                <Selector
                                    selected={inputEncodings.find(opt => opt.value === inputEncoding) || inputEncodings[0]}
                                    onSelectedChange={(selected) => setInputEncoding(selected.value as InputEncoding)}
                                    options={inputEncodings}
                                    style={{
                                        boxShadow: 'none', // Remove shadow
                                        width: '500px', // Increase length towards the right
                                    }}
                                />
                            </div>
                            {/* Replace SHA Algorithm dropdown */}
                            <div className="flex-1">
                                <label htmlFor="algorithm" className="block font-medium mb-1">SHA Algorithm</label>
                                <Selector
                                    selected={shaAlgorithms.find(opt => opt.value === algorithm) || shaAlgorithms[0]}
                                    onSelectedChange={(selected) => setAlgorithm(selected.value as ShaAlgorithm)}
                                    options={shaAlgorithms}
                                    style={{
                                        boxShadow: 'none', // Remove shadow
                                        width: '500px', // Increase length towards the right
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Card-based layout for Generate and Verify */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Generate Hash Card */}
                    <div className="flex-1 rounded-2xl card-shadow p-8 bg-background border border-background min-h-[400px] flex flex-col">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                            <h2 className="text-lg font-semibold mb-2">Generate SHA Hash</h2>
                            <button
                                type="submit"
                                className='w-full bg-background border-2 border-btn-primary rounded-xl px-5 py-2 pr-14 focus:outline-none focus:ring-2 focus:ring-btn-primary font-mono text-lg text-foreground placeholder:text-btn-primary shadow'
                                style={{
                                    background: 'var(--btn-primary)',
                                    color: 'var(--btn-text)'
                                }}
                                disabled={loading}
                                aria-disabled={loading}
                            >
                                {loading ? 'Hashing...' : 'Generate Hash'}
                            </button>
                            {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
                            {result && (
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label htmlFor="hexOutput" className="block font-medium mb-1">Hash Output (Hex)</label>
                                        <div className="flex items-center gap-2">
                                            <textarea
                                                id="hexOutput"
                                                className="w-full rounded px-2 py-1 font-mono text-xs"
                                                rows={2}
                                                value={result?.hex || ''}
                                                readOnly
                                                tabIndex={0}
                                                aria-readonly
                                                style={{ border: '1px solid #e5e7eb' }}
                                            />
                                            <button
                                                type="button"
                                                className="px-2 py-1 border rounded text-xs"
                                                style={{ color: 'var(--icon-color)', borderColor: 'var(--icon-color)' }}
                                                onClick={() => handleCopy('hex')}
                                                aria-label="Copy hex output"
                                            >
                                                {copied.hex ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="base64Output" className="block font-medium mb-1">Hash Output (Base64)</label>
                                        <div className="flex items-center gap-2">
                                            <textarea
                                                id="base64Output"
                                                className="w-full rounded px-2 py-1 font-mono text-xs"
                                                rows={2}
                                                value={result?.base64 || ''}
                                                readOnly
                                                tabIndex={0}
                                                aria-readonly
                                                style={{ border: '1px solid #e5e7eb' }}
                                            />
                                            <button
                                                type="button"
                                                className="px-2 py-1 border rounded text-xs"
                                                style={{ color: 'var(--icon-color)', borderColor: 'var(--icon-color)' }}
                                                onClick={() => handleCopy('base64')}
                                                aria-label="Copy base64 output"
                                            >
                                                {copied.base64 ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-2">
                                        {`${shaAlgorithms.find(a => a.value === result?.algorithm)?.label || result?.algorithm?.toUpperCase() || ''} • ${result?.length?.bits ?? ''} bits • ${result?.length?.hexChars ?? ''} hex chars • ${result?.length?.bytes ?? ''} bytes`}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                    {/* Verify Hash Card */}
                    <div className="flex-1 rounded-2xl card-shadow p-8 bg-background border border-background min-h-[400px] flex flex-col">
                        <h2 className="text-lg font-semibold mb-2">Verify / Compare SHA Hash</h2>
                        <div className="text-xs text-gray-600 mb-4">
                            Recompute the hash using the same input and verify it against a provided hash value.<br />
                            SHA hashes are one-way and cannot be decoded.
                        </div>
                        <VerificationSection
                            inputText={inputText}
                            inputEncoding={inputEncoding}
                            algorithm={algorithm}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}