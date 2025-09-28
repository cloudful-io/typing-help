import "server-only";
import { JWTPayload, importSPKI, jwtVerify } from "jose";
import { createClient } from "@/utils/supabase/server";

type SupabaseJwtPayload = JWTPayload & {
  app_metadata: { role: string };
};

export async function getUserRole() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let role;

  if (session) {
    const token = session.access_token;

    try {
      const secret = new TextEncoder().encode(
        process.env.SUPABASE_JWT_SECRET!
      );

      // Verify the token
      const verified = await jwtVerify(token, secret, {
        algorithms: ["HS256"],
      });

      // Cast payload to SupabaseJwtPayload
      const payload = verified.payload as SupabaseJwtPayload;

      role = payload.app_metadata.role;
    } catch (error) {
      console.error("Failed to verify token:", error);
    }
  }

  return role;
}
