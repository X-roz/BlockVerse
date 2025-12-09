"use client"

import { useState, Suspense } from 'react';
import { AddressGenerator } from './components/addressGenerator';
import { Validator } from './components/validator';
import { Header } from '@/app/components/Header';
import { NetworkSelector } from './components/networkSelector';

export type Network = 'ETH' | 'BTC' | 'SOL'; // Add or adjust as needed

export default function AddressUtilPage() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('ETH');
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b8e0e6] via-[#4e8e8e] to-[#316666] text-[#317979]">
      {/* Header */}
      <Header dropdown={<NetworkSelector selectedNetwork={selectedNetwork} onNetworkChange={setSelectedNetwork} />} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-8">
          {/* Validator Section */}
          <div className="rounded-2xl shadow-2xl p-8 min-h-[400px] border border-[#4e8e8e]/30 bg-gradient-to-br from-[#f4f7fa] via-[#b8e0e6] to-[#4e8e8e]">
            <Suspense fallback={<div className="text-center text-[#4e8e8e]">Loading Validator...</div>}>
              <Validator 
                network={selectedNetwork}
                onValidate={() => {}}
              />
            </Suspense>
          </div>
          {/* Address Generator Section */}
          <div className="rounded-2xl shadow-2xl p-8 min-h-[400px] border border-[#b8e0e6]/30 bg-gradient-to-br from-[#f4f7fa] via-[#b8e0e6] to-[#509494]">
            <Suspense fallback={<div className="text-center text-[#183a3a]">Loading Generator...</div>}>
              <AddressGenerator 
                network={selectedNetwork}
                onGenerate={() => {}}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
