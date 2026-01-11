"use client";

import { AlertCircle, ChevronRight, RefreshCw, Search } from "lucide-react";
import type { FoodSearchResult } from "@/types/nutrition";

type FoodSearchCardProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSearching: boolean;
  error: string | null;
  rateLimited: boolean;
  results: FoodSearchResult[];
  onSelectFood: (fdcId: number) => void;
};

export default function FoodSearchCard({
  searchQuery,
  onSearchQueryChange,
  onSubmit,
  isSearching,
  error,
  rateLimited,
  results,
  onSelectFood,
}: FoodSearchCardProps) {
  return (
    <section className="bg-white p-4 rounded-xl shadow-sm border">
      <form onSubmit={onSubmit} className="relative">
        <input
          type="text"
          placeholder="Search food..."
          className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-amber-500 transition-all outline-none"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
      </form>

      {rateLimited && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-[11px] text-amber-700 font-medium">
          Rate limited. Add your free USDA API key to continue.
        </div>
      )}

      {isSearching && (
        <div className="mt-4 flex justify-center">
          <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="mt-4 space-y-1 max-h-60 overflow-y-auto">
        {results.map((food) => (
          <button
            key={food.fdcId}
            onClick={() => onSelectFood(food.fdcId)}
            className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-transparent flex justify-between items-center group"
          >
            <div className="flex-1 pr-2">
              <p className="text-sm font-medium leading-tight">{food.description}</p>
              <span className="text-[10px] uppercase text-slate-400 font-bold">
                {food.dataType}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500" />
          </button>
        ))}
      </div>
    </section>
  );
}
