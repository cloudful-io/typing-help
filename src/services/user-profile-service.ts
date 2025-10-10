import { supabase } from "@/utils/supabase/client";
import {
  wrapError,
  selectMaybeSingle,
  upsertSingle,
} from "@/utils/supabase/helper";
import { Database } from "@/types/database.types";

type UserProfileRow = Database["public"]["Tables"]["user_profiles"]["Row"];

export type UserProfileInput = Partial<Pick<UserProfileRow, "id" | "display_name" | "avatar_url" | "bio">> & {
  id: string; // ensure ID is always required
};

export const UserProfileService = {
  /**
   * Creates or updates a user profile record.
   * Ensures the user ID is always present and fields are sanitized before upsert.
   */
  async getOrCreateOrUpdate(user: UserProfileInput): Promise<UserProfileRow> {
    if (!user.id) {
      throw wrapError("getOrCreateOrUpdate failed", new Error("User ID is required"));
    }

    const payload: Partial<UserProfileRow> = {
      id: user.id,
      display_name: user.display_name?.trim(),
      avatar_url: user.avatar_url,
      bio: user.bio?.trim(),
    };

    try {
      return await upsertSingle<UserProfileRow>(
        supabase.from("user_profiles"),
        payload,
        { onConflict: "id" }
      );
    } catch (error) {
      throw wrapError("UserProfileService.getOrCreateOrUpdate failed", error);
    }
  },

  /**
   * Fetch a user profile by ID.
   */
  async getById(id: string): Promise<UserProfileRow | null> {
    try {
      return await selectMaybeSingle<UserProfileRow>(
        supabase
          .from("user_profiles")
          .select("*")
          .eq("id", id)
          .maybeSingle()
      );
    } catch (error) {
      throw wrapError("UserProfileService.getById failed", error);
    }
  },

  /**
   * Checks if a profile exists without fetching the whole record.
   */
  async exists(id: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .eq("id", id);

      if (error) throw error;
      return (count ?? 0) > 0;
    } catch (error) {
      throw wrapError("UserProfileService.exists failed", error);
    }
  },
};

export default UserProfileService;
