"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Network } from "@/app/address-util/page";

interface NetworkSelectorProps {
  selectedNetwork: Network;
  onNetworkChange: (network: Network) => void;
}

const networks = [
  { value: "ETH", label: "Ethereum" },
  { value: "BTC", label: "Bitcoin" },
  { value: "SOL", label: "Solana" },
];

export function NetworkSelector({
  selectedNetwork,
  onNetworkChange,
}: NetworkSelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = networks.find((n) => n.value === selectedNetwork);

  return (
    <div className="relative w-[200px] select-none">
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between bg-background backdrop-blur-xl border border-background rounded-xl px-4 py-2.5 shadow cursor-pointer transition-all hover:bg-btn-primary/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-btn-primary border border-background" />
          <span className="text-foreground font-semibold text-[17px] whitespace-nowrap">
            {selected?.label} ({selected?.value})
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-icon-color transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute z-20 w-full mt-2 bg-background/95 backdrop-blur-xl border border-background rounded-xl shadow-xl animate-in fade-in zoom-in duration-200"
        >
          {networks.map((n) => (
            <div
              key={n.value}
              onClick={() => {
                onNetworkChange(n.value as Network);
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-foreground text-[16px] cursor-pointer hover:bg-btn-primary/20 transition-all"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-btn-primary border border-background" />
              {n.label} ({n.value})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
