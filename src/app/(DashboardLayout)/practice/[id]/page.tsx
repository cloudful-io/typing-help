import { use } from "react";
import Practice from "../../components/class/Practice";

interface PracticePageProps {
  params: { id: string };
}

export default function PracticePage({params}: {params: Promise<{ id: string }>}) {
  const { id } = use(params);

  return (
    <>
      <Practice id={id}/>
    </>
  );
}