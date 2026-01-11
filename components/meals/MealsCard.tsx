"use client";

import { ChevronRight, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import MealModal from "@/components/meals/MealModal";
import { getMealCaloriesFromCache, ensureFoodsCached, getMissingFoodIds } from "@/lib/meals/computeMealNutrients";
import { createMeal, deleteMeal, listMeals, updateMeal } from "@/lib/meals/storage";
import type { MealTemplate } from "@/lib/meals/types";

const emptyState = {
  title: "No meals saved yet",
  description: "Create meal templates for quick logging.",
};

type MealsCardProps = {
  onLogMeal: (meal: MealTemplate) => void;
};

export default function MealsCard({ onLogMeal }: MealsCardProps) {
  const [meals, setMeals] = useState<MealTemplate[]>(() => listMeals());
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit" | null>(null);
  const [activeMeal, setActiveMeal] = useState<MealTemplate | null>(null);
  const [cacheTick, setCacheTick] = useState(0);

  useEffect(() => {
    const fetchMissing = async () => {
      const missingIds = meals.flatMap((meal) => getMissingFoodIds(meal.ingredients));
      if (missingIds.length === 0) {
        return;
      }
      const fetched = await ensureFoodsCached(missingIds);
      if (fetched.length > 0) {
        setCacheTick((prev) => prev + 1);
      }
    };
    void fetchMissing();
  }, [meals]);

  const mealCalories = useMemo(() => {
    return meals.reduce<Record<string, number | null>>((acc, meal) => {
      acc[meal.id] = getMealCaloriesFromCache(meal.ingredients);
      return acc;
    }, {});
  }, [meals, cacheTick]);

  const openCreate = () => {
    setActiveMeal(null);
    setModalMode("create");
  };

  const openView = (meal: MealTemplate) => {
    setActiveMeal(meal);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveMeal(null);
  };

  const handleSave = (payload: { name: string; ingredients: MealTemplate["ingredients"] }) => {
    if (modalMode === "edit" && activeMeal) {
      const updated = { ...activeMeal, name: payload.name, ingredients: payload.ingredients };
      const next = updateMeal(updated);
      setMeals(next);
      setActiveMeal(updated);
      setModalMode("view");
      return;
    }
    const newMeal = createMeal({ name: payload.name, ingredients: payload.ingredients });
    setMeals((prev) => [newMeal, ...prev]);
    setActiveMeal(newMeal);
    setModalMode("view");
  };

  const handleDelete = () => {
    if (!activeMeal) return;
    if (!confirm("Delete this meal template?")) return;
    const next = deleteMeal(activeMeal.id);
    setMeals(next);
    closeModal();
  };

  const handleLogMeal = () => {
    if (!activeMeal) return;
    onLogMeal(activeMeal);
    closeModal();
  };

  return (
    <section className="bg-white p-4 rounded-xl shadow-sm border">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Meals</h2>
        <button
          type="button"
          onClick={openCreate}
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Meal
        </button>
      </div>
      <div className="space-y-2">
        {meals.length === 0 && (
          <div className="bg-slate-50 border border-dashed rounded-xl p-6 text-center">
            <p className="text-sm font-semibold text-slate-400">{emptyState.title}</p>
            <p className="text-xs text-slate-300 mt-1">{emptyState.description}</p>
          </div>
        )}
        {meals.map((meal) => {
          const calories = mealCalories[meal.id];
          return (
            <button
              type="button"
              key={meal.id}
              onClick={() => openView(meal)}
              className="w-full text-left p-3 rounded-lg border border-transparent hover:border-amber-100 hover:bg-amber-50/40 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-700">{meal.name}</p>
                <p className="text-xs text-slate-400 font-bold">
                  {meal.ingredients.length} ingredients
                </p>
              </div>
              <div className="flex items-center gap-2">
                {typeof calories === "number" && !Number.isNaN(calories) && (
                  <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                    {Math.round(calories)} kcal
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </button>
          );
        })}
      </div>

      {modalMode && (
        <MealModal
          mode={modalMode}
          meal={activeMeal}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={modalMode === "view" ? handleDelete : undefined}
          onLogMeal={modalMode === "view" ? handleLogMeal : undefined}
          onEdit={modalMode === "view" ? () => setModalMode("edit") : undefined}
        />
      )}
    </section>
  );
}
