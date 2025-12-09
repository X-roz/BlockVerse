"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Network } from "@/app/address-util/page";

interface NetworkSelectorProps {
  selectedNetwork: Network;
  onNetworkChange: (network: Network) => void;
}

const networks = [
  { value: "ETH", label: "Ethereum", color: "bg-[#4e8e8e]" }, // driftwood teal
  { value: "BTC", label: "Bitcoin", color: "bg-[#b8e0e6]" }, // ocean haze
  { value: "SOL", label: "Solana", color: "bg-[#183a3a]" }, // tidal depths
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
        className="
          flex items-center justify-between 
          bg-[#b8e0e6]/40 backdrop-blur-xl 
          border border-[#316666]/30 rounded-xl px-4 py-2.5
          shadow-[0_0_20px_rgba(24,58,58,0.15)]
          hover:bg-[#b8e0e6]/60 cursor-pointer transition-all
        "
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full ${selected?.color} border border-[#183a3a]/30`}
          />
          <span className="text-[#183a3a] font-semibold text-[17px] whitespace-nowrap">
            {selected?.label} ({selected?.value})  
          </span>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-[#4e8e8e] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="
            absolute z-20 w-full mt-2 
            bg-[#f4f7fa]/95 backdrop-blur-xl
            border border-[#4e8e8e]/20 rounded-xl
            shadow-xl
            animate-in fade-in zoom-in duration-200
          "
        >
          {networks.map((n) => (
            <div
              key={n.value}
              onClick={() => {
                onNetworkChange(n.value as Network);
                setOpen(false);
              }}
              className="
                flex items-center gap-3 px-4 py-2.5 
                text-[#183a3a] text-[16px] cursor-pointer
                hover:bg-[#b8e0e6]/40 transition-all
              "
            >
              <div
                className={`w-3.5 h-3.5 rounded-full ${n.color} border border-[#4e8e8e]/30`}
              />
              {n.label} ({n.value})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
