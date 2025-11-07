export type Database = {
  public: {
    Tables: {
      typing_classes: { Row: { id: number; code: string; title: string; teacher_id: string; created_at: string } }
      student_classes: { Row: { id: number; student_id: string; class_id: number; joined_at: string } }
      word_bank: { Row: { id: number; word: string; language: string; created_at: string } }
      PracticeTexts: {Row: {id: number; owner_teacher_id: number | null; class_id: number | null; student_id: number | null; language: string; grade_level: number | null; duration_seconds: number; is_public: boolean | null; content: string; assigned_at: string | null; created_at: string}}
      practice_sessions :{Row: {id: string; user_id: string; created_at: string; language: string; wpm: number; correct_chars: number; total_chars: number; words_typed: number; duration: number; text_id: number | null; character_stats: Record<string, any>}}
    }
  }
}
