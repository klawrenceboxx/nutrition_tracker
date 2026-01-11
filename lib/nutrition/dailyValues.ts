import { DRV_FOOD_COMPONENTS } from "@/data/drvFoodComponents";
import { RDI_NUTRIENTS } from "@/data/rdiNutrients";
import type { DvProfile, NutrientMeta } from "@/types/nutrition";

export const DV_PROFILE_LABELS: Record<DvProfile, string> = {
  adult: "Adult",
  infant: "Infant",
  child_1_3: "Child 1-3",
  pregnant_lactating: "Pregnant/Lactating",
};

export const DV_PROFILES = Object.keys(DV_PROFILE_LABELS) as DvProfile[];

type DvRecord = {
  unit: string;
  adult: number | null;
  infant: number | null;
  child_1_3: number | null;
  pregnant_lactating: number | null;
};

const DRV_LOOKUP = DRV_FOOD_COMPONENTS as Record<string, DvRecord>;
const RDI_LOOKUP = RDI_NUTRIENTS as Record<string, DvRecord>;

export function getDailyValue(meta: NutrientMeta, profile: DvProfile): number | null {
  if (!meta.dvKey || !meta.dvSource) return null;
  const lookup = meta.dvSource === "drv" ? DRV_LOOKUP : RDI_LOOKUP;
  const entry = lookup[meta.dvKey];
  return entry ? entry[profile] ?? null : null;
}
