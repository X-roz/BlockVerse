"use client"

import { useState } from 'react';
import { Header } from '@/app/components/Header';
import { Selector } from '@/app/components/Selector';
import Sha2Page from './components/sha/Sha2';

export type HashAlgorithms = 'SHA-2' | 'SHA-3' | 'BLAKE' | 'MD5'; // Add or adjust as needed

export default function HashPlayPage() {
    const [selectedAlgo, setSelectedAlgo] = useState<HashAlgorithms>('SHA-2');
    const algorithmOptions = [
        { value: "SHA-2", iconColor: "#87F5F5" },
        { value: "SHA-3", iconColor: "yellow" },
        { value: "BLAKE", iconColor: "orange" },
        { value: "MD5", iconColor: "#CBA2EA" },
    ];
    const selectedOption = algorithmOptions.find((n) => n.value === selectedAlgo) || algorithmOptions[0];

    return (

         <div className="min-h-screen bg-background text-foreground">
              {/* Header */}
              <Header
                dropdown={
                  <Selector
                    selected={selectedOption}
                    onSelectedChange={(option) => setSelectedAlgo(option.value as HashAlgorithms)}
                    options={algorithmOptions}
                  />
                }
              />
              {selectedAlgo === 'SHA-2' && (
                  <Sha2Page />
              )}
        </div>
    );
}
