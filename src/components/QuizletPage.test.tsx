import { render, screen } from "@testing-library/react";
import QuizletPage from "./QuizletPage";

const PageContent = () => <p>Page content</p>;

describe("QuizletPage", () => {
  test("shows a Home link on non-home pages", () => {
    render(<QuizletPage Component={PageContent} />);

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  test("hides the Home link on the home page", () => {
    render(<QuizletPage Component={PageContent} showHomeLink={false} />);

    expect(
      screen.queryByRole("link", { name: "Home" }),
    ).not.toBeInTheDocument();
  });
});
