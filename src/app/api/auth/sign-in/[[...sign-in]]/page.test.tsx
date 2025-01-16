import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { test, expect } from "@jest/globals";
import SignInPage from "./page";

test("renders sign-in page", () => {
	render(<SignInPage />);
	const linkElement = screen.getByText(/sign in/i);
	expect(linkElement).toBeInTheDocument();
});

test("submits sign-in form", () => {
	render(<SignInPage />);
	const buttonElement = screen.getByRole("button", { name: /submit/i });
	expect(buttonElement).toBeInTheDocument();
});