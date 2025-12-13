"use client"

import { useState } from 'react';
import { Header } from '@/app/components/Header';
import { Selector } from '@/app/components/Selector';
import ShaFamilyPage from './components/sha/ShaFamilyPage';

export type ShaAlgorithm = 'sha256' | 'sha512' | 'sha224' | 'sha384';
export type InputEncoding = 'utf-8' | 'hex' | 'base64';
export type HashAlgorithms = 'SHA' | 'BLAKE' | 'MD5'; // Add or adjust as needed

export default function HashPlayPage() {
    const [selectedAlgo, setSelectedAlgo] = useState<HashAlgorithms>('SHA');
    const algorithmOptions = [
        { value: "SHA", iconColor: "#87F5F5" },
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
              {selectedAlgo === 'SHA' && (
                  <ShaFamilyPage />
              )}
        </div>
    );
}
