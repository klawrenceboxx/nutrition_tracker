"use client";

import type { Totals } from "@/types/nutrition";
import NutrientDetailsTable from "@/components/nutrition/NutrientDetailsTable";
import NutrientSummaryView from "@/components/nutrition/NutrientSummaryView";

type NutritionPanelProps = {
  viewMode: "label" | "table";
  onChangeView: (mode: "label" | "table") => void;
  totals: Totals;
  calorieGoal: number;
};

export default function NutritionPanel({
  viewMode,
  onChangeView,
  totals,
  calorieGoal,
}: NutritionPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="flex border-b">
        <button
          onClick={() => onChangeView("label")}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest ${
            viewMode === "label"
              ? "bg-slate-50 text-amber-600 border-b-2 border-amber-600"
              : "text-slate-400"
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => onChangeView("table")}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest ${
            viewMode === "table"
              ? "bg-slate-50 text-amber-600 border-b-2 border-amber-600"
              : "text-slate-400"
          }`}
        >
          Details
        </button>
      </div>

      <div className="p-5">
        {viewMode === "label" ? (
          <NutrientSummaryView totals={totals} calorieGoal={calorieGoal} />
        ) : (
          <NutrientDetailsTable totals={totals} calorieGoal={calorieGoal} />
        )}
      </div>
    </div>
  );
}
