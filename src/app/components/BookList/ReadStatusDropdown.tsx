import { useEffect } from "react";
import toast from "react-hot-toast";
import { Book } from "@/types";
import { useToggleRead } from "@/app/hooks/useToggleRead";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const ReadStatusDropdown = ({ book }: { book: Book }) => {
  const { toggle, isPending, error } = useToggleRead(book.id);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong updating read status");
    }
  }, [error]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          disabled={isPending}
          className={`inline-flex items-center text-xs px-3 py-1 rounded-full font-medium shadow-sm transition ${
            book.read
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          } hover:bg-opacity-80 focus:outline-none`}
        >
          {book.read ? "Read" : "Unread"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="ml-2 -mr-1 h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </MenuButton>
      </div>

      <MenuItems className="absolute right-0 border border-gray-200 z-10 mt-2 w-40 origin-top-right rounded-md bg-white focus:outline-none">
        <div className="py-1 text-sm text-gray-700">
          <MenuItem>
            {() => (
              <button onClick={toggle} className={`w-full px-4 py-2 text-left`}>
                {book.read ? "Mark as unread" : "Mark as read"}
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default ReadStatusDropdown;
