export type Database = {
  public: {
    Tables: {
      users: { Row: { id: string; email: string; full_name: string | null; onboarding_complete: boolean; created_at: string } }
      typing_classes: { Row: { id: number; code: string; title: string; teacher_id: string; created_at: string } }
      student_classes: { Row: { id: number; student_id: string; class_id: number; joined_at: string } }
      user_profiles: {Row: { id: string; display_name: string; avatar_url: string | null; bio: string | null; created_at: string; updated_at: string }}
      roles: {Row: { id: string; name: string; description: string | null }}
      user_roles: {Row: { user_id: string; role_id: string }}
      PracticeTexts: {Row: {id: number; owner_teacher_id: number | null; class_id: number | null; student_id: number | null; language: string; grade_level: number | null; duration_seconds: number; is_public: boolean | null; content: string; assigned_at: string | null; created_at: string}}
    }
  }
}
