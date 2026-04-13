import { render, screen, fireEvent } from "@testing-library/react";
import MetricsCard from "../MetricsCard";

describe("MetricsCard", () => {
  test("renders title and value", () => {
    render(<MetricsCard title="Revenue" value={1000} />);

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();

    render(
      <MetricsCard title="Clicks" value={50} onClick={handleClick} />
    );

    fireEvent.click(screen.getByText("Clicks"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });



  test("cycles gradient when index exceeds array", () => {
    const { container } = render(
      <MetricsCard title="Cycle" value={10} index={10} />
    );

    const btn = container.querySelector("button");

    expect(btn.style.background).toBeDefined();
  });

  test("applies hover styles on mouse enter and leaves", () => {
    const { container } = render(
      <MetricsCard title="Hover" value={5} />
    );

    const btn = container.querySelector("button");

    fireEvent.mouseEnter(btn);
    expect(btn.style.transform).toBe("translateY(-4px)");

    fireEvent.mouseLeave(btn);
    expect(btn.style.transform).toBe("translateY(0)");
  });

  test("does not crash when onClick is undefined", () => {
    render(<MetricsCard title="No Click" value={1} />);

    fireEvent.click(screen.getByText("No Click"));

    expect(screen.getByText("No Click")).toBeInTheDocument();
  });

  test("renders numeric and string values", () => {
    const { rerender } = render(
      <MetricsCard title="String" value="123" />
    );

    expect(screen.getByText("123")).toBeInTheDocument();

    rerender(<MetricsCard title="Number" value={456} />);
    expect(screen.getByText("456")).toBeInTheDocument();
  });
});