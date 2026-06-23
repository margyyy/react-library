import { useEffect, useState } from "react";
import { createAuthor, getAllAuthors } from "../../api/authors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Author } from "../../types/author/author";
import { ArrowLeft, Home, ChevronLeft, ChevronRight } from "lucide-react";
import PixelBlast from "../../components/PixelBlast";

const INPUT_CLS =
  "border border-purple-800/50 rounded p-2 bg-[#2a2040] text-purple-100 placeholder:text-purple-400/50 outline-none focus:ring-1 focus:ring-purple-500 w-full";
const INPUT_ERROR_CLS = "border-red-500 focus:ring-red-500";

const columnHelper = createColumnHelper<Author>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: (info) => (
      <Link
        to={`/edit-author/${info.row.original.id}`}
        className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-500 transition-colors shadow-sm"
      >
        Edit
      </Link>
    ),
  }),
];

function AuthorNavBar({
  page,
  onPageChange,
  setSearchName,
}: {
  page: number;
  onPageChange: (val: number) => void;
  setSearchName: (val: string) => void;
}) {
  const navigate = useNavigate();
  const [pageInput, setPageInput] = useState(String(page));

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  return (
    <nav className="fixed top-0 w-full flex items-center gap-4 p-2 z-50 bg-[#1a1625]/60 backdrop-blur-md border-b border-purple-900/30">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-purple-200" />
        </button>
        <Link to="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Home size={20} className="text-purple-200" />
        </Link>
      </div>
      <input
        placeholder="Search author by name"
        className="bg-[#2a2040] border border-purple-700/40 text-purple-100 text-sm rounded-full block w-full max-w-md px-4 py-1.5 focus:ring-purple-500 focus:border-purple-500 outline-none shadow-sm placeholder:text-purple-300/50"
        type="text"
        onChange={(e) => {
          setSearchName(e.target.value);
          onPageChange(1);
        }}
      />
      <div className="flex items-center gap-1 ml-auto">
        <button onClick={() => onPageChange(Math.max(1, page - 1))} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft size={20} className="text-purple-200" />
        </button>
        <button onClick={() => onPageChange(page + 1)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronRight size={20} className="text-purple-200" />
        </button>
      </div>
      <input
        name="page changer"
        placeholder="Pag."
        value={pageInput}
        className="bg-[#2a2040] border border-purple-700/40 text-purple-100 text-sm rounded-full w-20 px-2 py-1.5 text-center focus:ring-purple-500 focus:border-purple-500 outline-none shadow-sm placeholder:text-purple-300/50"
        onChange={(e) => {
          const value = e.target.value;
          setPageInput(value);

          if (value === "") return;

          const number = Number(value);
          if (!isNaN(number) && number > 0) {
            onPageChange(number);
          }
        }}
        onBlur={() => {
          if (pageInput === "") setPageInput(String(page));
        }}
      />
    </nav>
  );
}

function CreateAuthorForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [nameError, setNameError] = useState("");

  const createMutation = useMutation({
    mutationFn: createAuthor,
    onSuccess: () => {
      onCreated();
      onClose();
    },
    onError: () => {
      setNameError("Non siamo riusciti a creare l'autore.");
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
    },
    onSubmit: async ({ value }) => {
      const name = value.name.trim();

      if (!name) {
        setNameError("Inserisci il nome dell'autore.");
        return;
      }

      setNameError("");
      createMutation.mutate({ name });
    },
  });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1a1625]/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-purple-900/40 bg-[#231d35] p-6 shadow-2xl"
      >
        <h2 className="mb-6 text-2xl font-bold text-purple-100">
          Create Author
        </h2>

        <div className="mb-8 flex flex-col gap-4">
          <form.Field
            name="name"
            children={(field) => (
              <div className="flex w-full flex-col gap-1">
                <label className="font-semibold text-purple-400">Name</label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setNameError("");
                  }}
                  className={`${INPUT_CLS} ${nameError ? INPUT_ERROR_CLS : ""}`}
                />
                {nameError && (
                  <p className="text-sm text-red-300">{nameError}</p>
                )}
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
                className="rounded-lg bg-zinc-700 px-4 py-3 text-white shadow-sm transition-colors hover:bg-zinc-600"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-purple-700 px-4 py-3 text-white shadow-sm transition-colors hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={
                  !canSubmit || isSubmitting || createMutation.isPending
                }
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

export function AllAuthors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const pageParam = Number(searchParams.get("page"));
  const page = pageParam && pageParam > 0 ? pageParam : 1;
  const setPage = (newPage: number) => {
    setSearchParams({ page: String(newPage) });
  };

  const [searchName, setSearchName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["authors", page, searchName],
    queryFn: () =>
      getAllAuthors({
        page,
        limit: 50,
        search: searchName || undefined,
      }),
  });

  const authors = data?.data ?? [];

  const table = useReactTable({
    data: authors,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative min-h-screen bg-[#1a1625] pb-10">
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
        <AuthorNavBar page={page} onPageChange={setPage} setSearchName={setSearchName} />
        <div className="pt-20 px-6 max-w-5xl mx-auto">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-purple-100">Authors ({data?.pagination?.total ?? 0})</h1>
            <button
              type="button"
              className="w-fit rounded-lg bg-purple-700 px-4 py-3 font-medium text-white shadow-sm transition-colors hover:bg-purple-600"
              onClick={() => setIsCreateOpen(true)}
            >
              Create Author
            </button>
          </div>
          {isLoading ? (
            <p className="text-purple-300">Loading...</p>
          ) : (
            <div className="overflow-x-auto bg-[#231d35] rounded-xl shadow-xl border border-purple-900/40">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#2a2040] border-b border-purple-900/40 text-purple-300">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-6 py-4 font-semibold">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b border-purple-900/20 hover:bg-purple-900/20 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-3 text-purple-100">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {authors.length === 0 && (
                <div className="p-6 text-center text-purple-400">No authors found.</div>
              )}
            </div>
          )}
        </div>
      </div>
      {isCreateOpen && (
        <CreateAuthorForm
          onClose={() => setIsCreateOpen(false)}
          onCreated={() => {
            queryClient.invalidateQueries({ queryKey: ["authors"] });
            setPage(1);
          }}
        />
      )}
    </div>
  );
}
