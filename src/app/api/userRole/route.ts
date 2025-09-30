import { NextRequest, NextResponse } from "next/server";
import { getUserRolesByName, addUserRoleByName } from "@/lib/userRole";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  const roles = await getUserRolesByName(userId);
  return NextResponse.json(roles);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, roleName } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    else if (!roleName) {
      return NextResponse.json({ error: "Role name is required" }, { status: 400 });
    }

    const userRole = await addUserRoleByName(userId, roleName);
    return NextResponse.json(userRole);
  } catch (error: any) {
    console.error("User Role API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}