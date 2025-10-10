import { supabase } from "@/utils/supabase/client";
import {
  wrapError,
  selectMaybeSingle,
  select,
  insertSingle,
  upsertSingle,
  sleep,
} from "@/utils/supabase/helper";
import { Database } from "@/types/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

type UserInput = {
  id: string;
  email: string;
  onboardingComplete?: boolean;
};

export const UserService = {
    async getOrCreateOrUpdate(user: UserInput): Promise<UserRow> {

        const payload: Partial<UserRow> = {
            id: user.id,
            email: user.email,
        };

        if (user.onboardingComplete !== undefined) {
            payload.onboarding_complete = user.onboardingComplete;
        }

        try {
        return await upsertSingle<UserRow>(
            supabase
                .from("users"),
                payload,
                { onConflict: "email" }
        );
        } catch (error) {
            throw wrapError("getOrCreateOrUpdate failed", error);
        }
    },

    async getUserById(id: string): Promise<UserRow | null> {

        return await selectMaybeSingle<UserRow>(
            supabase
                .from("users")
                .select("*")
                .eq("id", id)
        );
    },
}

export default UserService;
