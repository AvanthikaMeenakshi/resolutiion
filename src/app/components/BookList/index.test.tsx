import { fireEvent, render, screen } from "@testing-library/react";
import BookList from "./";
import { Book } from "@/types";

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-08-07T00:00:00Z"));
});

afterAll(() => {
  jest.useRealTimers();
});

// This will have its own unit tests
jest.mock("./ReadStatusDropdown", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

const mockBooks: Book[] = [
  {
    id: 1,
    title: "Book One",
    author: "Author One",
    read: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Book Two",
    author: "Author Two",
    read: false,
    createdAt: new Date(),
  },
];

describe("BookList", () => {
  it("renders a list of books", () => {
    render(<BookList books={mockBooks} />);

    // Titles
    expect(screen.getByText("Book One")).toBeInTheDocument();
    expect(screen.getByText("Book Two")).toBeInTheDocument();

    // Authors
    expect(
      screen.getByText(
        `Author One · Added on: ${new Date().toLocaleDateString()}`
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Author Two · Added on: ${new Date().toLocaleDateString()}`
      )
    ).toBeInTheDocument();
  });

  it("renders the search input field", () => {
    render(<BookList books={mockBooks} />);
    expect(
      screen.getByPlaceholderText("Search by title or author...")
    ).toBeInTheDocument();
  });

  it("filters books by title", () => {
    render(<BookList books={mockBooks} />);
    const input = screen.getByPlaceholderText("Search by title or author...");

    fireEvent.change(input, { target: { value: "Book One" } });

    expect(screen.getByText("Book One")).toBeInTheDocument();
    expect(screen.queryByText("Book Two")).not.toBeInTheDocument();
  });

  it("filters books by author", () => {
    render(<BookList books={mockBooks} />);
    const input = screen.getByPlaceholderText("Search by title or author...");

    fireEvent.change(input, { target: { value: "Author Two" } });

    expect(screen.getByText("Book Two")).toBeInTheDocument();
    expect(screen.queryByText("Book One")).not.toBeInTheDocument();
  });

  it("shows message when no books match search query", () => {
    render(<BookList books={mockBooks} />);
    const input = screen.getByPlaceholderText("Search by title or author...");

    fireEvent.change(input, { target: { value: "Harry Potter" } });

    expect(
      screen.getByText(/No books found with the query/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Harry Potter/i)).toBeInTheDocument();
  });
});
