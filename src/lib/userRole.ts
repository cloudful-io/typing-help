import { createClient } from '@/utils/supabase/server';

// Get role by name
export async function getRoleByName(name: string) {
  const supabase = await createClient();

  return await supabase
    .from('roles')
    .select('*')
    .eq('name', name)
    .single()
}

// Add role to user by role name
export async function addUserRoleByName(userId: string, roleName: string) {
  const supabase = await createClient();

  const { data: role, error: roleError } = await getRoleByName(roleName)
  if (roleError || !role) return { error: roleError ?? new Error('Role not found') }

  return await supabase
    .from('user_roles')
    .insert([{ user_id: userId, role_id: role.id }])
}

// Get all roles for a user (with role names)
export async function getUserRolesByName(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', userId);

  if (error || !data) return [];

  // data will be something like:
  // [{ roles: { name: 'teacher' } }, { roles: { name: 'admin' } }]
  return data.map((item: any) => item.roles.name);
}

// Update role for a user by role names
export async function updateUserRoleByName(
  userId: string,
  oldRoleName: string,
  newRoleName: string
) {
  const { data: oldRole, error: oldError } = await getRoleByName(oldRoleName)
  if (oldError || !oldRole) return { error: oldError ?? new Error('Old role not found') }

  const { data: newRole, error: newError } = await getRoleByName(newRoleName)
  if (newError || !newRole) return { error: newError ?? new Error('New role not found') }

  const supabase = await createClient();

  // Delete old role
  const { error: deleteError } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role_id', oldRole.id)

  if (deleteError) return { error: deleteError }

  // Insert new role
  return await supabase
    .from('user_roles')
    .insert([{ user_id: userId, role_id: newRole.id }])
}

// Delete a role from a user by role name
export async function deleteUserRoleByName(userId: string, roleName: string) {
  const { data: role, error } = await getRoleByName(roleName)
  if (error || !role) return { error: error ?? new Error('Role not found') }

  const supabase = await createClient();

  return await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('role_id', role.id)
}