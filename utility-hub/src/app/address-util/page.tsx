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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header dropdown={<NetworkSelector selectedNetwork={selectedNetwork} onNetworkChange={setSelectedNetwork} />} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-8">
          {/* Validator Section */}
          <div className="rounded-2xl shadow-4xl p-8 min-h-[400px] border border-background bg-background">
            <Suspense fallback={<div className="text-center text-foreground">Loading Validator...</div>}>
              <Validator 
                network={selectedNetwork}
                onValidate={() => {}}
              />
            </Suspense>
          </div>
          {/* Address Generator Section */}
          <div className="rounded-2xl shadow-4xl p-8 min-h-[400px] border border-background bg-background">
            <Suspense fallback={<div className="text-center text-foreground">Loading Generator...</div>}>
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
