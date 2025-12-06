"use client";
// Address Util Page
import React, { useState } from "react";

const NETWORKS = ["BTC", "ETH", "SOL"];

export default function AddressUtilPage() {
  const [network, setNetwork] = useState("BTC");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  // Solana keypair state
  const [solKeypair, setSolKeypair] = useState<{privateKey: string; publicKey: string} | null>(null);
  const [solLoading, setSolLoading] = useState(false);
  const [solError, setSolError] = useState("");
  // Solana keypair generation handler
  const handleGenerateSolKeypair = async () => {
    setSolLoading(true);
    setSolError("");
    setSolKeypair(null);
    setSolEncodedAddress(null);
    setSolEncodeError("");
    try {
      const res = await fetch("/api/solana/generate-keypair", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate keypair");
      const data = await res.json();
      setSolKeypair(data);
    } catch (err) {
      setSolError("Failed to generate Solana keypair.");
    }
    setSolLoading(false);
  };

  // Solana encode state and handler
  const [solEncodedAddress, setSolEncodedAddress] = useState<string | null>(null);
  const [solEncodeLoading, setSolEncodeLoading] = useState(false);
  const [solEncodeError, setSolEncodeError] = useState("");
  const handleEncodeSolAddress = async () => {
    if (!solKeypair?.publicKey) return;
    setSolEncodeLoading(true);
    setSolEncodeError("");
    setSolEncodedAddress(null);
    try {
      const res = await fetch("/api/solana/encode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: solKeypair.publicKey }),
      });
      if (!res.ok) throw new Error("Failed to encode address");
      const data = await res.json();
      setSolEncodedAddress(data.address);
    } catch (err) {
      setSolEncodeError("Failed to encode Solana address.");
    }
    setSolEncodeLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/address-validator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ network, address }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to validate address.");
    }
    setLoading(false);
  };

  // Ethereum keypair and address state
  const [ethKeypair, setEthKeypair] = useState<{ privateKey: string; publicKey: string } | null>(null);
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const [ethChecksumAddress, setEthChecksumAddress] = useState<string | null>(null);
  const [ethLoading, setEthLoading] = useState(false);
  const [ethError, setEthError] = useState("");

  // Ethereum keypair generation handler
  const handleGenerateEthKeypair = async () => {
    setEthLoading(true);
    setEthError("");
    setEthKeypair(null);
    setEthAddress(null);
    setEthChecksumAddress(null);
    try {
      const res = await fetch("/api/ethereum/generate-keypair", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate Ethereum keypair");
      const data = await res.json();
      setEthKeypair(data);
    } catch (err) {
      setEthError("Failed to generate Ethereum keypair.");
    }
    setEthLoading(false);
  };

  // Ethereum address derivation handler
  const handleGenerateEthAddress = async () => {
    if (!ethKeypair?.publicKey) return;
    setEthLoading(true);
    setEthError("");
    setEthAddress(null);
    try {
      const res = await fetch("/api/ethereum/derive-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: ethKeypair.publicKey }),
      });
      if (!res.ok) throw new Error("Failed to derive Ethereum address");
      const data = await res.json();
      setEthAddress(data.address);
    } catch (err) {
      setEthError("Failed to derive Ethereum address.");
    }
    setEthLoading(false);
  };

  // Ethereum checksum application handler
  const handleApplyEthChecksum = async () => {
    if (!ethAddress) return;
    setEthLoading(true);
    setEthError("");
    setEthChecksumAddress(null);
    try {
      const res = await fetch("/api/ethereum/apply-checksum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: ethAddress }),
      });
      if (!res.ok) throw new Error("Failed to apply checksum");
      const data = await res.json();
      setEthChecksumAddress(data.checksumAddress);
    } catch (err) {
      setEthError("Failed to apply checksum.");
    }
    setEthLoading(false);
  };

  // Bitcoin keypair and address state
  const [btcKeypair, setBtcKeypair] = useState<{ privateKey: string; publicKeyCompressed: string; publicKeyUncompressed: string } | null>(null);
  const [btcLoading, setBtcLoading] = useState(false);
  const [btcError, setBtcError] = useState("");
  const [btcLegacyAddress, setBtcLegacyAddress] = useState<string | null>(null);
  const [btcSegwitAddress, setBtcSegwitAddress] = useState<string | null>(null);

  const handleGenerateBtcKeypair = async () => {
    setBtcLoading(true);
    setBtcError("");
    setBtcKeypair(null);
    setBtcLegacyAddress(null);
    setBtcSegwitAddress(null);
    try {
      const res = await fetch("/api/bitcoin/generate-keypair", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate Bitcoin keypair");
      const data = await res.json();
      setBtcKeypair(data);
    } catch (err) {
      setBtcError("Failed to generate Bitcoin keypair.");
    }
    setBtcLoading(false);
  };

  const handleGenerateBtcLegacyAddress = async () => {
    if (!btcKeypair?.publicKeyCompressed) return;
    setBtcLoading(true);
    setBtcError("");
    setBtcLegacyAddress(null);
    try {
      const res = await fetch("/api/bitcoin/derive-base58", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKeyCompressed: btcKeypair.publicKeyCompressed }),
      });
      if (!res.ok) throw new Error("Failed to derive legacy address");
      const data = await res.json();
      setBtcLegacyAddress(data.address);
    } catch (err) {
      setBtcError("Failed to derive legacy address.");
    }
    setBtcLoading(false);
  };

  const handleGenerateBtcSegwitAddress = async () => {
    if (!btcKeypair?.publicKeyCompressed) return;
    setBtcLoading(true);
    setBtcError("");
    setBtcSegwitAddress(null);
    try {
      const res = await fetch("/api/bitcoin/derive-bech32", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKeyCompressed: btcKeypair.publicKeyCompressed }),
      });
      if (!res.ok) throw new Error("Failed to derive SegWit address");
      const data = await res.json();
      setBtcSegwitAddress(data.address);
    } catch (err) {
      setBtcError("Failed to derive SegWit address.");
    }
    setBtcLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Address Validator</h1>
      {/* Generic Network Selection */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Network</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={network}
          onChange={e => setNetwork(e.target.value)}
        >
          {NETWORKS.map(net => (
            <option key={net} value={net}>{net}</option>
          ))}
        </select>
      </div>


      {/* Conditional UI based on selected network */}
      {/* Show both validation form and Solana playground for SOL */}
      {network === "SOL" && (
        <>
          {/* Address validation form for SOL */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Enter address"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Validating..." : "Validate"}
            </button>
          </form>
          {/* Solana Key Generation Playground */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Solana Key Generation Playground</h2>
              <div className="mb-2">Step 1: Generate Keypair</div>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                onClick={handleGenerateSolKeypair}
                disabled={solLoading}
              >
                {solLoading ? "Generating..." : "Generate Keypair"}
              </button>
              {solError && <div className="mt-2 text-red-600">{solError}</div>}
              {solKeypair && (
                <div className="mt-4">
                  <div className="mb-2">
                    <span className="font-medium">Generated Private Key:</span>
                    <div className="break-all bg-gray-100 p-2 rounded text-xs">{solKeypair.privateKey}</div>
                  </div>
                  <br />
                  <div className="mb-4">
                    <span className="font-medium">Generated Public Key:</span>
                    <div className="break-all bg-gray-100 p-2 rounded text-xs">{solKeypair.publicKey}</div>
                  </div>
                  {/* Step 2: Encode Public Key */}
                  <div className="mb-2">Step 2: Encode Public Key to Solana Address</div>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleEncodeSolAddress}
                    disabled={solEncodeLoading}
                  >
                    {solEncodeLoading ? "Encoding..." : "Encode to Base58 (Solana Address)"}
                  </button>
                  {solEncodeError && <div className="mt-2 text-red-600">{solEncodeError}</div>}
                  {solEncodedAddress && (
                    <div className="mt-4">
                      <span className="font-medium">Solana Address (Base58 Encoded):</span>
                      <div className="break-all bg-gray-100 p-2 rounded text-xs">{solEncodedAddress}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* Default address validation form for BTC/ETH */}
      {(network === "BTC" || network === "ETH") && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter address"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Validating..." : "Validate"}
          </button>
        </form>
      )}

      {/* Ethereum Key Generation Playground - Shown only for ETH network */}
      {network === "ETH" && (
        <>
          <div className="space-y-6">
            <h2 className="text-lg font-semibold mb-2">Ethereum Key Generation Playground</h2>
            <div>
              <div className="mb-2">Step 1: Generate Keypair</div>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                onClick={handleGenerateEthKeypair}
                disabled={ethLoading}
              >
                {ethLoading ? "Generating..." : "Generate Keypair"}
              </button>
              {ethError && <div className="mt-2 text-red-600">{ethError}</div>}
              {ethKeypair && (
                <div className="mt-4">
                  <div className="mb-2">
                    <span className="font-medium">Generated Private Key:</span>
                    <div className="break-all bg-gray-100 p-2 rounded text-xs">{ethKeypair.privateKey}</div>
                  </div>
                  <div className="mb-4">
                    <span className="font-medium">Generated Public Key:</span>
                    <div className="break-all bg-gray-100 p-2 rounded text-xs">{ethKeypair.publicKey}</div>
                  </div>
                </div>
              )}
            </div>

            {ethKeypair && (
              <div>
                <div className="mb-2">Step 2: Derive Ethereum Address</div>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleGenerateEthAddress}
                  disabled={ethLoading}
                >
                  {ethLoading ? "Deriving..." : "Generate Address"}
                </button>
                {ethError && <div className="mt-2 text-red-600">{ethError}</div>}
                {ethAddress && (
                  <div className="mt-4">
                    <span className="font-medium">Derived Address:</span>
                    <div className="break-all bg-gray-100 p-2 rounded text-xs">{ethAddress}</div>
                  </div>
                )}
              </div>
            )}

            {ethAddress && (
              <div>
                <div className="mb-2">Step 3: Apply Checksum</div>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                  onClick={handleApplyEthChecksum}
                  disabled={ethLoading}
                >
                  {ethLoading ? "Applying..." : "Apply Checksum"}
                </button>
                {ethError && <div className="mt-2 text-red-600">{ethError}</div>}
                {ethChecksumAddress && (
                  <div className="mt-4">
                    <span className="font-medium">Checksummed Address:</span>
                    <div className="break-all bg-gray-100 p-2 rounded text-xs">{ethChecksumAddress}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Bitcoin Key Generation Playground - Shown only for BTC network */}
      {network === "BTC" && (
        <>
          <div className="space-y-6">
            <h2 className="text-lg font-semibold mb-2">Bitcoin Key Generation Playground</h2>
            <div>
              <div className="mb-2">Step 1: Generate Keypair</div>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                onClick={handleGenerateBtcKeypair}
                disabled={btcLoading}
              >
                {btcLoading ? "Generating..." : "Generate Keypair"}
              </button>
              {btcError && <div className="mt-2 text-red-600">{btcError}</div>}
              {btcKeypair && (
                <div className="mt-4">
                  <div className="mb-2">
                    <span className="font-medium">Generated Private Key (WIF):</span>
                    <div className="break-all bg-gray-100 p-2 rounded text-xs">{btcKeypair.privateKey}</div>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Compressed Public Key:</span>
                    <div className="break-all bg-gray-100 p-2 rounded text-xs">{btcKeypair.publicKeyCompressed}</div>
                  </div>
                  <div className="mb-4">
                    <span className="font-medium">Uncompressed Public Key:</span>
                    <div className="break-all bg-gray-100 p-2 rounded text-xs">{btcKeypair.publicKeyUncompressed}</div>
                  </div>
                </div>
              )}
            </div>
            {btcKeypair && (
              <div>
                <div className="mb-2">Step 2: Derive Address</div>
                <div className="flex gap-2 mb-2">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    onClick={handleGenerateBtcLegacyAddress}
                    disabled={btcLoading}
                  >
                    {btcLoading ? "Deriving..." : "Legacy Address (Base58)"}
                  </button>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
                    onClick={handleGenerateBtcSegwitAddress}
                    disabled={btcLoading}
                  >
                    {btcLoading ? "Deriving..." : "SegWit Address (Bech32)"}
                  </button>
                </div>
                {btcError && <div className="mt-2 text-red-600">{btcError}</div>}
                {btcLegacyAddress && (
                  <div className="mt-4">
                    <span className="font-medium">Legacy Address (Base58):</span>
                    <div className="break-all bg-gray-100 p-2 rounded text-xs">{btcLegacyAddress}</div>
                  </div>
                )}
                {btcSegwitAddress && (
                  <div className="mt-4">
                    <span className="font-medium">SegWit Address (Bech32):</span>
                    <div className="break-all bg-gray-100 p-2 rounded text-xs">{btcSegwitAddress}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {error && <div className="mt-4 text-red-600">{error}</div>}
      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Result</h2>
          {result.valid ? (
            <ul className="space-y-1">
              <li><span className="font-medium">Status:</span> <span className="text-green-600">Valid</span></li>
              {/* ETH fields */}
              {result.format && <li><span className="font-medium">Format:</span> {result.format}</li>}
              {typeof result.checksumValid === "boolean" && (
                <li><span className="font-medium">Checksum Valid:</span> {result.checksumValid ? "Yes" : "No"}</li>
              )}
              {/* BTC/SOL fields */}
              {result.type && (
                <li><span className="font-medium">Type:</span> {result.type}</li>
              )}
              {result.encoding && (
                <li><span className="font-medium">Encoding:</span> {result.encoding}</li>
              )}
              {result.network && (
                <li><span className="font-medium">Network:</span> {result.network}</li>
              )}
            </ul>
          ) : (
            <ul className="space-y-1">
              <li><span className="font-medium">Status:</span> <span className="text-red-600">Invalid</span></li>
              {/* ETH fields */}
              {result.format && <li><span className="font-medium">Format:</span> {result.format}</li>}
              {typeof result.checksumValid === "boolean" && (
                <li><span className="font-medium">Checksum Valid:</span> {result.checksumValid ? "Yes" : "No"}</li>
              )}
              {/* BTC/SOL fields */}
              {result.type && <li><span className="font-medium">Type:</span> {result.type}</li>}
              {result.encoding && <li><span className="font-medium">Encoding:</span> {result.encoding}</li>}
              {result.network && <li><span className="font-medium">Network:</span> {result.network}</li>}
              <li><span className="font-medium">Reason:</span> {result.reason || result.message}</li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
