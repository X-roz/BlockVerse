"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SelectorOption {
  value: string;
  label?: string;
  iconColor?: string;
}

interface SelectorProps<T extends SelectorOption> {
  selected: T;
  onSelectedChange: (selected: T) => void;
  options: T[];
}

export function Selector<T extends SelectorOption>({
  selected,
  onSelectedChange,
  options,
}: SelectorProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-[200px] select-none">
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between bg-background backdrop-blur-xl border border-background rounded-xl px-4 py-2.5 card-shadow cursor-pointer transition-all hover:bg-btn-primary/20"
      >
        <div className="flex items-center gap-3">
          {selected.iconColor && (
            <div
              className="w-3.5 h-3.5 rounded-full border border-background"
              style={{ backgroundColor: selected.iconColor }}
            />
          )}
          <span className="text-foreground font-semibold text-[17px] whitespace-nowrap">
            {selected.label ?? selected.value}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-icon-color transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute z-20 w-full mt-2 bg-background/95 backdrop-blur-xl border border-background rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onSelectedChange(option);
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-foreground text-[16px] cursor-pointer hover:bg-btn-primary/20 transition-all"
            >
              {option.iconColor && (
                <div
                  className="w-3.5 h-3.5 rounded-full border border-background"
                  style={{ backgroundColor: option.iconColor }}
                />
              )}
              {option.label ?? option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
