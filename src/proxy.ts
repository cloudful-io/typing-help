import { type NextRequest } from "next/server"
import { updateSession } from "supabase-auth-lib";

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}
 
export const config = {
  matcher: ["/protected", "/login", "/new", "/class/:path*", "/profile", "/admin/:path*"],
};