import { useState } from "react";
import type { Book } from "../../types/book/book";
import { getPaginatedBooks } from "../../api/books";
import { NavBar } from "../../components/NavBar";
import { BookCard } from "../../components/BookCard";
import { BookModal } from "../../components/BookModal";
import { useSearchParams } from "react-router-dom";
import PixelBlast from "../../components/PixelBlast";
import { useQuery } from "@tanstack/react-query";

export function AllBooks() {
  const [searchParams, setSearchParams] = useSearchParams({ page: "1" });

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") ?? "";
  const [isOpen, setIsOpen] = useState<Book | null>(null);

  const onOpen = (id: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("id", id);
    setSearchParams(next);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["books", page, search],
    queryFn: () =>
      getPaginatedBooks({ page, limit: 100, search: search || undefined }),
  });

  const books = data?.data ?? [];

  return (
    <div className="relative min-h-screen w-full bg-[#1a1625]">
      <div className="fixed inset-0 z-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#B497CF"
          patternScale={2}
          patternDensity={1}
          enableRipples
          rippleSpeed={0.3}
          rippleThickness={0.1}
          rippleIntensityScale={1}
          speed={0.5}
          transparent
          edgeFade={0.25}
        />
      </div>
      <div className="relative z-10">
        <NavBar />
        <div className="min-h-screen w-full px-3 pb-10 pt-20 sm:px-4">
          {isLoading ? (
            <p className="text-purple-300 text-center mt-20">Loading...</p>
          ) : (
            <div className="mx-auto grid w-full max-w-[95%] grid-cols-2 justify-items-center gap-x-3 gap-y-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 xl:gap-6 2xl:gap-10">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  bookTitle={book.title}
                  isbn={book.isbn}
                  isbn13={book.isbn13}
                  onClick={() => setIsOpen(book)}
                />
              ))}
              {books.length === 0 && (
                <p className="text-purple-400 col-span-full text-center mt-10">
                  Nessun libro trovato.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <BookModal
          onOpen={onOpen}
          book={isOpen}
          onClose={() => {
            setIsOpen(null);
            const next = new URLSearchParams(searchParams);
            next.delete("id");
            setSearchParams(next);
          }}
        />
      )}
    </div>
  );
}
