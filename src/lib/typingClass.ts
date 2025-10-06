import { supabase } from "@/utils/supabase/client";

export async function generateUniqueClassCode(length = 6, maxRetries = 5): Promise<string> {

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

// Get class by code
export async function getTypingClassByCode(code: string) {

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

//  Get class by ID, including teacher name
export async function getTypingClassById(classId: string) {

  const { data: classData, error: classError } = await supabase
    .from('typing_classes')
    .select('*')
    .eq('id', classId)
    .single();

  if (!classData) return null;

  // Get teacher name
  const { data: teacherData } = await supabase
    .from('users') 
    .select('full_name')
    .eq('id', classData.teacher_id)
    .single();

  return {
    ...classData,
    teacherName: teacherData?.full_name || 'Unknown',
  };
}

// Get list of classes for a teacher
export async function getTypingClassesForTeacher(teacherId: string) {

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

// Get list of classes for a student
export async function getTypingClassesForStudent(studentId: string) {

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

// Create a new class as teacher
export async function createTypingClass(teacherId: string, title: string) {
  
  const code = await generateUniqueClassCode();

  const { data, error } = await supabase
    .from("typing_classes")
    .insert([{ teacher_id: teacherId, title, code }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Join a class as student
export async function joinTypingClass(studentId: string, classId: string) {
  
  const { data, error } = await supabase
    .from("student_classes")
    .insert([{ student_id: studentId, class_id: classId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Check if user is member (teacher or student) of the class
export async function isMember(userId: string, classId: string) {
  // Check if the user is the teacher
  const { data: teacherData, error: teacherError } = await supabase
    .from("typing_classes")
    .select("id")
    .eq("id", classId)
    .eq("teacher_id", userId)
    .single();

  if (teacherError && teacherError.code !== "PGRST116") {
    console.error("Error checking teacher membership:", teacherError.message);
    throw teacherError;
  }

  if (teacherData) return true; // user is the teacher

  // Check if the user is a student in the class
  const { data: studentData, error: studentError } = await supabase
    .from("student_classes")
    .select("id")
    .eq("class_id", classId)
    .eq("student_id", userId)
    .single();

  if (studentError && studentError.code !== "PGRST116") {
    console.error("Error checking student membership:", studentError.message);
    throw studentError;
  }

  if (studentData) return true; // user is a student

  // Not a member
  return false;
}

// Get list of students in a class
export async function getStudentsForClass(classId: string) {

  // Fetch student IDs
  const { data: studentRows, error: studentError } = await supabase
    .from('student_classes')
    .select('student_id')
    .eq('class_id', classId);

  if (studentError) {
    console.error('Error fetching student IDs:', studentError.message);
    return [];
  }

  const studentIds = (studentRows || []).map((row: any) => row.student_id);

  if (studentIds.length === 0) return [];

  // Fetch user info
  const { data: usersData, error: usersError } = await supabase
    .from('users') 
    .select('id, full_name, email')
    .in('id', studentIds);

  if (usersError) {
    console.error('Error fetching user data:', usersError.message);
    return [];
  }

  return usersData || [];
}

