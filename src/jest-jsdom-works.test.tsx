// this is a test to make sure that the jest-jsdom is working
import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { userEvent } from "@testing-library/user-event";

const TestReactComponent = () => {
  const [text, setText] = useState("I rendered");

  return (
    <div>
      {text}
      <button onClick={() => setText("you clicked")}>click me</button>
    </div>
  );
};

describe("Jest JSDom", () => {
  test("works", async () => {
    const user = userEvent.setup();

    render(<TestReactComponent />);
    expect(screen.getByRole("button")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /click me/i }));

    expect(screen.getByText("you clicked")).toBeInTheDocument();
  });
});
