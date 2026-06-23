import { useState } from "react";
import { createBook } from "../../api/books";
import { getAllAuthors } from "../../api/authors";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import type { CreateBookDto } from "../../types/book/bookDTO";

const INPUT_CLS =
  "border border-purple-800/50 rounded p-2 bg-[#2a2040] text-purple-100 placeholder:text-purple-400/50 outline-none focus:ring-1 focus:ring-purple-500";
const INPUT_ERROR_CLS = "border-red-500 focus:ring-red-500";

type CreateBookFormErrors = Partial<Record<keyof CreateBookDto, string>>;

function validateCreateBook(values: CreateBookDto): CreateBookFormErrors {
  const errors: CreateBookFormErrors = {};

  if (!values.title.trim()) errors.title = "Inserisci il titolo.";
  if (!values.authorId) errors.authorId = "Seleziona un autore dalla lista.";
  if (!values.publisher.trim()) errors.publisher = "Inserisci l'editore.";
  if (!values.publicationDate.trim()) {
    errors.publicationDate = "Inserisci la data di pubblicazione.";
  }
  if (!values.numPages || values.numPages <= 0) {
    errors.numPages = "Inserisci un numero di pagine maggiore di zero.";
  }
  if (!values.languageCode.trim()) {
    errors.languageCode = "Inserisci il codice lingua.";
  }
  if (!values.isbn.trim()) errors.isbn = "Inserisci l'ISBN.";
  if (!values.isbn13.trim()) errors.isbn13 = "Inserisci l'ISBN13.";
  if (values.averageRating < 0 || values.averageRating > 5) {
    errors.averageRating = "Inserisci una valutazione tra 0 e 5.";
  }
  if (values.ratingsCount < 0) {
    errors.ratingsCount = "Il numero di valutazioni non può essere negativo.";
  }
  if (values.textReviewsCount < 0) {
    errors.textReviewsCount =
      "Il numero di recensioni testuali non può essere negativo.";
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-300">{message}</p>;
}

export function CreateBook() {
  const navigate = useNavigate();

  const [authorSearch, setAuthorSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedSearch] = useDebounce(authorSearch, 300);
  const [formErrors, setFormErrors] = useState<CreateBookFormErrors>({});

  const { data: authorsData } = useQuery({
    queryKey: ["authors", debouncedSearch],
    queryFn: () => getAllAuthors({ search: debouncedSearch, limit: 10 }),
    enabled: !!debouncedSearch,
  });

  const authorResults = authorsData?.data ?? [];

  const createMutation = useMutation({
    mutationFn: (values: CreateBookDto) => createBook(values),
    onSuccess: (created) => alert(`Libro creato. ID: ${created.id}`),
    onError: () => alert("Non siamo riusciti a creare il libro."),
  });

  const form = useForm({
    defaultValues: {
      title: "",
      authorId: 0,
      publisher: "",
      publicationDate: "",
      numPages: 0,
      languageCode: "",
      isbn: "",
      isbn13: "",
      averageRating: 0,
      ratingsCount: 0,
      textReviewsCount: 0,
    },
    onSubmit: async ({ value }) => {
      const errors = validateCreateBook(value);
      setFormErrors(errors);

      if (Object.keys(errors).length > 0) return;

      createMutation.mutate(value);
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
        <h2 className="text-2xl font-bold mb-6 text-purple-100">Create Book</h2>
        {Object.keys(formErrors).length > 0 && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
            Controlla i campi evidenziati prima di creare il libro.
          </div>
        )}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4">
          <form.Field
            name="title"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">Title</label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setFormErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  className={`${INPUT_CLS} ${formErrors.title ? INPUT_ERROR_CLS : ""}`}
                />
                <FieldError message={formErrors.title} />
              </div>
            )}
          />

          <form.Field
            name="authorId"
            children={(field) => (
              <div className="flex flex-col gap-1 relative w-full sm:w-[48%]">
                <label className="text-purple-400 font-semibold">Author</label>
                <input
                  placeholder="Search author..."
                  value={authorSearch}
                  onChange={(e) => {
                    setAuthorSearch(e.target.value);
                    field.handleChange(0);
                    setShowDropdown(true);
                    setFormErrors((prev) => ({ ...prev, authorId: undefined }));
                  }}
                  className={`${INPUT_CLS} ${formErrors.authorId ? INPUT_ERROR_CLS : ""}`}
                />
                {showDropdown && authorResults.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 bg-[#2a2040] border border-purple-800/50 rounded mt-1 z-10 max-h-48 overflow-y-auto">
                    {authorResults.map((author) => (
                      <li
                        key={author.id}
                        className="px-3 py-2 cursor-pointer hover:bg-purple-800/40 text-purple-100"
                        onClick={() => {
                          setAuthorSearch(author.name);
                          field.handleChange(author.id);
                          setShowDropdown(false);
                          setFormErrors((prev) => ({
                            ...prev,
                            authorId: undefined,
                          }));
                        }}
                      >
                        {author.name}
                      </li>
                    ))}
                  </ul>
                )}
                <FieldError message={formErrors.authorId} />
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
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setFormErrors((prev) => ({
                      ...prev,
                      publisher: undefined,
                    }));
                  }}
                  className={`${INPUT_CLS} ${formErrors.publisher ? INPUT_ERROR_CLS : ""}`}
                />
                <FieldError message={formErrors.publisher} />
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
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setFormErrors((prev) => ({
                      ...prev,
                      publicationDate: undefined,
                    }));
                  }}
                  className={`${INPUT_CLS} ${formErrors.publicationDate ? INPUT_ERROR_CLS : ""}`}
                />
                <FieldError message={formErrors.publicationDate} />
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
                  onChange={(e) => {
                    field.handleChange(Number(e.target.value));
                    setFormErrors((prev) => ({
                      ...prev,
                      numPages: undefined,
                    }));
                  }}
                  className={`${INPUT_CLS} ${formErrors.numPages ? INPUT_ERROR_CLS : ""}`}
                />
                <FieldError message={formErrors.numPages} />
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
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setFormErrors((prev) => ({
                      ...prev,
                      languageCode: undefined,
                    }));
                  }}
                  className={`${INPUT_CLS} ${formErrors.languageCode ? INPUT_ERROR_CLS : ""}`}
                />
                <FieldError message={formErrors.languageCode} />
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
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setFormErrors((prev) => ({ ...prev, isbn: undefined }));
                  }}
                  className={`${INPUT_CLS} ${formErrors.isbn ? INPUT_ERROR_CLS : ""}`}
                />
                <FieldError message={formErrors.isbn} />
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
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setFormErrors((prev) => ({ ...prev, isbn13: undefined }));
                  }}
                  className={`${INPUT_CLS} ${formErrors.isbn13 ? INPUT_ERROR_CLS : ""}`}
                />
                <FieldError message={formErrors.isbn13} />
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
                  onChange={(e) => {
                    field.handleChange(Number(e.target.value));
                    setFormErrors((prev) => ({
                      ...prev,
                      averageRating: undefined,
                    }));
                  }}
                  className={`${INPUT_CLS} ${formErrors.averageRating ? INPUT_ERROR_CLS : ""}`}
                />
                <FieldError message={formErrors.averageRating} />
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
                  onChange={(e) => {
                    field.handleChange(Number(e.target.value));
                    setFormErrors((prev) => ({
                      ...prev,
                      ratingsCount: undefined,
                    }));
                  }}
                  className={`${INPUT_CLS} ${formErrors.ratingsCount ? INPUT_ERROR_CLS : ""}`}
                />
                <FieldError message={formErrors.ratingsCount} />
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
                  onChange={(e) => {
                    field.handleChange(Number(e.target.value));
                    setFormErrors((prev) => ({
                      ...prev,
                      textReviewsCount: undefined,
                    }));
                  }}
                  className={`${INPUT_CLS} ${formErrors.textReviewsCount ? INPUT_ERROR_CLS : ""}`}
                />
                <FieldError message={formErrors.textReviewsCount} />
              </div>
            )}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-3 bg-red-700 text-white font-medium rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate("/booksmenu");
                  }
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !canSubmit || isSubmitting || createMutation.isPending
                }
                className="px-4 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-sm"
              >
                Create
              </button>
            </div>
          )}
        />
      </form>
    </div>
  );
}
