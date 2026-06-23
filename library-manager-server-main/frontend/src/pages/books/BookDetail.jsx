import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBook, deleteBook } from '../../api/books'
import { useToast } from '../../components/Layout'

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addToast = useToast()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    getBook(id)
      .then(setBook)
      .catch((err) => {
        addToast(err.message, 'error')
        navigate('/books')
      })
      .finally(() => setLoading(false))
  }, [id]) // eslint-disable-line

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    try {
      await deleteBook(id)
      addToast(`Book "${book.title}" deleted successfully`)
      navigate('/books')
    } catch (err) {
      addToast(err.message, 'error')
      setConfirmDelete(false)
    }
  }

  const renderStars = (rating) => {
    if (!rating) return null
    const full = Math.floor(rating)
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-5 h-5 ${i < full ? 'text-warning-400' : 'text-surface-700'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        ))}
        <span className="ml-2 text-lg font-semibold text-warning-400">{rating.toFixed(2)}</span>
        {book.ratingsCount && (
          <span className="text-sm text-surface-400 ml-1">({book.ratingsCount.toLocaleString()} ratings)</span>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!book) return null

  return (
    <div className="space-y-8 max-w-4xl animate-[fadeIn_0.4s_ease]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-400">
        <Link to="/books" className="hover:text-surface-200 transition-colors">Books</Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-surface-200 truncate">{book.title}</span>
      </div>

      {/* Book card */}
      <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Book cover placeholder */}
          <div className="w-32 h-44 rounded-xl bg-gradient-to-br from-primary-600/30 to-accent-600/30 border border-surface-700/30 flex items-center justify-center text-primary-400 shrink-0 shadow-xl">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">{book.title}</h1>

            <Link to={`/authors/${book.authorId}`} className="inline-flex items-center gap-2 mt-2 text-sm text-primary-400 hover:text-primary-300 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              {book.authorName}
            </Link>

            {book.averageRating && (
              <div className="mt-3">{renderStars(book.averageRating)}</div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              <Link
                to={`/books/${book.id}/edit`}
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

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InfoCard label="ISBN" value={book.isbn || '—'} />
        <InfoCard label="ISBN-13" value={book.isbn13 || '—'} />
        <InfoCard label="Language" value={book.languageCode ? book.languageCode.toUpperCase() : '—'} />
        <InfoCard label="Pages" value={book.numPages ? book.numPages.toLocaleString() : '—'} />
        <InfoCard label="Publisher" value={book.publisher || '—'} />
        <InfoCard label="Publication Date" value={book.publicationDate || '—'} />
        <InfoCard label="Text Reviews" value={book.textReviewsCount ? book.textReviewsCount.toLocaleString() : '—'} />
        <InfoCard label="Added" value={new Date(book.createdAt).toLocaleDateString()} />
      </div>
    </div>
  )
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-900/60 border border-surface-800/50 px-5 py-4">
      <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-surface-200 mt-1.5">{value}</p>
    </div>
  )
}
