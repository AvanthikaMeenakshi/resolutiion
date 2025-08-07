import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BooksPage from "@/app/page";
import { getBooks, addBook, toggleRead } from "@/server/books/actions";

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
    createdAt: new Date("2025-08-07T00:00:00Z"),
  },
  {
    id: 2,
    title: "The Prophet",
    author: "Kahlil Gibran",
    read: false,
    createdAt: new Date("2025-08-06T00:00:00Z"),
  },
];

describe("BooksPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
});
