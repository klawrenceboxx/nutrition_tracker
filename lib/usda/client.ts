import type { FoodDetails, FoodSearchResult } from "@/types/nutrition";

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RateLimitError";
  }
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2,
  backoff = 500
) {
  const res = await fetch(url, options);
  if (res.status === 429) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw new RateLimitError("Rate limit exceeded.");
  }
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  return res.json();
}

export async function searchFoods(apiKey: string, query: string) {
  const data = await fetchWithRetry(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}&pageSize=15&dataType=Foundation,SR%20Legacy`
  );
  return (data.foods ?? []) as FoodSearchResult[];
}

export async function getFoodDetails(apiKey: string, fdcId: number) {
  const data = await fetchWithRetry(
    `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`
  );
  return data as FoodDetails;
}
