"use client";

import { ChevronDown, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Entry } from "@/types/nutrition";

type EntryListProps = {
  entries: Entry[];
  onDelete: (entryId: number) => void;
};

export default function EntryList({ entries, onDelete }: EntryListProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpanded = (entryId: number) => {
    setExpanded((prev) => ({ ...prev, [entryId]: !prev[entryId] }));
  };

  return (
    <section>
      <h2 className="text-xs font-black text-slate-400 uppercase mb-3 px-1 tracking-widest">
        Entry List
      </h2>
      <div className="space-y-2">
        {entries.length === 0 && (
          <div className="bg-white border border-dashed rounded-xl p-8 text-center text-slate-300 italic text-sm">
            Log is empty
          </div>
        )}
        {entries.map((item) => {
          const isMeal = item.type === "meal";
          const isExpanded = expanded[item.id];
          const totalGrams = isMeal
            ? item.ingredients.reduce((sum, ingredient) => sum + ingredient.grams, 0)
            : item.grams;
          const label = isMeal ? item.name : item.description;
          return (
            <div key={item.id} className="space-y-2">
              <div className="bg-white p-3 rounded-lg border shadow-sm flex justify-between items-center animate-in fade-in">
                <div className="flex items-start gap-3">
                  {isMeal && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(item.id)}
                      className="mt-1 text-slate-300 hover:text-amber-500"
                      aria-label={isExpanded ? "Collapse meal" : "Expand meal"}
                      aria-expanded={isExpanded}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400 font-bold">
                      {totalGrams}g{isMeal ? ` • ${item.ingredients.length} items` : ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 text-slate-200 hover:text-red-400"
                  aria-label={`Remove ${label}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {isMeal && isExpanded && (
                <div className="ml-6 space-y-2 border-l border-slate-200 pl-4">
                  {item.ingredients.map((ingredient) => (
                    <div
                      key={`${item.id}-${ingredient.fdcId}-${ingredient.description}`}
                      className="flex items-center justify-between text-xs text-slate-500"
                    >
                      <span className="font-medium text-slate-600">
                        {ingredient.description}
                      </span>
                      <span className="font-semibold text-slate-400">
                        {ingredient.grams}g
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
