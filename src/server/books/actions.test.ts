import { getBooks, addBook, toggleRead } from "./actions";
import { prisma } from "../db";
import { revalidatePath } from "next/cache";

jest.mock("../db");
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));
jest.useFakeTimers();

describe("Books Actions", () => {
  beforeAll(() => {
    jest.setSystemTime(new Date("01-01-2025"));
  });
  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("Getting Books", () => {
    it("should retrieve list of books", async () => {
      const mockBooks = [
        {
          id: 1,
          title: "Book A",
          author: "Author A",
          read: false,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: "Book B",
          author: "Author B",
          read: true,
          createdAt: new Date(),
        },
      ];
      jest.mocked(prisma.book.findMany).mockResolvedValue(mockBooks);

      const result = await getBooks();
      expect(prisma.book.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
      });
      if (result.ok) expect(result.data).toEqual(mockBooks);
    });

    it("should return error response when there's error fetching books", async () => {
      jest
        .mocked(prisma.book.findMany)
        .mockRejectedValue(new Error("Unable to fetch data from sqlite"));

      const result = await getBooks();
      if (!result.ok) expect(result.error).toBe("Failed to fetch books.");
    });
  });

  describe("Adding a new book", () => {
    it("should be able to add a new book to the list of books", async () => {
      const formData = new FormData();
      formData.set("title", "Lord of the Rings");
      formData.set("author", "J.R.R Tolkien");
      jest.mocked(prisma.book.create).mockResolvedValue({
        id: 1,
        title: "Lord of the Rings",
        author: "J.R.R Tolkien",
        read: false,
        createdAt: new Date(),
      });
      const response = await addBook(formData);

      expect(prisma.book.create).toHaveBeenCalledWith({
        data: {
          title: "Lord of the Rings",
          author: "J.R.R Tolkien",
        },
      });
      expect(response).toEqual({ ok: true });
      expect(revalidatePath).toHaveBeenCalled();
    });

    it("should return error if book creation fails", async () => {
      const formData = new FormData();
      formData.set("title", "Test Book");
      formData.set("author", "Test Author");

      jest.mocked(prisma.book.create).mockRejectedValue(new Error("DB error"));

      const response = await addBook(formData);

      expect(response.ok).toBe(false);
      if (!response.ok)
        expect(response.error).toBe("Failed to create a new book.");
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("toggleRead", () => {
    it("returns error if the book does not exist", async () => {
      jest.mocked(prisma.book.findUnique).mockResolvedValue(null);

      const result = await toggleRead(123);
      expect(result).toEqual({
        ok: false,
        error: "Unable to find the book",
      });

      expect(prisma.book.update).not.toHaveBeenCalled();
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("toggles the read status if the book is found", async () => {
      const book = {
        id: 1,
        title: "Test Book",
        author: "Test Author",
        read: false,
        createdAt: new Date(),
      };

      jest.mocked(prisma.book.findUnique).mockResolvedValue(book);
      jest.mocked(prisma.book.update).mockResolvedValue({
        ...book,
        read: true,
      });

      const result = await toggleRead(1);

      expect(prisma.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { read: true },
      });

      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(result).toEqual({
        ok: true,
      });
    });

    it("returns error if update fails", async () => {
      const book = {
        id: 2,
        title: "Broken Book",
        author: "Author X",
        read: true,
        createdAt: new Date(),
      };

      jest.mocked(prisma.book.findUnique).mockResolvedValue(book);
      jest
        .mocked(prisma.book.update)
        .mockRejectedValue(new Error("Update failed"));

      const result = await toggleRead(2);

      expect(result).toEqual({
        ok: false,
        error: "Failed to update read status.",
      });
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});
