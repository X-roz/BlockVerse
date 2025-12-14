"use client"

import { useState } from 'react';
import { KeyRound, Cog } from 'lucide-react';
import VerificationSection from '@/app/hash-play/components/sha/Sha3Verify';
import { Selector } from '@/app/components/Selector';

const sha3Algorithms: { value: Sha3Algorithms; label: string }[] = [
    { value: 'SHA3-256', label: 'SHA3-256' },
    { value: 'SHA3-512', label: 'SHA3-512' },
    { value: 'Keccak-256', label: 'Keccak-256' },
];

const inputEncodings: { value: InputEncoding; label: string }[] = [
    { value: 'utf-8', label: 'UTF-8' },
    { value: 'hex', label: 'Hex' },
    { value: 'base64', label: 'Base64' },
];

export type Sha3Algorithms = 'SHA3-256' | 'SHA3-512' | 'Keccak-256';
export type InputEncoding = 'utf-8' | 'hex' | 'base64';

export default function Sha3Page() {

    const [inputText, setInputText] = useState('');
    const [inputEncoding, setInputEncoding] = useState<InputEncoding>('utf-8');
    const [algorithm, setAlgorithm] = useState<Sha3Algorithms>('SHA3-256');
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
                const res = await fetch('/api/sha3-hashing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        inputText,
                        inputEncoding,
                        algorithm: algorithm.toLowerCase(), // Convert algorithm to lowercase
                    }),
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
                                <h2 className="text-2xl font-bold text-foreground drop-shadow">Secure Hash Algorithm 3</h2>
                                <p className="text-foreground text-base">Explore various SHA-3 hashing algorithms</p>
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
                            {/* Input Encoding dropdown */}
                            <div className="flex-1">
                                <label htmlFor="inputEncoding" className="block font-medium mb-1">Input Encoding</label>
                                <Selector
                                    selected={inputEncodings.find(opt => opt.value === inputEncoding) || inputEncodings[0]}
                                    onSelectedChange={(selected) => setInputEncoding(selected.value as InputEncoding)}
                                    options={inputEncodings}
                                    style={{
                                        width: '100%', // Make it flexible for mobile screens
                                        maxWidth: '500px', // Set a maximum width for larger screens
                                    }}
                                />
                            </div>
                            {/* SHA Algorithm dropdown */}
                            <div className="flex-1">
                                <label htmlFor="algorithm" className="block font-medium mb-1">SHA-3 Algorithms</label>
                                <Selector
                                    selected={sha3Algorithms.find(opt => opt.value === algorithm) || sha3Algorithms[0]}
                                    onSelectedChange={(selected) => setAlgorithm(selected.value as Sha3Algorithms)}
                                    options={sha3Algorithms}
                                    style={{
                                        width: '100%', // Make it flexible for mobile screens
                                        maxWidth: '500px', // Set a maximum width for larger screens
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
                            <h2 className="text-lg font-semibold mb-2">Generate SHA-3 Hash</h2>
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
                                {loading ? 'Hashing...' : <Cog className="w-5 h-5 inline-block mr-2 text-icon-color" />}Generate Hash
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
                                    <div className="text-xs font-semibold mt-2">
                                        {`${sha3Algorithms.find(a => a.value === result?.algorithm)?.label || result?.algorithm?.toUpperCase() || ''} • ${result?.length?.bits ?? ''} bits • ${result?.length?.hexChars ?? ''} hex chars • ${result?.length?.bytes ?? ''} bytes`}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                    {/* Verify Hash Card */}
                    <div className="flex-1 rounded-2xl card-shadow p-8 bg-background border border-background min-h-[400px] flex flex-col">
                        <h2 className="text-lg font-semibold mb-2">Verify / Compare SHA-3 Hash</h2>
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