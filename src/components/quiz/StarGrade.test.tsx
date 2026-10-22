import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StarGrade } from "./StarGrade";

describe("StarGrade", () => {
  test("reports the clicked rating", async () => {
    const onChange = jest.fn();
    render(<StarGrade stars={null} onChange={onChange} />);

    await userEvent.click(screen.getByRole("radio", { name: "3 stars" }));

    expect(onChange).toHaveBeenCalledWith(3);
  });

  test("marks the current rating as checked", () => {
    render(<StarGrade stars={4} onChange={jest.fn()} />);

    expect(screen.getByRole("radio", { name: "4 stars" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "5 stars" })).not.toBeChecked();
  });

  test("fills up to the hovered star, then back to the rating", async () => {
    render(<StarGrade stars={4} onChange={jest.fn()} />);
    const stars = screen.getAllByRole("radio");
    const filled = () =>
      stars.filter((star) => !star.classList.contains("text-slate-300")).length;

    await userEvent.hover(stars[2]);
    expect(filled()).toBe(3);

    await userEvent.unhover(screen.getByRole("radiogroup"));
    expect(filled()).toBe(4);
  });
});
