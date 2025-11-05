import { supabase } from "@/utils/supabase/client";
import {
  wrapError,
  selectMaybeSingle,
  select,
  insertSingle,
  sleep,
} from "@/utils/supabase/helper";
import { Database } from "@/types/database.types";

type TypingClassRow = Database["public"]["Tables"]["typing_classes"]["Row"];
type StudentClassRow = Database["public"]["Tables"]["student_classes"]["Row"];
export type TypingClassWithTeacher = TypingClassRow & {
  teacher_name: string;
  teacher_avatar_url: string | null;
  teacher_bio: string | null;
};
export type StudentClassWithStudent = StudentClassRow & {
  student_name: string;
  student_avatar_url: string | null;
  student_bio: string | null;
};

const DEFAULT_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz23456789";

export function generateCode(length = 6, chars = DEFAULT_CHARS) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function generateUniqueClassCode(
  length = 6,
  maxAttempts = 10,
  baseDelayMs = 50
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = generateCode(length);

    try {
      const { data } = await supabase
        .from("typing_classes")
        .select("id")
        .eq("code", candidate)
        .maybeSingle();
      if (!data) return candidate;
    } catch (err) {
      console.warn("Quick check failed, continuing attempts", err);
    }

    const delay = baseDelayMs * Math.pow(2, attempt);
    await sleep(delay);
  }

  throw wrapError("Failed to find a unique code after quick checks", null);
}

export const TypingClassService = {
  async createTypingClass(teacherId: string, title: string, codeLength = 6) {
    const maxCreateAttempts = 6;

    for (let attempt = 0; attempt < maxCreateAttempts; attempt++) {
      const code = await generateUniqueClassCode(codeLength);

      try {
        const data = await insertSingle<TypingClassRow>(
          supabase
            .from("typing_classes"),
            [{ teacher_id: teacherId, title, code }]
        );

        return data;
      } catch (err: any) {
        const isUniqueViolation =
          err?.code === "23505" ||
          err?.message?.toLowerCase()?.includes("unique") ||
          err?.details?.toLowerCase?.()?.includes("already exists");

        if (isUniqueViolation) {
          const delay = 100 * Math.pow(2, attempt);
          await sleep(delay);
          continue;
        }

        throw wrapError("Error creating typing class", err);
      }
    }

    throw new Error("Failed to generate a unique class code after multiple attempts");
  },


  async getTypingClassByCode(code: string) {
    return await selectMaybeSingle<TypingClassRow>(
      supabase
        .from("typing_classes")
        .select("*")
        .eq("code", code)
    );
  },

  async getTypingClassById(classId: string) {
    try {
      const row = await selectMaybeSingle<TypingClassWithTeacher>(
        supabase
          .from("typing_classes_with_teacher")
          .select("*")
          .eq("id", classId)
          .order("title")
      );

      return row;
    } catch (err) {
      console.error("Error fetching typing classes for teacher:", err);
      return null;
    }
  },


  async getTypingClassesForStudent(studentId: string): Promise<TypingClassWithTeacher[]> {
    try {
      const rows = await select<TypingClassWithTeacher>(
        supabase
          .from("student_classes")
          .select("typing_classes_with_teacher(*)")
          .eq("student_id", studentId)
      );

      return rows
        .map((r: any) => r.typing_classes_with_teacher)
        .sort((a, b) => a.title.localeCompare(b.title));
    } catch (err) {
      console.error("Error fetching typing classes for student:", err);
      return [];
    }
  },

  async getTypingClassesForTeacher(teacherId: string): Promise<TypingClassWithTeacher[]> {
    try {
      const rows = await select<TypingClassWithTeacher>(
        supabase
          .from("typing_classes_with_teacher")
          .select("*")
          .eq("teacher_id", teacherId)
          .order("title")
      );

      return rows;
    } catch (err) {
      console.error("Error fetching typing classes for teacher:", err);
      return [];
    }
  },
  async joinTypingClass(studentId: string, classId: number) {

    return await insertSingle<StudentClassRow>(
      supabase.from("student_classes"),
      [{ student_id: studentId, class_id: classId }]
    );
  },

  async isMember(userId: string, classId: string): Promise<boolean> {
    const teacherQuery = supabase
      .from("typing_classes")
      .select("id")
      .eq("id", classId)
      .eq("teacher_id", userId);

    const studentQuery = supabase
      .from("student_classes")
      .select("id")
      .eq("class_id", classId)
      .eq("student_id", userId);

    const [teacher, student] = await Promise.all([
      selectMaybeSingle<{ id: string }>(teacherQuery),
      selectMaybeSingle<{ id: string }>(studentQuery),
    ]);

    return Boolean(teacher || student);
  },

  async getStudentsForClass(classId: string) {
    try {
      const rows = await select<StudentClassWithStudent>(
        supabase
          .from("student_classes_with_profile")
          .select("*")
          .eq("class_id", classId)
          .order("student_name")
      );

      return rows;
    } catch (err) {
      console.error("Error fetching students for class:", err);
      return [];
    }
  },


  async removeStudentFromClass(classId: string, studentId: string) {
    const query = supabase
      .from("student_classes")
      .delete()
      .eq("class_id", classId)
      .eq("student_id", studentId)
      .select()
      .maybeSingle();

    return await selectMaybeSingle<StudentClassRow>(query);
  },
};

export default TypingClassService;

