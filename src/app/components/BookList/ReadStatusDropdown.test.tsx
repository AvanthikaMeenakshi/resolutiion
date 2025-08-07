import { render, screen, fireEvent } from "@testing-library/react";
import ReadStatusDropdown from "./ReadStatusDropdown";
import { Book } from "@/types";
import { useToggleRead } from "@/app/hooks/useToggleRead";
import toast from "react-hot-toast";

jest.mock("react-hot-toast", () => {
  return {
    error: jest.fn(),
  };
});

jest.mock("@/app/hooks/useToggleRead", () => ({
  useToggleRead: jest.fn(),
}));

const mockToggle = jest.fn();

const mockBook: Book = {
  id: 1,
  title: "The Alchemist",
  author: "Paulo Coelho",
  read: true,
  createdAt: new Date("2025-08-07T00:00:00Z"),
};

describe("ReadStatusDropdown", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays 'Read' when book.read is true", () => {
    jest.mocked(useToggleRead).mockReturnValue({
      toggle: mockToggle,
      isPending: false,
      error: null,
    });

    render(<ReadStatusDropdown book={{ ...mockBook, read: true }} />);
    expect(screen.getByText("Read")).toBeInTheDocument();
  });

  it("displays 'Unread' when book.read is false", () => {
    jest.mocked(useToggleRead).mockReturnValue({
      toggle: mockToggle,
      isPending: false,
      error: null,
    });

    render(<ReadStatusDropdown book={{ ...mockBook, read: false }} />);
    expect(screen.getByText("Unread")).toBeInTheDocument();
  });

  it("opens dropdown and shows action button", () => {
    jest.mocked(useToggleRead).mockReturnValue({
      toggle: mockToggle,
      isPending: false,
      error: null,
    });

    render(<ReadStatusDropdown book={{ ...mockBook, read: true }} />);
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Mark as unread")).toBeInTheDocument();
  });

  it("calls toggle function when menu item is clicked", () => {
    jest.mocked(useToggleRead).mockReturnValue({
      toggle: mockToggle,
      isPending: false,
      error: null,
    });

    render(<ReadStatusDropdown book={{ ...mockBook, read: true }} />);
    fireEvent.click(screen.getByRole("button"));

    const action = screen.getByText("Mark as unread");
    fireEvent.click(action);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("shows toast error when error is returned", () => {
    jest.mocked(useToggleRead).mockReturnValue({
      toggle: jest.fn(),
      isPending: false,
      error: "Failed to update",
    });

    render(<ReadStatusDropdown book={mockBook} />);

    expect(toast.error).toHaveBeenCalledWith(
      "Something went wrong updating read status"
    );
  });

  it("does not show toast if error is null", () => {
    jest.mocked(useToggleRead).mockReturnValue({
      toggle: jest.fn(),
      isPending: false,
      error: null,
    });

    render(<ReadStatusDropdown book={mockBook} />);

    expect(toast.error).not.toHaveBeenCalled();
  });
});
