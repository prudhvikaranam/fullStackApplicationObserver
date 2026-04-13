import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [key, setkey] = useState("");

  const isDisabled = !email.trim() || !key.trim();
  const USERS = [
    { email: "prudhvi123", key: "prudhvi123" },
    { email: "uday123", key: "uday123" },
    { email: "karnakar123", key: "karnakar123" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDisabled) return;

    const isValidUser = USERS.some(
      (user) => user.email === email && user.key === key
    );

    if (isValidUser) {
      email ? localStorage.setItem("user", email) : localStorage.setItem("user", 'Guest');
      navigate("/dashboard");
    } else {
      alert("Invalid username or key");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Sign in to your account</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              User Name
            </label>
            <input
              id="email"
              className="form-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="key">
              Password
            </label>
            <input
              id="key"
              className="form-input"
              type="key"
              value={key}
              onChange={(e) => setkey(e.target.value)}
              required
              autoComplete="off"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={isDisabled}
            aria-disabled={isDisabled}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}