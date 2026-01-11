import type { FoodDetails, FoodSearchResult } from "@/types/nutrition";

const CACHE_KEY = "food-cache";

type FoodCacheRecord = Record<number, FoodDetails>;

function readCache(): FoodCacheRecord {
  if (typeof window === "undefined") {
    return {};
  }
  const stored = window.localStorage.getItem(CACHE_KEY);
  if (!stored) {
    return {};
  }
  try {
    return JSON.parse(stored) as FoodCacheRecord;
  } catch {
    return {};
  }
}

function writeCache(cache: FoodCacheRecord) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function getCachedFood(fdcId: number) {
  const cache = readCache();
  return cache[fdcId] ?? null;
}

export function cacheFood(food: FoodDetails) {
  const cache = readCache();
  cache[food.fdcId] = food;
  writeCache(cache);
}

export function searchCachedFoods(query: string): FoodSearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }
  const cache = readCache();
  return Object.values(cache)
    .filter((food) => food.description.toLowerCase().includes(normalized))
    .map((food) => ({
      fdcId: food.fdcId,
      description: food.description,
      dataType: "Cached",
    }));
}
