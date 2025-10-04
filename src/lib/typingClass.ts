import { createClient } from "@/utils/supabase/client";

export async function generateUniqueClassCode(length = 6, maxRetries = 5): Promise<string> {
  const supabase = createClient();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz23456789";

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Check if code already exists
    const { data, error } = await supabase
      .from("typing_classes")
      .select("id")
      .eq("code", code)
      .single();

    if (!data) {
      return code; // Unique
    }
  }

  throw new Error("Failed to generate a unique class code after multiple attempts");
}

export async function getTypingClassByCode(code: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("typing_classes")
    .select("*")
    .eq("code", code)
    .single();  // ensures at most one row is returned

  if (error) {
    if (error.code === "PGRST116") {
      // "No rows found" error from supabase
      return null;
    }
    console.error("Error fetching class by code:", error.message);
    throw error; // rethrow unexpected errors
  }

  return data; // will be a single object or null
}

export async function getTypingClassById(classId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("typing_classes")
    .select("*")
    .eq("id", classId)
    .single();  // ensures at most one row is returned

  if (error) {
    if (error.code === "PGRST116") {
      // "No rows found" error from supabase
      return null;
    }
    console.error("Error fetching class by ID:", error.message);
    throw error; // rethrow unexpected errors
  }

  return data; // will be a single object or null
}


export async function getTypingClassesForTeacher(teacherId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("typing_classes")
    .select("*")
    .eq("teacher_id", teacherId);

  if (error) {
    console.error("Error fetching teacher classes:", error.message);
    return [];
  }

  return data || [];
}

export async function createTypingClass(teacherId: string, title: string) {
  const supabase = createClient();
  
  const code = await generateUniqueClassCode();

  const { data, error } = await supabase
    .from("typing_classes")
    .insert([{ teacher_id: teacherId, title, code }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function joinTypingClass(studentId: string, classId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("student_classes")
    .insert([{ student_id: studentId, class_id: classId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getTypingClassesForStudent(studentId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("student_classes")
    .select("typing_classes(*)")
    .eq("student_id", studentId);

  if (error) {
    console.error("Error fetching student classes:", error.message);
    return [];
  }

  // unwrap nested `typing_classes`
  return (data || []).map((row: any) => row.typing_classes);
}