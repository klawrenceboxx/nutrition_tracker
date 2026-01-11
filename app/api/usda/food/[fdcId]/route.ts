import { NextResponse } from "next/server";
import { getFoodDetails, RateLimitError } from "@/lib/usda/server";

type RouteContext = {
  params: {
    fdcId: string;
  };
};

export async function GET(_request: Request, context: RouteContext) {
  const fdcId = Number(context.params.fdcId);
  if (!Number.isFinite(fdcId)) {
    return NextResponse.json({ error: "Invalid fdcId." }, { status: 400 });
  }

  try {
    const food = await getFoodDetails(fdcId);
    return NextResponse.json(food);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error." },
      { status: 500 }
    );
  }
}
