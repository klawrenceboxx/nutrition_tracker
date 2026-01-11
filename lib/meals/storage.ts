import type { MealTemplate } from "@/lib/meals/types";

const MEALS_KEY = "meals";

function readMeals(): MealTemplate[] {
  if (typeof window === "undefined") {
    return [];
  }
  const stored = window.localStorage.getItem(MEALS_KEY);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored) as MealTemplate[];
  } catch {
    return [];
  }
}

function writeMeals(meals: MealTemplate[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

export function listMeals(): MealTemplate[] {
  return readMeals();
}

export function getMeal(id: string): MealTemplate | null {
  return readMeals().find((meal) => meal.id === id) ?? null;
}

export function createMeal(data: Omit<MealTemplate, "id">): MealTemplate {
  const newMeal: MealTemplate = {
    ...data,
    id: typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  };
  const meals = readMeals();
  const next = [newMeal, ...meals];
  writeMeals(next);
  return newMeal;
}

export function updateMeal(updated: MealTemplate): MealTemplate[] {
  const meals = readMeals();
  const next = meals.map((meal) => (meal.id === updated.id ? updated : meal));
  writeMeals(next);
  return next;
}

export function deleteMeal(id: string): MealTemplate[] {
  const meals = readMeals();
  const next = meals.filter((meal) => meal.id !== id);
  writeMeals(next);
  return next;
}
