import { NUTRIENT_METADATA, TRACKED_CODES } from "@/lib/nutrition/metadata";
import type { Totals } from "@/types/nutrition";

type NutrientSummaryViewProps = {
  totals: Totals;
  calorieGoal: number;
};

export default function NutrientSummaryView({ totals, calorieGoal }: NutrientSummaryViewProps) {
  return (
    <div className="space-y-8">
      {(["Macros", "Vitamins", "Minerals"] as const).map((cat) => (
        <div key={cat}>
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 border-b pb-1">
            {cat}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {TRACKED_CODES.filter((c) => NUTRIENT_METADATA[c].category === cat).map(
              (code) => {
                const meta = NUTRIENT_METADATA[code];
                const data = totals[code];
                const dv = meta.isGoal ? calorieGoal : meta.dv;
                const percent = (data.total / dv) * 100;
                const isMissing = data.status === "missing";
                return (
                  <div key={code}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-bold text-slate-600">{meta.name}</span>
                      <span
                        className={`text-[10px] font-black ${
                          isMissing ? "text-slate-200" : "text-slate-900"
                        }`}
                      >
                        {isMissing
                          ? "N/A"
                          : `${data.total.toLocaleString(undefined, {
                              maximumFractionDigits: 1,
                            })}${meta.unit}`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full relative overflow-hidden">
                      {!isMissing && (
                        <div
                          className={`h-full rounded-full ${
                            percent > 100 ? "bg-red-400" : "bg-amber-400"
                          }`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      )}
                      {isMissing && <div className="absolute inset-0 bg-slate-50 opacity-50" />}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
