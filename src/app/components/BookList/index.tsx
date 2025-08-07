"use client";

import { Book } from "@/types";
import { useState, useMemo } from "react";
import ReadStatusDropdown from "@/app/components/BookList/ReadStatusDropdown";

const BookItem = ({ book }: { readonly book: Book }) => (
  <li className="px-4 py-3 flex justify-between items-start">
    <div className="space-y-1">
      <p className="font-semibold text-gray-900">{book.title}</p>
      <p className="text-xs text-gray-500">
        {book.author} · Added on: {book.createdAt.toLocaleDateString()}
      </p>
    </div>
    <div className="flex flex-col items-end gap-2">
      <ReadStatusDropdown book={book} />
    </div>
  </li>
);

const BookList = ({ books }: { readonly books: Book[] }) => {
  const [query, setQuery] = useState("");

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const q = query.toLowerCase();
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
      );
    });
  }, [books, query]);

  if (books.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 rounded-md p-6 text-center text-gray-500 bg-gray-50">
        <div className="text-3xl mb-2">📚</div>
        <p>No books added yet. Start by adding one!</p>
      </div>
    );
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search by title or author..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-indigo-500"
      />
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
        {filteredBooks.map((book) => (
          <BookItem key={`book-${book.id}`} book={book} />
        ))}
      </ul>
      {filteredBooks.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">
          📚 No books found with the query <strong>{query}</strong>.
        </p>
      ) : null}
    </>
  );
};

export default BookList;
