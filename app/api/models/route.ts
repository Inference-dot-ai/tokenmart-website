import { NextResponse } from "next/server";
import { fetchModels } from "@/lib/google-sheets";

export const revalidate = 300; // cache for 5 minutes

export async function GET() {
  const models = await fetchModels();
  return NextResponse.json(models, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}
