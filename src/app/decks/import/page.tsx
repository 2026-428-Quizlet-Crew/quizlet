import QuizletPage from "@/components/QuizletPage";
import DeckImporter from "./DeckImporter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import deck",
};

const Page = () => {
  return <QuizletPage Component={DeckImporter} />;
};

export default Page;
