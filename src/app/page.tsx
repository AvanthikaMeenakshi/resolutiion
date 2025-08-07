import { getBooks } from "@/server/books/actions";
import AddBookModal from "./components/AddBookModal";
import BookList from "./components/BookList";

export default async function BooksPage() {
  const result = await getBooks();

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Your Reading List
          </h1>
          <p className="mt-2 text-gray-600">
            Keep track of what you&apos;ve read and what&apos;s still waiting on
            the shelf.
          </p>
        </div>
        <AddBookModal />
      </header>
      {result.ok ? (
        <BookList books={result.data} />
      ) : (
        <p className="text-red-600">{result.error}</p>
      )}
    </main>
  );
}
