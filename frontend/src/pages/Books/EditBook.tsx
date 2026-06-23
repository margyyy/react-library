import { getBook, updateBook, deleteBook } from "../../api/books";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Book } from "../../types/book/book";
import { useForm } from "@tanstack/react-form";

const INPUT_CLS =
  "border border-purple-800/50 rounded p-2 bg-[#2a2040] text-purple-100 placeholder:text-purple-400/50 outline-none focus:ring-1 focus:ring-purple-500 w-full";

function EditBookForm({ book }: { book: Book }) {
  const navigate = useNavigate();

  const updateMutation = useMutation({
    mutationFn: (values: any) => updateBook(book.id, values),
    onSuccess: () => alert("Libro aggiornato."),
    onError: () => alert("Non siamo riusciti ad aggiornare il libro."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBook(book.id),
    onSuccess: () => {
      alert("Libro eliminato.");
      navigate("/booksmenu");
    },
    onError: () => alert("Non siamo riusciti a eliminare il libro."),
  });

  const form = useForm({
    defaultValues: {
      title: book.title,
      authorId: book.authorId,
      publisher: book.publisher ?? "",
      publicationDate: book.publicationDate ?? "",
      numPages: book.numPages ?? 0,
      languageCode: book.languageCode ?? "",
      isbn: book.isbn ?? "",
      isbn13: book.isbn13 ?? "",
      averageRating: book.averageRating ?? 0,
      ratingsCount: book.ratingsCount ?? 0,
      textReviewsCount: book.textReviewsCount ?? 0,
    },
    onSubmit: async ({ value }) => {
      updateMutation.mutate(value);
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1a1625]/80 backdrop-blur-md p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="bg-[#231d35] border border-purple-900/40 rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-100">Edit Book</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4">
          <form.Field
            name="title"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">Title</label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            )}
          />

          <form.Field
            name="authorId"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">
                  Author (ID)
                </label>
                <input
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className={INPUT_CLS}
                />
              </div>
            )}
          />

          <form.Field
            name="publisher"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">
                  Publisher
                </label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            )}
          />

          <form.Field
            name="publicationDate"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">
                  Publication date
                </label>
                <input
                  name={field.name}
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            )}
          />

          <form.Field
            name="numPages"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">Pages</label>
                <input
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className={INPUT_CLS}
                />
              </div>
            )}
          />

          <form.Field
            name="languageCode"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">
                  Language
                </label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            )}
          />

          <form.Field
            name="isbn"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">ISBN</label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            )}
          />

          <form.Field
            name="isbn13"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">ISBN13</label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>
            )}
          />

          <form.Field
            name="averageRating"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">
                  Average rating
                </label>
                <input
                  name={field.name}
                  type="number"
                  step="0.01"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className={INPUT_CLS}
                />
              </div>
            )}
          />

          <form.Field
            name="ratingsCount"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">
                  Ratings count
                </label>
                <input
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className={INPUT_CLS}
                />
              </div>
            )}
          />

          <form.Field
            name="textReviewsCount"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">
                  Text reviews count
                </label>
                <input
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className={INPUT_CLS}
                />
              </div>
            )}
          />
        </div>

        <div className="flex justify-between gap-2">
          <button
            type="button"
            className="px-4 py-3 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            Delete
          </button>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors shadow-sm"
                  onClick={() => {
                    if (window.history.length > 1) navigate(-1);
                    else navigate("/booksmenu");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-sm"
                  disabled={
                    !canSubmit || isSubmitting || updateMutation.isPending
                  }
                >
                  Save
                </button>
              </div>
            )}
          />
        </div>
      </form>
    </div>
  );
}

export function EditBook() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = Number(idParam);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBook(id),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#1a1625]/80 backdrop-blur-md">
        <p className="text-purple-300">Loading...</p>
      </div>
    );

  if (isError || !data)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#1a1625]/80 backdrop-blur-md">
        <p className="text-red-400">Book not found.</p>
      </div>
    );

  return <EditBookForm book={data} />;
}
