import ClassDetail from "@/app/(DashboardLayout)/components/classes/ClassDetail";
import { use } from "react";

interface ClassPageProps {
  params: { id: string };
}

export default function ClassPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = use(params);

  return <ClassDetail classId={id} />;
}