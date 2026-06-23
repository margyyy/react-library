import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import axios from "axios";

const API_URL = "http://localhost:3000/authors";
const INPUT_CLS =
  "border border-purple-800/50 rounded p-2 bg-[#2a2040] text-purple-100 placeholder:text-purple-400/50 outline-none focus:ring-1 focus:ring-purple-500 w-full";

export function EditAuthor() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = Number(idParam);
  const navigate = useNavigate();

  const {
    data: author,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["author", id],
    queryFn: async () => (await axios.get(`${API_URL}/${id}`)).data,
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async (values: any) =>
      await axios.put(`${API_URL}/${id}`, values),
    onSuccess: () => alert("Autore aggiornato."),
    onError: () => alert("Non siamo riusciti ad aggiornare l'autore."),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => await axios.delete(`${API_URL}/${id}`),
    onSuccess: () => {
      alert("Autore eliminato.");
      navigate("/authors");
    },
    onError: () =>
      alert(
        "Non possiamo eliminare l'autore. Controlla se ha libri collegati.",
      ),
  });

  if (isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#1a1625]/80 backdrop-blur-md">
        <p className="text-purple-300">Caricamento...</p>
      </div>
    );
  if (isError || !author)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#1a1625]/80 backdrop-blur-md">
        <p className="text-red-400">Autore non trovato.</p>
      </div>
    );

  return (
    <EditAuthorForm
      author={author}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      navigate={navigate}
    />
  );
}

function EditAuthorForm({
  author,
  updateMutation,
  deleteMutation,
  navigate,
}: any) {
  const form = useForm({
    defaultValues: {
      name: author.name,
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
        className="bg-[#231d35] border border-purple-900/40 rounded-xl shadow-2xl p-6 max-w-lg w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-100">Edit Author</h2>
        <div className="flex flex-col gap-4 mb-8">
          <form.Field
            name="name"
            children={(field) => (
              <div className="flex flex-col gap-1 w-full">
                <label className="text-purple-400 font-semibold">Name</label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={INPUT_CLS}
                  required
                />
              </div>
            )}
          />
        </div>

        <div className="flex justify-between gap-2">
          <button
            type="button"
            className="px-4 py-3 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
            onClick={() => {
              if (
                window.confirm("Sei sicuro di voler eliminare questo autore?")
              ) {
                deleteMutation.mutate();
              }
            }}
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
                  onClick={() => navigate("/authors")}
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
