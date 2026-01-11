"use client";

import type { DvProfile, Totals } from "@/types/nutrition";
import NutrientDetailsTable from "@/components/nutrition/NutrientDetailsTable";
import NutrientSummaryView from "@/components/nutrition/NutrientSummaryView";

type NutritionPanelProps = {
  viewMode: "label" | "table";
  onChangeView: (mode: "label" | "table") => void;
  totals: Totals;
  calorieGoal: number;
  profile: DvProfile;
};

export default function NutritionPanel({
  viewMode,
  onChangeView,
  totals,
  calorieGoal,
  profile,
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
          <NutrientSummaryView totals={totals} calorieGoal={calorieGoal} profile={profile} />
        ) : (
          <NutrientDetailsTable totals={totals} calorieGoal={calorieGoal} profile={profile} />
        )}
        <p className="text-[10px] text-slate-400 mt-4">
          Daily Values and Recommended Intakes are based on FDA and NIH reference tables.
          Sources:
          <br />
          FDA DRVs: https://www.fda.gov/media/99059/download
          <br />
          FDA DRVs (Food Components): https://www.fda.gov/media/99069/download
          <br />
          NIH ODS: https://ods.od.nih.gov/HealthInformation/dailyvalues.aspx
        </p>
      </div>
    </div>
  );
}
