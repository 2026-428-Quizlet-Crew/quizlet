import QuizletPage from "@/components/QuizletPage";
import Quiz from "./quiz";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz",
};

const Page = async ({ params }: PageProps<"/decks/[id]/quiz">) => {
  const { id } = await params;
  return <QuizletPage Component={Quiz} deckId={id} />;
};

export default Page;
