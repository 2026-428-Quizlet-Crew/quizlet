import QuizletPage from "@/components/QuizletPage";
import Home from "./home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

const Page = () => {
  return <QuizletPage Component={Home} />;
};

export default Page;
