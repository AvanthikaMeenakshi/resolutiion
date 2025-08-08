import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BooksPage from "@/app/page";
import { getBooks, addBook, toggleRead } from "@/server/books/actions";
import toast from "react-hot-toast";

jest.mock("react-hot-toast", () => {
  return {
    error: jest.fn(),
  };
});
jest.mock("@/server/books/actions", () => ({
  getBooks: jest.fn(),
  addBook: jest.fn(),
  toggleRead: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

const mockBooks = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho",
    read: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "The Prophet",
    author: "Kahlil Gibran",
    read: false,
    createdAt: new Date(),
  },
];

describe("BooksPage", () => {
  it("renders books fetched from getBooks()", async () => {
    jest.mocked(getBooks).mockResolvedValue({
      ok: true,
      data: mockBooks,
    });
    const page = await BooksPage();
    render(page);

    await waitFor(() => {
      expect(screen.getByText("The Alchemist")).toBeInTheDocument();
      expect(screen.getByText("The Prophet")).toBeInTheDocument();
    });

    expect(screen.getByText("Add Book")).toBeInTheDocument();

    expect(getBooks).toHaveBeenCalled();
  });

  it("opens AddBookModal when Add Book button is clicked", async () => {
    jest.mocked(getBooks).mockResolvedValue({ ok: true, data: mockBooks });
    jest.mocked(addBook).mockResolvedValue({ ok: true });

    render(await BooksPage());

    const addButton = screen.getByText("Add Book");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Add a New Book")).toBeInTheDocument();
      expect(screen.getByText("Title")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Test Book" },
    });
    fireEvent.change(screen.getByLabelText("Author"), {
      target: { value: "Test Author" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() =>
      expect(addBook).toHaveBeenCalledWith(expect.any(FormData))
    );
  });

  it("toggles book read state", async () => {
    jest.mocked(getBooks).mockResolvedValue({ ok: true, data: mockBooks });
    jest.mocked(toggleRead).mockResolvedValue({ ok: true });

    render(await BooksPage());

    await waitFor(() => {
      expect(screen.getByText("Unread")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Unread"));

    const action = screen.getByText("Mark as read");
    fireEvent.click(action);

    await waitFor(() => expect(toggleRead).toHaveBeenCalled());
  });

  it("shows an error if getBooks fails", async () => {
    jest.mocked(getBooks).mockResolvedValue({
      ok: false,
      error: "Failed to fetch books",
    });

    const page = await BooksPage();
    render(page);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch books")).toBeInTheDocument();
    });
  });

  it("shows an error if addBook fails", async () => {
    jest.mocked(getBooks).mockResolvedValue({ ok: true, data: mockBooks });
    jest
      .mocked(addBook)
      .mockResolvedValue({ ok: false, error: "Failed to add book" });

    render(await BooksPage());

    fireEvent.click(screen.getByText("Add Book"));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Fail Book" },
    });
    fireEvent.change(screen.getByLabelText("Author"), {
      target: { value: "Fail Author" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Failed to add book")).toBeInTheDocument();
    });
  });

  it("shows an error if toggleRead fails", async () => {
    jest.mocked(getBooks).mockResolvedValue({ ok: true, data: mockBooks });
    jest
      .mocked(toggleRead)
      .mockResolvedValue({ ok: false, error: "Toggle failed" });

    render(await BooksPage());

    await waitFor(() => {
      expect(screen.getByText("Unread")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Unread"));
    fireEvent.click(screen.getByText("Mark as read"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Something went wrong updating read status"
      );
    });
  });
});
