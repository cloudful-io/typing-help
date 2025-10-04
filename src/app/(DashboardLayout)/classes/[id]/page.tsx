// app/class/[id]/page.tsx
import ClassDetail from "@/app/(DashboardLayout)/components/classes/ClassDetail";

interface ClassPageProps {
  params: { id: string };
}

export default function ClassPage({ params }: ClassPageProps) {
  const classId = parseInt(params.id, 10);

  return <ClassDetail classId={classId} />;
}
