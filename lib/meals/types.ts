export type MealIngredient = {
  fdcId: number;
  description: string;
  grams: number;
};

export type MealTemplate = {
  id: string;
  name: string;
  ingredients: MealIngredient[];
};
