"use client";

import { useMemo, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import PageSection from "@/components/layout/PageSection";
import EntryList from "@/components/log/EntryList";
import NutritionPanel from "@/components/nutrition/NutritionPanel";
import FoodSearchCard from "@/components/search/FoodSearchCard";
import SelectedFoodCard from "@/components/search/SelectedFoodCard";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import isSameLocalDay from "@/lib/date/isSameLocalDay";
import { DV_PROFILE_LABELS, DV_PROFILES } from "@/lib/nutrition/dailyValues";
import { NUTRIENT_METADATA, TRACKED_CODES } from "@/lib/nutrition/metadata";
import { getFoodDetails, RateLimitError, searchFoods } from "@/lib/usda/client";
import type { DvProfile, Entry, FoodDetails, FoodSearchResult, Totals } from "@/types/nutrition";

const APP_ID = typeof (globalThis as { __app_id?: string }).__app_id !== "undefined"
  ? (globalThis as { __app_id?: string }).__app_id ?? "oatmeal-bars-m1"
  : "oatmeal-bars-m1";

export default function Home() {
  const [apiKey, setApiKey] = useLocalStorageState<string>(`${APP_ID}-apikey`, "DEMO_KEY");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [selectedFood, setSelectedFood] = useState<(FoodDetails & { amount: number }) | null>(
    null
  );
  const [showSettings, setShowSettings] = useState(false);
  const [log, setLog] = useLocalStorageState<Entry[]>(`${APP_ID}-log`, []);
  const [viewMode, setViewMode] = useState<"label" | "table">("label");
  const [calorieGoal] = useState(2000);
  const [profile, setProfile] = useLocalStorageState<DvProfile>(`${APP_ID}-profile`, "adult");

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError(null);
    setRateLimited(false);
    setSearchResults([]);

    try {
      const results = await searchFoods(apiKey, searchQuery);
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

  const selectFood = async (fdcId: number) => {
    setError(null);
    setRateLimited(false);
    try {
      const data = await getFoodDetails(apiKey, fdcId);
      setSelectedFood({ ...data, amount: 100 });
    } catch (err) {
      if (err instanceof RateLimitError) {
        setRateLimited(true);
        return;
      }
      setError(`Failed to fetch food details. ${err instanceof Error ? err.message : ""}`.trim());
    }
  };

  const addToLog = () => {
    if (!selectedFood) return;
    const entry: Entry = {
      id: Date.now(),
      fdcId: selectedFood.fdcId,
      description: selectedFood.description,
      grams: Number.parseFloat(String(selectedFood.amount)) || 0,
      nutrients: selectedFood.foodNutrients,
      timestamp: new Date().toISOString(),
    };
    setLog((prev) => [entry, ...prev]);
    setSelectedFood(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const totals = useMemo<Totals>(() => {
    const acc: Totals = {};
    TRACKED_CODES.forEach((code) => {
      acc[code] = { total: 0, status: "missing" };
    });
    log.forEach((entry) => {
      TRACKED_CODES.forEach((code) => {
        const meta = NUTRIENT_METADATA[code];
        const nData = entry.nutrients.find(
          (nutrient) =>
            nutrient.nutrient?.number === code.toString() ||
            nutrient.nutrientId === code ||
            (meta.fallback &&
              (nutrient.nutrient?.number === meta.fallback.toString() ||
                nutrient.nutrientId === meta.fallback))
        );
        if (nData) {
          acc[code].total += (nData.amount * entry.grams) / 100;
          acc[code].status = "present";
        }
      });
    });
    return acc;
  }, [log]);

  const resetToday = () => {
    if (!confirm("Reset today?")) return;
    setLog((prev) => prev.filter((entry) => !isSameLocalDay(entry.timestamp, new Date())));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <AppHeader
        onToggleSettings={() => setShowSettings((prev) => !prev)}
        onResetToday={resetToday}
      />

      {showSettings && (
        <div className="bg-slate-800 text-white p-4 animate-in slide-in-from-top duration-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="bg-slate-700/60 border border-slate-600 rounded-lg p-4 text-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Daily Value Profile
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Update this to recalculate %DV across the nutrition panel.
                  </p>
                </div>
                <div className="sm:w-56">
                  <select
                    value={profile}
                    onChange={(event) => setProfile(event.target.value as DvProfile)}
                    className="w-full bg-slate-800 text-white border border-slate-600 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {DV_PROFILES.map((option) => (
                      <option key={option} value={option}>
                        {DV_PROFILE_LABELS[option]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <PageSection>
        <div className="lg:col-span-5 space-y-6">
          <FoodSearchCard
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSubmit={handleSearch}
            isSearching={isSearching}
            error={error}
            rateLimited={rateLimited}
            results={searchResults}
            onSelectFood={selectFood}
          />

          {selectedFood && (
            <SelectedFoodCard
              food={selectedFood}
              onChangeAmount={(amount) =>
                setSelectedFood((prev) => (prev ? { ...prev, amount } : prev))
              }
              onLog={addToLog}
              onCancel={() => setSelectedFood(null)}
            />
          )}

          <EntryList
            entries={log}
            onDelete={(entryId) => setLog((prev) => prev.filter((entry) => entry.id !== entryId))}
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <NutritionPanel
            viewMode={viewMode}
            onChangeView={setViewMode}
            totals={totals}
            calorieGoal={calorieGoal}
            profile={profile}
          />
        </div>
      </PageSection>
    </div>
  );
}
