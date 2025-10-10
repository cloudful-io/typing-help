import { NextRequest, NextResponse } from "next/server";
import { getOrCreateOrUpdateUser } from "@/lib/user";
//import UserService from "@/services/user-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email, displayName, onboardingComplete } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Build the payload to pass down
    const userPayload: {
      id: string;
      email: string;
      //fullName: string;
      onboardingComplete?: boolean;
    } = {
      id,
      email,
      //fullName,
    };

    if (onboardingComplete !== undefined) {
      userPayload.onboardingComplete = onboardingComplete;
    }

    //const user = await UserService.getOrCreateOrUpdate(userPayload);
    const user = await getOrCreateOrUpdateUser(userPayload);
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("User API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}