import React, { useState } from 'react';
import type { MultiplierSelectProps } from './types';

const COMMON_MULTIPLIERS = [
  { value: 50, label: "ES - E-mini S&P 500 (50)" },
  { value: 20, label: "NQ - E-mini Nasdaq (20)" },
  { value: 50, label: "RTY- E-mini Russell 2000 (50)" },
  { value: 1000, label: "CL - Crude Oil (1000)" },
  { value: 5, label: "MES - Micro E-mini S&P 500 (5)" },
  { value: 2, label: "MNQ - Micro E-mini Nasdaq (2)" },
  { value: 5, label: "M2K - Micro E-mini Russell 2000 (5)" },
  { value: 100, label: "MCL - Micro WTI Crude Oil (100)" },
  { value: 1000, label: "UB - Ultra Bond (1000)" },
  { value: "custom", label: "Custom Value..." }
] as const;

export function MultiplierSelect({ 
  defaultValue,
  onChange,
  name
}: MultiplierSelectProps) {
  const [selectedOption, setSelectedOption] = useState(() => {
    if (!defaultValue) return COMMON_MULTIPLIERS[0].value;
    return COMMON_MULTIPLIERS.some(m => m.value === defaultValue) 
      ? defaultValue 
      : "custom";
  });
  const [customValue, setCustomValue] = useState(
    defaultValue?.toString() || ""
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value === "custom" ? "custom" : parseInt(value));
    if (value !== "custom" && onChange) {
      onChange(parseInt(value));
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomValue(value);
    if (value && onChange) {
      onChange(parseInt(value));
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Point Multiplier</label>
      <div className="space-y-2">
        <select
          className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500"
          value={selectedOption}
          onChange={handleSelectChange}
          name={name}
        >
          {COMMON_MULTIPLIERS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        
        {selectedOption === "custom" && (
          <input
            type="number"
            value={customValue}
            onChange={handleCustomChange}
            min="1"
            step="1"
            className="w-full p-2 border rounded bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Enter custom multiplier..."
            onKeyDown={(e) => {
              if (e.key === '.') {
                e.preventDefault();
              }
            }}
            required
          />
        )}
      </div>
    </div>
  );
}
