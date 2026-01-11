"use client";

import { Plus } from "lucide-react";
import type { FoodDetails } from "@/types/nutrition";

type SelectedFoodCardProps = {
  food: FoodDetails & { amount: number };
  onChangeAmount: (amount: number) => void;
  onLog: () => void;
  onCancel: () => void;
};

export default function SelectedFoodCard({
  food,
  onChangeAmount,
  onLog,
  onCancel,
}: SelectedFoodCardProps) {
  return (
    <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
      <h3 className="font-bold text-slate-800 text-sm mb-3">{food.description}</h3>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
            Amount (grams)
          </label>
          <input
            type="number"
            className="w-full p-2 rounded border-amber-300"
            value={food.amount}
            onChange={(event) => onChangeAmount(Number(event.target.value))}
          />
        </div>
        <button
          onClick={onLog}
          className="bg-amber-600 text-white px-6 py-2 rounded font-bold hover:bg-amber-700 h-[42px] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Log
        </button>
      </div>
      <button
        onClick={onCancel}
        className="w-full text-center text-[10px] text-amber-600 mt-3 font-bold uppercase tracking-wider"
      >
        Cancel
      </button>
    </div>
  );
}
