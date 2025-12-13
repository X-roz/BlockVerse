"use client"

import { useState, Suspense } from 'react';
import { Selector } from '@/app/components/Selector';
import { Header } from '@/app/components/Header';

export type HashAlgorithms = 'SHA' | 'MD5' | 'BLAKE2'; // Add or adjust as needed

export default function HashPlayPage() {
    const [selectedNetwork, setSelectedNetwork] = useState<HashAlgorithms>('SHA');
    const hashAlgoOptions = [
        { value: "SHA", label: "SHA", iconColor: "#87F5F5" },
        { value: "MD5", label: "MD5", iconColor: "orange" },
        { value: "BLAKE2", label: "BLAKE2", iconColor: "#CBA2EA" },
    ];
    const selectedOption = hashAlgoOptions.find((n) => n.value === selectedNetwork) || hashAlgoOptions[0];
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <Header
                dropdown={
                    <Selector
                        selected={selectedOption}
                        onSelectedChange={(option) => setSelectedNetwork(option.value as HashAlgorithms)}
                        options={hashAlgoOptions}
                    />
                }
            />
        </div>
    );
}
