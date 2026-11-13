import Link from "next/link";
import type { ComponentType } from "react";

type QuizletPageProps<P extends object> = {
  Component: ComponentType<P>;
  title?: string;
  showHomeLink?: boolean;
} & P;

const QuizletPage = <P extends object>({
  Component,
  showHomeLink = true,
  ...props
}: QuizletPageProps<P>) => {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-semibold">
            Quizlet BB
          </Link>
          <div className="flex items-center gap-4">
            {showHomeLink && (
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                Home
              </Link>
            )}
            <Link
              href="/decks/import"
              className="text-sm text-blue-600 hover:underline"
            >
              Import deck
            </Link>
            <Link
              href="/decks/new"
              className="text-sm text-blue-600 hover:underline"
            >
              New deck
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Component {...(props as unknown as P)} />
      </main>
    </>
  );
};

export default QuizletPage;
