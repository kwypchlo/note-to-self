import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders an app title", () => {
  render(<App />);
  const linkElement = screen.getByText(/note to self/i);
  expect(linkElement).toBeInTheDocument();
});
