"use server";

import { ApiSuccess, ApiError, Book } from "@/types";
import { prisma } from "../db";
import { revalidatePath } from "next/cache";

const getFormString = (form: FormData, key: string): string => {
  const value = form.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required`);
  }
  return value.trim();
};

export async function getBooks(): Promise<ApiSuccess<Book[]> | ApiError> {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { ok: true, data: books };
  } catch (e) {
    console.error("Error in getBooks:", e);
    return { ok: false, error: "Failed to fetch books." };
  }
}

export async function addBook(
  formData: FormData
): Promise<ApiSuccess | ApiError> {
  const title = getFormString(formData, "title");
  const author = getFormString(formData, "author");

  if (!title || !author) {
    throw new Error("Title and Author are required.");
  }

  try {
    await prisma.book.create({
      data: { title, author },
    });
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    console.error("Error in addBook:", e);
    return { ok: false, error: "Failed to create a new book." };
  }
}

export async function toggleRead(id: number): Promise<ApiSuccess | ApiError> {
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book)
    return {
      ok: false,
      error: "Unable to find the book",
    };

  try {
    await prisma.book.update({
      where: { id },
      data: { read: !book.read },
    });
    revalidatePath("/");
    return {
      ok: true,
    };
  } catch (e) {
    console.error("Error in toggling the book as read:", e);
    return { ok: false, error: "Failed to update read status." };
  }
}
