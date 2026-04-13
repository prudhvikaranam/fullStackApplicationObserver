import { render, screen } from "@testing-library/react";
import Dashboard from "../Dashboard";

beforeEach(() => {
  global.fetch = jest.fn();
});

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("Dashboard", () => {


  test("renders fallback values when API returns nulls", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    });

    render(<Dashboard />);

    // Only 2 raw "0" values exist (users + orders)
    expect(await screen.findAllByText("0")).toHaveLength(2);

    expect(screen.getByText("₹0")).toBeInTheDocument();
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  test("handles API failure", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<Dashboard />);

    expect(
      await screen.findByText(/analytics dashboard/i)
    ).toBeInTheDocument();
  });

  test("handles non-ok response", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({})
    });

    render(<Dashboard />);

    expect(
      await screen.findByText(/analytics dashboard/i)
    ).toBeInTheDocument();
  });
});