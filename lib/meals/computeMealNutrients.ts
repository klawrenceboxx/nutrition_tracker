import { cacheFood, getCachedFood } from "@/lib/cache/foodCache";
import { NUTRIENT_METADATA, TRACKED_CODES } from "@/lib/nutrition/metadata";
import { getFoodDetails, RateLimitError } from "@/lib/usda/client";
import type { MealIngredient } from "@/lib/meals/types";
import type { FoodDetails, Totals } from "@/types/nutrition";

function createEmptyTotals(): Totals {
  const totals: Totals = {};
  TRACKED_CODES.forEach((code) => {
    totals[code] = { total: 0, status: "missing" };
  });
  return totals;
}

function findNutrientAmount(food: FoodDetails, code: number) {
  const meta = NUTRIENT_METADATA[code];
  const nutrient = food.foodNutrients.find(
    (item) =>
      item.nutrient?.number === code.toString() ||
      item.nutrientId === code ||
      (meta.fallback &&
        (item.nutrient?.number === meta.fallback.toString() ||
          item.nutrientId === meta.fallback))
  );
  return nutrient?.amount ?? null;
}

export function getMealTotalsFromCache(ingredients: MealIngredient[]): Totals {
  const totals = createEmptyTotals();
  ingredients.forEach((ingredient) => {
    const cached = getCachedFood(ingredient.fdcId);
    if (!cached) {
      return;
    }
    TRACKED_CODES.forEach((code) => {
      const amount = findNutrientAmount(cached, code);
      if (amount === null) {
        return;
      }
      totals[code].total += (amount * ingredient.grams) / 100;
      totals[code].status = "present";
    });
  });
  return totals;
}

export function getMealCaloriesFromCache(ingredients: MealIngredient[]) {
  const totals = getMealTotalsFromCache(ingredients);
  const calories = totals[208];
  if (!calories || calories.status === "missing") {
    return null;
  }
  return calories.total;
}

export function getMissingFoodIds(ingredients: MealIngredient[]) {
  const missing = new Set<number>();
  ingredients.forEach((ingredient) => {
    if (!getCachedFood(ingredient.fdcId)) {
      missing.add(ingredient.fdcId);
    }
  });
  return Array.from(missing);
}

export async function ensureFoodsCached(fdcIds: number[]) {
  const fetched: number[] = [];
  const uniqueIds = Array.from(new Set(fdcIds));
  for (const id of uniqueIds) {
    if (getCachedFood(id)) {
      continue;
    }
    try {
      const data = await getFoodDetails(id);
      cacheFood(data);
      fetched.push(id);
    } catch (error) {
      if (error instanceof RateLimitError) {
        break;
      }
    }
  }
  return fetched;
}
