import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAuthor, getAuthorBooks, deleteAuthor } from '../../api/authors'
import { useToast } from '../../components/Layout'

export default function AuthorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addToast = useToast()
  const [author, setAuthor] = useState(null)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [authorData, booksData] = await Promise.all([
          getAuthor(id),
          getAuthorBooks(id),
        ])
        setAuthor(authorData)
        setBooks(booksData)
      } catch (err) {
        addToast(err.message, 'error')
        navigate('/authors')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id]) // eslint-disable-line

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    try {
      await deleteAuthor(id)
      addToast(`Author "${author.name}" deleted successfully`)
      navigate('/authors')
    } catch (err) {
      addToast(err.message, 'error')
      setConfirmDelete(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!author) return null

  return (
    <div className="space-y-8 max-w-4xl animate-[fadeIn_0.4s_ease]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-400">
        <Link to="/authors" className="hover:text-surface-200 transition-colors">Authors</Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-surface-200">{author.name}</span>
      </div>

      {/* Author card */}
      <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-primary-500/20 shrink-0">
            {author.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">{author.name}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-surface-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                Created {new Date(author.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                {books.length} book{books.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex gap-3 mt-5">
              <Link
                to={`/authors/${author.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-800 border border-surface-700/50 text-sm font-medium text-surface-200 hover:bg-surface-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  confirmDelete
                    ? 'bg-danger-600 hover:bg-danger-500 text-white'
                    : 'bg-surface-800 border border-surface-700/50 text-surface-200 hover:bg-danger-500/15 hover:text-danger-400 hover:border-danger-500/30'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                {confirmDelete ? 'Confirm Delete' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Books by author */}
      <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-800/50">
          <h2 className="text-lg font-semibold text-white">Books by {author.name}</h2>
          <Link
            to={`/books/new?authorId=${author.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/15 text-primary-400 text-xs font-medium hover:bg-primary-500/25 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Book
          </Link>
        </div>
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-surface-500">
            <p className="text-sm">No books by this author</p>
            <Link to={`/books/new?authorId=${author.id}`} className="text-sm text-primary-400 hover:text-primary-300 mt-2 transition-colors">
              Add the first book →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-surface-800/30">
            {books.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-surface-800/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-500/15 flex items-center justify-center text-accent-400 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-surface-200 group-hover:text-white transition-colors truncate">{book.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {book.publicationDate && (
                      <span className="text-xs text-surface-500">{book.publicationDate}</span>
                    )}
                    {book.languageCode && (
                      <span className="px-1.5 py-0.5 rounded bg-surface-800 text-xs text-surface-400 uppercase">{book.languageCode}</span>
                    )}
                  </div>
                </div>
                {book.averageRating && (
                  <div className="flex items-center gap-1 text-sm text-warning-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                    {book.averageRating.toFixed(1)}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
