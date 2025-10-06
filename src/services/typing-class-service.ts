// typing-class-service.ts

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
type UserRow = Database["public"]["Tables"]["users"]["Row"];
type StudentClassRow = Database["public"]["Tables"]["student_classes"]["Row"];

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
      const code = generateCode(codeLength);

      try {
        const { data, error } = await supabase
          .from("typing_classes")
          .insert([{ teacher_id: teacherId, title, code }])
          .select()
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("Insert returned no data");

        return data as TypingClassRow;
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

    throw new Error("Failed to create class after multiple attempts due to code collisions");
  },

  async getTypingClassByCode(code: string) {
    return await selectMaybeSingle<TypingClassRow>(
      supabase.from("typing_classes").select("*").eq("code", code)
    );
  },

  async getTypingClassById(classId: string) {
    const { data, error } = await supabase
      .from("typing_classes")
      .select("*, teacher:users!typing_classes_teacher_id_fkey(full_name)")
      .eq("id", classId)
      .maybeSingle();

    if (error) throw wrapError("getTypingClassById failed", error);
    if (!data) return null;

    const teacherName = (data as any).teacher?.full_name ?? "Unknown";
    const { teacher, ...classData } = data as any;

    return {
      ...(classData as TypingClassRow),
      teacherName,
    };
  },

  async getTypingClassesForTeacher(teacherId: string) {
    try {
      return await select<TypingClassRow>(
        supabase.from("typing_classes").select("*").eq("teacher_id", teacherId)
      );
    } catch {
      return [];
    }
  },

  async getTypingClassesForStudent(studentId: string) {
    try {
      const rows = await select<any>(
        supabase
          .from("student_classes")
          .select("typing_classes(*)")
          .eq("student_id", studentId)
      );

      return rows.map((r: any) => r.typing_classes) as TypingClassRow[];
    } catch {
      return [];
    }
  },

  async joinTypingClass(studentId: string, classId: string) {
    const { data, error } = await supabase
      .from("student_classes")
      .insert([{ student_id: studentId, class_id: classId }])
      .select()
      .maybeSingle();

    if (error) throw wrapError("joinTypingClass failed", error);
    return data as StudentClassRow;
  },

  async isMember(userId: string, classId: string): Promise<boolean> {
    const teacherQuery = supabase
      .from("typing_classes")
      .select("id")
      .eq("id", classId)
      .eq("teacher_id", userId)
      .maybeSingle();

    const studentQuery = supabase
      .from("student_classes")
      .select("id")
      .eq("class_id", classId)
      .eq("student_id", userId)
      .maybeSingle();

    const [teacherRes, studentRes] = await Promise.all([teacherQuery, studentQuery]);
    return Boolean(teacherRes?.data || studentRes?.data);
  },

  async getStudentsForClass(classId: string) {
    try {
      const rows = await select<UserRow>(
        supabase
          .from("student_classes")
          .select("users(id, full_name, email)")
          .eq("class_id", classId)
      );

      return rows.map((r: any) => r.users) as UserRow[];
    } catch {
      return [];
    }
  },

  async removeStudentFromClass(classId: string, studentId: string) {
    const { data, error } = await supabase
      .from("student_classes")
      .delete()
      .eq("class_id", classId)
      .eq("student_id", studentId)
      .select()
      .maybeSingle();

    if (error) throw wrapError("removeStudentFromClass failed", error);
    return data as StudentClassRow | null;
  },
};

export default TypingClassService;


const DEFAULT_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz23456789";

export function generateCode(length = 6, chars = DEFAULT_CHARS) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
