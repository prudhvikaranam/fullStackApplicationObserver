import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chatbot from "../Chatbot";

/* ------------------ Mocks ------------------ */

// Mock fetch
global.fetch = jest.fn();

// Mock scrollIntoView (critical fix)
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  value: jest.fn()
});

// Suppress console.error noise
jest.spyOn(console, "error").mockImplementation(() => {});

beforeEach(() => {
  fetch.mockClear();
});

afterAll(() => {
  jest.restoreAllMocks();
});

/* ------------------ Helpers ------------------ */

const mockResponse = ({
  ok = true,
  json,
  text,
  contentType = "application/json",
  stream = false
}) => {
  const body = stream
    ? {
        getReader: () => {
          const chunks = [
            new TextEncoder().encode("Hello "),
            new TextEncoder().encode("World")
          ];
          let i = 0;

          return {
            read: async () => {
              if (i < chunks.length) {
                return { value: chunks[i++], done: false };
              }
              return { done: true };
            }
          };
        }
      }
    : null;

  return Promise.resolve({
    ok,
    headers: {
      get: () => contentType
    },
    json: async () => json,
    text: async () => text,
    body
  });
};

/* ------------------ Tests ------------------ */

describe("Chatbot", () => {
  test("toggle chatbot UI", () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByLabelText("Toggle chatbot"));
    expect(screen.getByText(/analytics assistant/i)).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close chatbot"));
    expect(screen.queryByText(/analytics assistant/i)).not.toBeInTheDocument();
  });

  test("handles JSON with answer", async () => {
    fetch.mockResolvedValueOnce(
      mockResponse({ json: { answer: "1. A\n2. B" } })
    );

    render(<Chatbot />);
    fireEvent.click(screen.getByLabelText("Toggle chatbot"));

    fireEvent.change(screen.getByPlaceholderText("Ask something..."), {
      target: { value: "hello" }
    });

    fireEvent.click(screen.getByLabelText("send"));

    await waitFor(() =>
      expect(screen.getByText("A")).toBeInTheDocument()
    );
  });

  test("handles JSON without answer", async () => {
    fetch.mockResolvedValueOnce(
      mockResponse({ json: { data: "no answer" } })
    );

    render(<Chatbot />);
    fireEvent.click(screen.getByLabelText("Toggle chatbot"));

    fireEvent.change(screen.getByPlaceholderText("Ask something..."), {
      target: { value: "test" }
    });

    fireEvent.click(screen.getByLabelText("send"));

    await waitFor(() =>
      expect(screen.getByText(/no answer/)).toBeInTheDocument()
    );
  });

  test("handles plain text response", async () => {
    fetch.mockResolvedValueOnce(
      mockResponse({
        contentType: "text/plain",
        text: "plain response"
      })
    );

    render(<Chatbot />);
    fireEvent.click(screen.getByLabelText("Toggle chatbot"));

    fireEvent.change(screen.getByPlaceholderText("Ask something..."), {
      target: { value: "test" }
    });

    fireEvent.click(screen.getByLabelText("send"));

    await waitFor(() =>
      expect(screen.getByText("plain response")).toBeInTheDocument()
    );
  });


  test("handles fetch error", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<Chatbot />);
    fireEvent.click(screen.getByLabelText("Toggle chatbot"));

    fireEvent.change(screen.getByPlaceholderText("Ask something..."), {
      target: { value: "error" }
    });

    fireEvent.click(screen.getByLabelText("send"));

    await waitFor(() =>
      expect(screen.getByText("Failed to fetch response")).toBeInTheDocument()
    );
  });

  test("handles abort error", async () => {
    const err = new Error("Abort");
    err.name = "AbortError";

    fetch.mockRejectedValueOnce(err);

    render(<Chatbot />);
    fireEvent.click(screen.getByLabelText("Toggle chatbot"));

    fireEvent.change(screen.getByPlaceholderText("Ask something..."), {
      target: { value: "cancel" }
    });

    fireEvent.click(screen.getByLabelText("send"));

    await waitFor(() =>
      expect(screen.getByText("Request cancelled")).toBeInTheDocument()
    );
  });

  test("does not call fetch for empty input", () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByLabelText("Toggle chatbot"));

    fireEvent.click(screen.getByLabelText("send"));

    expect(fetch).not.toHaveBeenCalled();
  });

  test("parses numbered response correctly", async () => {
    fetch.mockResolvedValueOnce(
      mockResponse({ json: { answer: "1) One\n2) Two" } })
    );

    render(<Chatbot />);
    fireEvent.click(screen.getByLabelText("Toggle chatbot"));

    fireEvent.change(screen.getByPlaceholderText("Ask something..."), {
      target: { value: "test" }
    });

    fireEvent.click(screen.getByLabelText("send"));

    await waitFor(() =>
      expect(screen.getByText("One")).toBeInTheDocument()
    );
  });
});