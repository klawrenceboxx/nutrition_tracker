"use client";

import { AlertCircle, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { searchFoods, RateLimitError } from "@/lib/usda/client";
import { searchCachedFoods } from "@/lib/cache/foodCache";
import type { MealIngredient, MealTemplate } from "@/lib/meals/types";
import type { FoodSearchResult } from "@/types/nutrition";

export type MealModalMode = "create" | "view" | "edit";

type MealModalProps = {
  mode: MealModalMode;
  meal: MealTemplate | null;
  onClose: () => void;
  onSave: (payload: { name: string; ingredients: MealIngredient[] }) => void;
  onDelete?: () => void;
  onLogMeal?: () => void;
  onEdit?: () => void;
};

export default function MealModal({
  mode,
  meal,
  onClose,
  onSave,
  onDelete,
  onLogMeal,
  onEdit,
}: MealModalProps) {
  const isBuilder = mode === "create" || mode === "edit";
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState<MealIngredient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  useEffect(() => {
    if (meal) {
      setName(meal.name);
      setIngredients(meal.ingredients);
    } else {
      setName("");
      setIngredients([]);
    }
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
    setRateLimited(false);
  }, [meal, mode]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError(null);
    setRateLimited(false);
    setSearchResults([]);

    try {
      const cachedResults = searchCachedFoods(searchQuery);
      if (cachedResults.length > 0) {
        setSearchResults(cachedResults);
        return;
      }
      const results = await searchFoods(searchQuery);
      setSearchResults(results);
      if (results.length === 0) setError("No results found.");
    } catch (err) {
      if (err instanceof RateLimitError) {
        setRateLimited(true);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const addIngredient = (food: FoodSearchResult) => {
    setIngredients((prev) => [
      ...prev,
      {
        fdcId: food.fdcId,
        description: food.description,
        grams: 100,
      },
    ]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const updateIngredientGrams = (index: number, grams: number) => {
    setIngredients((prev) =>
      prev.map((ingredient, idx) =>
        idx === index ? { ...ingredient, grams } : ingredient
      )
    );
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, idx) => idx !== index));
  };

  const totalGrams = ingredients.reduce((sum, ingredient) => sum + ingredient.grams, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {mode === "view" ? "Meal" : "Meal Builder"}
            </p>
            <h3 className="text-lg font-semibold text-slate-800">
              {mode === "view" ? meal?.name ?? "Meal" : mode === "edit" ? "Edit Meal" : "Create Meal"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Close
          </button>
        </div>

        {isBuilder ? (
          <div className="px-5 py-4 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Meal Name
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Protein Breakfast"
                className="mt-2 w-full px-3 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Add Ingredients
                </p>
                <span className="text-[11px] font-semibold text-slate-400">
                  {ingredients.length} items
                </span>
              </div>
              <form onSubmit={handleSearch} className="relative">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search USDA foods"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </form>

              {rateLimited && (
                <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg text-[11px] text-amber-700 font-medium">
                  Rate limited. Please try again in a moment.
                </div>
              )}

              {error && (
                <div className="p-2 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-medium">{error}</p>
                </div>
              )}

              {isSearching && (
                <div className="text-xs text-slate-400 font-semibold">Searching...</div>
              )}

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {searchResults.map((food) => (
                  <button
                    type="button"
                    key={food.fdcId}
                    onClick={() => addIngredient(food)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-amber-200 hover:bg-amber-50/40 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700">{food.description}</p>
                      <p className="text-[10px] uppercase text-slate-400 font-bold">
                        {food.dataType}
                      </p>
                    </div>
                    <Plus className="w-4 h-4 text-amber-500" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ingredients
                </p>
                <p className="text-xs text-slate-400 font-semibold">{totalGrams}g total</p>
              </div>
              {ingredients.length === 0 ? (
                <div className="bg-white border border-dashed rounded-xl p-4 text-center text-slate-300 italic text-sm">
                  Add ingredients to build a meal.
                </div>
              ) : (
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={`${ingredient.fdcId}-${index}`}
                      className="bg-white border rounded-lg px-3 py-2 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {ingredient.description}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold">
                          ID {ingredient.fdcId}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={ingredient.grams}
                          onChange={(event) =>
                            updateIngredientGrams(
                              index,
                              Number.parseFloat(event.target.value) || 0
                            )
                          }
                          className="w-20 px-2 py-1 text-xs bg-slate-100 rounded-md text-right"
                        />
                        <span className="text-xs text-slate-400">g</span>
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="text-slate-200 hover:text-red-400"
                          aria-label="Remove ingredient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-slate-400">
                Meals are saved locally to your device.
              </p>
              <button
                type="button"
                onClick={() => onSave({ name: name.trim(), ingredients })}
                disabled={!name.trim() || ingredients.length === 0}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {mode === "edit" ? "Save Changes" : "Save Meal"}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Ingredients
              </p>
              <div className="space-y-2">
                {meal?.ingredients.map((ingredient) => (
                  <div
                    key={`${meal?.id}-${ingredient.fdcId}-${ingredient.description}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-700 font-medium">
                      {ingredient.description}
                    </span>
                    <span className="text-slate-400 font-semibold">
                      {ingredient.grams}g
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-400 font-semibold">
                {meal?.ingredients.length ?? 0} ingredients • {totalGrams}g total
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-500 hover:text-slate-700"
                  >
                    Edit Meal
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="px-3 py-2 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                )}
                {onLogMeal && (
                  <button
                    type="button"
                    onClick={onLogMeal}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Log Meal
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
