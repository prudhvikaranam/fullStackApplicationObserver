import { render, screen } from "@testing-library/react";
import ActivityFeed from "../ActivityFeed";

test("renders correct number of items", () => {
  const data = [
    { id: 1, text: "A" },
    { id: 2, text: "B" },
    { id: 3, text: "C" }
  ];

  const { container } = render(<ActivityFeed data={data} />);

  const items = container.querySelectorAll(
    "div > div > div" 
  );

  expect(items.length).toBe(3);
});