import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it } from "node:test";
import { expect } from "chai";
import Page from "@/src/app/page";

describe("Page", () => {
  it("renders sign-in when no session", async () => {
    render(<Page />);
    const signInElement = await screen.findByText("Sign In");
    expect(signInElement).to.exist("Sign In element should be present");
  });
  it("renders welcome message with user's name when session exists", async () => {
    render(<Page />);
    const welcomeElement = await screen.findByText(/Welcome,/i);
    expect(welcomeElement).to.exist("Welcome element should be present");
  });
  it("renders BookList component when session exists", async () => {
    render(<Page />);
    const bookListElement = await screen.findByText("Book List");
    expect(bookListElement).to.exist("BookList element should be present");
  });
});