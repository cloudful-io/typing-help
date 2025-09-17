import { NextResponse } from "next/server";
import { getRandomPublicPracticeText } from "@/lib/practiceText";

export async function GET(req: Request) {
  try {
    // Grab language from query string
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language") || "en-US";

    const practiceText = await getRandomPublicPracticeText(language);

    if (!practiceText) {
      return NextResponse.json({ error: "No practice text found" }, { status: 404 });
    }

    return NextResponse.json(practiceText);
  } catch (error: any) {
    console.error("PracticeText API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
