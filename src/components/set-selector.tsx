"use client";

import { Set } from "@/types/card";

interface SetSelectorProps {
  sets: Set[];
  currentSet: string;
  onSetChange: (setCode: string) => void;
  isLoading?: boolean;
}

export function SetSelector({
  sets,
  currentSet,
  onSetChange,
  isLoading,
}: SetSelectorProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="set-select"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Set
      </label>
      <select
        id="set-select"
        value={currentSet}
        onChange={(e) => onSetChange(e.target.value)}
        disabled={isLoading}
        className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {sets.map((set) => (
          <option key={set.code} value={set.code}>
            {set.name} ({set.code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  );
}
