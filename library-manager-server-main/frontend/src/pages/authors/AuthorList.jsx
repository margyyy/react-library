import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getAuthors, deleteAuthor } from '../../api/authors'
import { useToast } from '../../components/Layout'

export default function AuthorList() {
  const [authors, setAuthors] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const addToast = useToast()

  const loadAuthors = useCallback(async (page = 1, searchTerm = search) => {
    setLoading(true)
    try {
      const res = await getAuthors({ page, limit: 15, search: searchTerm || undefined })
      setAuthors(res.data)
      setPagination(res.pagination)
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [search, addToast])

  useEffect(() => {
    loadAuthors(1, search)
  }, []) // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault()
    loadAuthors(1, search)
  }

  const handleDelete = async (id, name) => {
    if (deleteId === id) {
      try {
        await deleteAuthor(id)
        addToast(`Author "${name}" deleted successfully`)
        loadAuthors(pagination.page, search)
      } catch (err) {
        addToast(err.message, 'error')
      }
      setDeleteId(null)
    } else {
      setDeleteId(id)
      setTimeout(() => setDeleteId(null), 3000)
    }
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Authors</h1>
          <p className="text-surface-400 mt-1">{pagination.total} author{pagination.total !== 1 ? 's' : ''} in the library</p>
        </div>
        <Link
          to="/authors/new"
          id="add-author-btn"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Author
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            id="author-search"
            type="text"
            placeholder="Search authors by name..."
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

      {/* Table */}
      <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : authors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-surface-500">
            <svg className="w-12 h-12 mb-3 text-surface-600" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <p className="text-sm">No authors found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Author</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden sm:table-cell">Created</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/30">
                {authors.map((author) => (
                  <tr key={author.id} className="group hover:bg-surface-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link to={`/authors/${author.id}`} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {author.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-surface-200 group-hover:text-white transition-colors">{author.name}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-surface-400 hidden sm:table-cell">
                      {new Date(author.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/authors/${author.id}`}
                          className="p-2 rounded-lg text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </Link>
                        <Link
                          to={`/authors/${author.id}/edit`}
                          className="p-2 rounded-lg text-surface-400 hover:text-warning-400 hover:bg-warning-500/10 transition-all"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(author.id, author.name)}
                          className={`p-2 rounded-lg transition-all ${
                            deleteId === author.id
                              ? 'text-danger-400 bg-danger-500/15'
                              : 'text-surface-400 hover:text-danger-400 hover:bg-danger-500/10'
                          }`}
                          title={deleteId === author.id ? 'Click again to confirm' : 'Delete'}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-surface-400">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => loadAuthors(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 rounded-lg bg-surface-800 border border-surface-700/50 text-sm text-surface-300 hover:bg-surface-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => loadAuthors(pagination.page + 1)}
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
