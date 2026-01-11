import type { NutrientMeta } from "@/types/nutrition";

export const NUTRIENT_METADATA: Record<number, NutrientMeta> = {
  208: { name: "Calories", unit: "kcal", dv: 2000, category: "Macros", isGoal: true },
  203: { name: "Protein", unit: "g", dv: 50, category: "Macros" },
  204: { name: "Total Fat", unit: "g", dv: 78, category: "Macros" },
  205: { name: "Total Carbohydrate", unit: "g", dv: 275, category: "Macros" },
  291: { name: "Dietary Fiber", unit: "g", dv: 28, category: "Macros" },
  320: { name: "Vitamin A (RAE)", unit: "mcg", dv: 900, category: "Vitamins" },
  401: { name: "Vitamin C", unit: "mg", dv: 90, category: "Vitamins" },
  328: { name: "Vitamin D", unit: "mcg", dv: 20, category: "Vitamins" },
  323: { name: "Vitamin E", unit: "mg", dv: 15, category: "Vitamins" },
  430: { name: "Vitamin K", unit: "mcg", dv: 120, category: "Vitamins" },
  404: { name: "Thiamin (B1)", unit: "mg", dv: 1.2, category: "Vitamins" },
  405: { name: "Riboflavin (B2)", unit: "mg", dv: 1.3, category: "Vitamins" },
  406: { name: "Niacin (B3)", unit: "mg", dv: 16, category: "Vitamins", fallback: 409 },
  415: { name: "Vitamin B6", unit: "mg", dv: 1.7, category: "Vitamins" },
  435: { name: "Folate (DFE)", unit: "mcg", dv: 400, category: "Vitamins", fallback: 417 },
  418: { name: "Vitamin B12", unit: "mcg", dv: 2.4, category: "Vitamins" },
  301: { name: "Calcium", unit: "mg", dv: 1300, category: "Minerals" },
  303: { name: "Iron", unit: "mg", dv: 18, category: "Minerals" },
  306: { name: "Potassium", unit: "mg", dv: 4700, category: "Minerals" },
  304: { name: "Magnesium", unit: "mg", dv: 420, category: "Minerals" },
  309: { name: "Zinc", unit: "mg", dv: 11, category: "Minerals" },
  307: { name: "Sodium", unit: "mg", dv: 2300, category: "Minerals" },
};

export const TRACKED_CODES = Object.keys(NUTRIENT_METADATA).map(Number);
