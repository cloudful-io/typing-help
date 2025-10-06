export type Database = {
  public: {
    Tables: {
      users: { Row: { id: string; email: string; full_name: string | null; onboarding_complete: boolean; created_at: string } }
      typing_classes: { Row: { id: number; code: string; title: string; teacher_id: string; created_at: string } }
      student_classes: { Row: { id: number; student_id: string; class_id: number; joined_at: string } }
    }
  }
}
