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

export type Entry = {
  id: number;
  fdcId: number;
  description: string;
  grams: number;
  nutrients: FoodNutrient[];
  timestamp: string;
};

export type NutrientTotal = {
  total: number;
  status: "missing" | "present";
};

export type Totals = Record<number, NutrientTotal>;
