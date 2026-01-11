"use client";

import { Trash2 } from "lucide-react";
import type { Entry } from "@/types/nutrition";

type EntryListProps = {
  entries: Entry[];
  onDelete: (entryId: number) => void;
};

export default function EntryList({ entries, onDelete }: EntryListProps) {
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
        {entries.map((item) => (
          <div
            key={item.id}
            className="bg-white p-3 rounded-lg border shadow-sm flex justify-between items-center animate-in fade-in"
          >
            <div>
              <p className="text-sm font-bold text-slate-700">{item.description}</p>
              <p className="text-xs text-slate-400 font-bold">{item.grams}g</p>
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-slate-200 hover:text-red-400"
              aria-label={`Remove ${item.description}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
