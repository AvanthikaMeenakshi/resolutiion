"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import { addBook } from "@/server/books/actions";

const AddBookModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await addBook(formData);

    if (!res.ok) {
      setError(res.error);
    } else {
      setOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-4 font-bold px-4 py-2 text-white rounded transition flex bg-indigo-500 hover:bg-indigo-600"
      >
        Add Book
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center px-4">
            <DialogPanel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <DialogTitle className="text-lg font-semibold mb-4">
                Add a New Book
              </DialogTitle>

              <form
                onSubmit={handleSubmit}
                aria-describedby={error ? "form-error" : undefined}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="title" className="block text-sm font-medium">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    required
                    className="mt-1 w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium">
                    Author
                  </label>
                  <input
                    id="author"
                    name="author"
                    required
                    className="mt-1 w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
                  />
                </div>

                {error && (
                  <p id="form-error" className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="border border-gray-400 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white rounded text-sm bg-indigo-500 hover:bg-indigo-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddBookModal;
