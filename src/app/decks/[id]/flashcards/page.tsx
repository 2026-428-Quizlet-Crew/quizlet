import QuizletPage from "@/components/QuizletPage";
import Flashcards from "./flashcards";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flashcards",
};

const Page = async ({ params }: PageProps<"/decks/[id]/flashcards">) => {
  const { id } = await params;
  return <QuizletPage Component={Flashcards} deckId={id} />;
};

export default Page;
