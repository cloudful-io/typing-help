export type Database = {
  public: {
    Tables: {
      users: { Row: { id: string; email: string; full_name: string | null; onboarding_complete: boolean; created_at: string } }
      typing_classes: { Row: { id: number; code: string; title: string; teacher_id: string; created_at: string } }
      student_classes: { Row: { id: number; student_id: string; class_id: number; joined_at: string } }
      user_profiles: {Row: { id: string; display_name: string; avatar_url: string | null; bio: string | null; created_at: string; updated_at: string }}
      roles: {Row: { id: string; name: string; description: string | null }}
      user_roles: {Row: { user_id: string; role_id: string }}
    }
  }
}
