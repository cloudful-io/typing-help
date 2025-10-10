import { supabase } from "@/utils/supabase/client";
import { wrapError, insertSingle, select, selectMaybeSingle } from "@/utils/supabase/helper";
import { Database } from "@/types/database.types";

type UserRoleRow = Database["public"]["Tables"]["user_roles"]["Row"];
type RoleRow = Database["public"]["Tables"]["roles"]["Row"];

type UserRoleInput = {
  userId: string;
  roleName: string;
};

export const UserRoleService = {
  async getRoleByName(name: string) {
    try {
        const data = await selectMaybeSingle<RoleRow>(
            supabase
              .from("roles")
              .select("*")
              .eq("name", name)
        );
        return data;
    } catch (error) {
        throw wrapError("getRoleByName failed", error);
    }
  },
  async addUserRoleByName({ userId, roleName }: UserRoleInput) {
    try {
        const role = await UserRoleService.getRoleByName(roleName);
    
        if (!role) 
            throw new Error(`Role "${roleName}" not found`);

      const payload = { user_id: userId, role_id: role.id };
      return await insertSingle<UserRoleRow>(supabase.from("user_roles"), [payload]);
    } catch (error) {
      throw wrapError("addUserRoleByName failed", error);
    }
  },

  async getUserRoles(userId: string) {
    try {
        return await select<UserRoleRow>(
            supabase
              .from("user_roles")
              .select("*")
              .eq("user_id", userId)
        );
    } catch (error) {
        throw wrapError("getUserRoles failed", error);
    }
  },
  
};

export default UserRoleService;
