import QuizletPage from "@/components/QuizletPage";
import { DeckEditor } from "@/components/deck-editor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit deck",
};

const Page = async ({ params }: PageProps<"/decks/[id]/edit">) => {
  const { id } = await params;
  return <QuizletPage Component={DeckEditor} deckId={id} />;
};

export default Page;
