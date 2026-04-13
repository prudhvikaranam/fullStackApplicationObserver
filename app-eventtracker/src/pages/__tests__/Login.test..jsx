import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../Login";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.alert = jest.fn();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

  test("renders inputs and button disabled initially", () => {
    renderComponent();

    const button = screen.getByRole("button", { name: /login/i });
    expect(button).toBeDisabled();
  });

  test("updates input values", () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText("username");
    const passwordInput = screen.getByPlaceholderText("••••••••");

    fireEvent.change(emailInput, { target: { value: "prudhvi123" } });
    fireEvent.change(passwordInput, { target: { value: "prudhvi123" } });

    expect(emailInput.value).toBe("prudhvi123");
    expect(passwordInput.value).toBe("prudhvi123");
  });

  test("does not submit when fields are empty", () => {
    renderComponent();

    const button = screen.getByRole("button", { name: /login/i });

    fireEvent.click(button);

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorage.getItem("user")).toBeNull();
  });

  test("logs in with valid credentials", () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("username"), {
      target: { value: "prudhvi123" }
    });

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "prudhvi123" }
    });

    const button = screen.getByRole("button", { name: /login/i });

    fireEvent.click(button);

    expect(localStorage.getItem("user")).toBe("prudhvi123");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("shows alert on invalid credentials", () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("username"), {
      target: { value: "wrong" }
    });

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrong" }
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "Invalid username or key"
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});