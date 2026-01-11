"use client";

import { AlertCircle, ChevronRight, RefreshCw, Search, Star } from "lucide-react";
import type { FoodSearchResult, SavedFood } from "@/types/nutrition";

type FoodSearchCardProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSearching: boolean;
  error: string | null;
  rateLimited: boolean;
  results: FoodSearchResult[];
  onSelectFood: (fdcId: number) => void;
  savedFoods: SavedFood[];
  onToggleSave: (food: SavedFood) => void;
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
  savedFoods,
  onToggleSave,
}: FoodSearchCardProps) {
  const isSaved = (fdcId: number) => savedFoods.some((item) => item.fdcId === fdcId);
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
          Rate limited. Please try again in a moment.
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

      <div className="mt-4 space-y-3">
        {savedFoods.length > 0 && (
          <div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">
              Saved Foods
            </p>
            <div className="space-y-1">
              {savedFoods.map((food) => (
                <div
                  key={food.fdcId}
                  className="w-full text-left p-3 rounded-lg border border-transparent flex justify-between items-center group bg-amber-50/60"
                >
                  <button
                    onClick={() => onSelectFood(food.fdcId)}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-medium leading-tight">{food.description}</p>
                    <span className="text-[10px] uppercase text-amber-400 font-bold">
                      Saved
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleSave(food)}
                    className="ml-2 text-amber-500 hover:text-amber-600"
                    aria-label="Remove saved food"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1 max-h-60 overflow-y-auto">
          {results.map((food) => {
            const saved = isSaved(food.fdcId);
            return (
              <div
                key={food.fdcId}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-transparent flex justify-between items-center group"
              >
                <button
                  onClick={() => onSelectFood(food.fdcId)}
                  className="flex-1 text-left pr-2"
                >
                  <p className="text-sm font-medium leading-tight">{food.description}</p>
                  <span className="text-[10px] uppercase text-slate-400 font-bold">
                    {food.dataType}
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onToggleSave({ fdcId: food.fdcId, description: food.description })
                    }
                    className={`text-slate-300 hover:text-amber-500 ${
                      saved ? "text-amber-500" : ""
                    }`}
                    aria-label={saved ? "Remove saved food" : "Save food"}
                  >
                    <Star className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
