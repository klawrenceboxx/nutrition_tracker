import { NextResponse } from "next/server";
import { RateLimitError, searchFoods } from "@/lib/usda/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  if (!query) {
    return NextResponse.json({ error: "Missing query." }, { status: 400 });
  }

  try {
    const foods = await searchFoods(query);
    return NextResponse.json({ foods });
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
