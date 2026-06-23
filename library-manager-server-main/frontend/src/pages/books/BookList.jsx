import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getBooks, deleteBook } from '../../api/books'
import { useToast } from '../../components/Layout'

export default function BookList() {
  const [books, setBooks] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const addToast = useToast()

  const loadBooks = useCallback(async (page = 1, searchTerm = search) => {
    setLoading(true)
    try {
      const res = await getBooks({ page, limit: 15, search: searchTerm || undefined })
      setBooks(res.data)
      setPagination(res.pagination)
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [search, addToast])

  useEffect(() => {
    loadBooks(1, search)
  }, []) // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault()
    loadBooks(1, search)
  }

  const handleDelete = async (id, title) => {
    if (deleteId === id) {
      try {
        await deleteBook(id)
        addToast(`Book "${title}" deleted successfully`)
        loadBooks(pagination.page, search)
      } catch (err) {
        addToast(err.message, 'error')
      }
      setDeleteId(null)
    } else {
      setDeleteId(id)
      setTimeout(() => setDeleteId(null), 3000)
    }
  }

  const renderStars = (rating) => {
    if (!rating) return null
    const full = Math.floor(rating)
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} className={`w-3.5 h-3.5 ${i < full ? 'text-warning-400' : 'text-surface-700'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      )
    }
    return <div className="flex items-center gap-0.5">{stars}<span className="ml-1 text-xs text-surface-400">{rating.toFixed(1)}</span></div>
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Books</h1>
          <p className="text-surface-400 mt-1">{pagination.total} book{pagination.total !== 1 ? 's' : ''} in the library</p>
        </div>
        <Link
          to="/books/new"
          id="add-book-btn"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Book
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            id="book-search"
            type="text"
            placeholder="Search books by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700/50 text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-surface-800 border border-surface-700/50 text-surface-300 text-sm font-medium hover:bg-surface-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-surface-500 rounded-2xl bg-surface-900/60 border border-surface-800/50">
          <svg className="w-12 h-12 mb-3 text-surface-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          <p className="text-sm">No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="group rounded-2xl bg-surface-900/60 border border-surface-800/50 hover:border-surface-700/50 transition-all duration-300 overflow-hidden"
            >
              <Link to={`/books/${book.id}`} className="block p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-primary-600/30 to-accent-600/30 border border-surface-700/30 flex items-center justify-center text-primary-400 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-surface-200 group-hover:text-white transition-colors line-clamp-2">{book.title}</h3>
                    <p className="text-xs text-surface-400 mt-1 truncate">{book.authorName}</p>
                    <div className="mt-2">{renderStars(book.averageRating)}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {book.languageCode && (
                    <span className="px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-400 text-xs font-medium uppercase">{book.languageCode}</span>
                  )}
                  {book.numPages && (
                    <span className="px-2 py-0.5 rounded-md bg-surface-800 text-surface-400 text-xs">{book.numPages} pages</span>
                  )}
                  {book.publisher && (
                    <span className="px-2 py-0.5 rounded-md bg-surface-800 text-surface-400 text-xs truncate max-w-[140px]">{book.publisher}</span>
                  )}
                </div>
              </Link>

              {/* Actions */}
              <div className="flex items-center gap-1 px-5 py-3 border-t border-surface-800/30">
                <Link
                  to={`/books/${book.id}`}
                  className="p-2 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all text-xs"
                >
                  View
                </Link>
                <Link
                  to={`/books/${book.id}/edit`}
                  className="p-2 rounded-lg text-surface-400 hover:text-warning-400 hover:bg-warning-500/10 transition-all text-xs"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(book.id, book.title)}
                  className={`p-2 rounded-lg transition-all text-xs ${
                    deleteId === book.id
                      ? 'text-danger-400 bg-danger-500/15'
                      : 'text-surface-400 hover:text-danger-400 hover:bg-danger-500/10'
                  }`}
                >
                  {deleteId === book.id ? 'Confirm?' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-surface-400">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => loadBooks(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700/50 text-sm text-surface-300 hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => loadBooks(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700/50 text-sm text-surface-300 hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
