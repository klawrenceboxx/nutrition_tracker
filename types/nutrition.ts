import type { MealIngredient } from "@/lib/meals/types";

export type DvProfile = "adult" | "infant" | "child_1_3" | "pregnant_lactating";
export type DvSource = "drv" | "rdi";

export type NutrientMeta = {
  name: string;
  unit: string;
  category: "Macros" | "Vitamins" | "Minerals";
  dvKey?: string;
  dvSource?: DvSource;
  isGoal?: boolean;
  fallback?: number;
};

export type FoodSearchResult = {
  fdcId: number;
  description: string;
  dataType: string;
};

export type SavedFood = {
  fdcId: number;
  description: string;
};

export type FoodNutrient = {
  nutrientId?: number;
  amount: number;
  nutrient?: {
    number?: string;
  };
};

export type FoodDetails = {
  fdcId: number;
  description: string;
  foodNutrients: FoodNutrient[];
};

export type FoodEntry = {
  id: number;
  type?: "food";
  fdcId: number;
  description: string;
  grams: number;
  nutrients: FoodNutrient[];
  timestamp: string;
};

export type MealEntry = {
  id: number;
  type: "meal";
  name: string;
  ingredients: MealIngredient[];
  timestamp: string;
};

export type Entry = FoodEntry | MealEntry;

export type NutrientTotal = {
  total: number;
  status: "missing" | "present";
};

export type Totals = Record<number, NutrientTotal>;
