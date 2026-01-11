"use client";

import { Clock, Settings } from "lucide-react";

type AppHeaderProps = {
  onToggleSettings: () => void;
  onResetToday: () => void;
};

export default function AppHeader({ onToggleSettings, onResetToday }: AppHeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-20 px-4 py-3 shadow-sm">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-amber-700" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Nutrition Tracker</h1>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={onToggleSettings}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onResetToday}
            className="text-xs font-bold text-slate-400 hover:text-red-600 uppercase"
          >
            Reset
          </button>
        </div>
      </div>
    </header>
  );
}
