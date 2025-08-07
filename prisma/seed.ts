import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const books = [
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      read: true,
    },
    {
      title: "The Prophet",
      author: "Kahlil Gibran",
      read: false,
    },
    {
      title: "1984",
      author: "George Orwell",
      read: false,
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      read: true,
    },
    {
      title: "Game of Thrones",
      author: "George RR Martin",
      read: false,
    },
    {
      title: "Lord of the Rings",
      author: "JRR Tolkien",
      read: false,
    },
    {
      title: "Harry Potter Series",
      author: "JK Rowling",
      read: false,
    },
  ];

  for (const book of books) {
    await prisma.book.create({ data: book });
  }

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
