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
import { UserProfileService } from 'supabase-auth-lib';

type TypingClassRow = Database["public"]["Tables"]["typing_classes"]["Row"];
type StudentClassRow = Database["public"]["Tables"]["student_classes"]["Row"];

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
    const { data: classData, error: classError } = await supabase
      .from('typing_classes')
      .select('*')
      .eq('id', classId)
      .single();

    if (!classData) return null;

    // Get teacher name
    const { data: teacherData } = await supabase
      .from('user_profiles') 
      .select('display_name')
      .eq('id', classData.teacher_id)
      .single();

    return {
      ...classData,
      teacherName: teacherData?.display_name || 'Unknown',
    };
  },


  async getTypingClassesForTeacher(teacherId: string) {
    try {
      return await select<TypingClassRow>(
        supabase
        .from("typing_classes")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("title")
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
          .order("typing_classes(title)")
      );

      return rows.map((r: any) => r.typing_classes) as TypingClassRow[];
    } catch {
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
      // Step 1: get all student_ids for the given class
      const studentClassRows = await select<{ student_id: string }>(
        supabase.from("student_classes").select("student_id").eq("class_id", classId)
      );

      if (!studentClassRows.length) return [];

      const studentIds = studentClassRows.map((r) => r.student_id);

      // Step 2: get user details for those student_ids
      const userProfileService = new UserProfileService(supabase);
      const userProfiles = await userProfileService.getProfilesByIds(studentIds);

      return userProfiles;
    } catch (error) {
      console.error("getStudentsForClass failed:", error);
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

