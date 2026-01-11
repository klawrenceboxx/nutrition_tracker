import { NUTRIENT_METADATA, TRACKED_CODES } from "@/lib/nutrition/metadata";
import type { Totals } from "@/types/nutrition";

type NutrientDetailsTableProps = {
  totals: Totals;
  calorieGoal: number;
};

export default function NutrientDetailsTable({ totals, calorieGoal }: NutrientDetailsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b text-[10px] text-slate-400 font-black uppercase tracking-tighter">
            <th className="pb-2">Nutrient</th>
            <th className="pb-2 text-right">Amount</th>
            <th className="pb-2 text-right">% DV</th>
            <th className="pb-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {TRACKED_CODES.map((code) => {
            const meta = NUTRIENT_METADATA[code];
            const data = totals[code];
            const dv = meta.isGoal ? calorieGoal : meta.dv;
            const percent = (data.total / dv) * 100;
            const isMissing = data.status === "missing";
            return (
              <tr key={code} className="border-b last:border-0">
                <td className="py-2.5 font-bold text-slate-700">{meta.name}</td>
                <td className="py-2.5 text-right font-medium">
                  {isMissing ? "—" : `${data.total.toFixed(1)} ${meta.unit}`}
                </td>
                <td
                  className={`py-2.5 text-right font-black ${
                    isMissing ? "text-slate-200" : percent > 100 ? "text-red-500" : "text-amber-600"
                  }`}
                >
                  {isMissing ? "—" : `${Math.round(percent)}%`}
                </td>
                <td className="py-2.5 text-center">
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      isMissing ? "bg-slate-100 text-slate-400" : "bg-green-50 text-green-600"
                    }`}
                  >
                    {data.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
