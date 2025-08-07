import { Book as PrismaBook } from "@prisma/client";

export type Book = PrismaBook;

export type ApiSuccess<T = undefined> = T extends undefined
  ? { ok: true }
  : { ok: true; data: T };

export type ApiError = { ok: false; error: string };
