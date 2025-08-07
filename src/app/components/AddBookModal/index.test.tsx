import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddBookModal from "@/app/components/AddBookModal";
import * as actions from "@/server/books/actions";
import React from "react";

jest.mock("@/server/books/actions", () => ({
  addBook: jest.fn(),
}));

describe("AddBookModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Add Book button", () => {
    render(<AddBookModal />);
    expect(screen.getByText("Add Book")).toBeInTheDocument();
  });

  it("opens the modal when the button is clicked", async () => {
    render(<AddBookModal />);
    fireEvent.click(screen.getByText("Add Book"));
    await waitFor(() =>
      expect(screen.getByText("Add a New Book")).toBeInTheDocument()
    );
  });

  it("submits the form successfully and closes the modal", async () => {
    jest.mocked(actions.addBook).mockResolvedValue({ ok: true });

    render(<AddBookModal />);
    fireEvent.click(screen.getByText("Add Book"));

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Book" },
    });
    fireEvent.change(screen.getByLabelText("Author"), {
      target: { value: "Test Author" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(actions.addBook).toHaveBeenCalledWith(expect.any(FormData))
    );
  });

  it("shows error message if addBook fails", async () => {
    jest.mocked(actions.addBook).mockResolvedValue({
      ok: false,
      error: "Failed to add book",
    });

    render(<AddBookModal />);
    fireEvent.click(screen.getByText("Add Book"));

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Book" },
    });
    fireEvent.change(screen.getByLabelText("Author"), {
      target: { value: "Test Author" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(screen.getByText("Failed to add book")).toBeInTheDocument()
    );
  });
});
