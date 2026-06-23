import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAuthors } from '../api/authors'
import { getBooks } from '../api/books'

export default function Dashboard() {
  const [stats, setStats] = useState({ authors: 0, books: 0 })
  const [recentBooks, setRecentBooks] = useState([])
  const [recentAuthors, setRecentAuthors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [authorsRes, booksRes] = await Promise.all([
          getAuthors({ limit: 5, page: 1 }),
          getBooks({ limit: 5, page: 1 }),
        ])
        setStats({
          authors: authorsRes.pagination.total,
          books: booksRes.pagination.total,
        })
        setRecentAuthors(authorsRes.data)
        setRecentBooks(booksRes.data)
      } catch (err) {
        console.error('Failed to load dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-[fadeIn_0.4s_ease]">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-surface-400 mt-1">Welcome to your Library Manager</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Total Authors"
          value={stats.authors}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          }
          gradient="from-primary-600 to-primary-400"
          link="/authors"
        />
        <StatCard
          title="Total Books"
          value={stats.books}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          }
          gradient="from-accent-600 to-accent-400"
          link="/books"
        />
        <StatCard
          title="Avg Rating"
          value={recentBooks.length > 0
            ? (recentBooks.reduce((acc, b) => acc + (b.averageRating || 0), 0) / recentBooks.filter(b => b.averageRating).length || 0).toFixed(1)
            : '—'
          }
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          }
          gradient="from-warning-500 to-warning-400"
          link="/books"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          to="/authors/new"
          id="quick-add-author"
          className="group flex items-center gap-4 p-5 rounded-2xl bg-surface-900/60 border border-surface-800/50 hover:border-primary-500/30 hover:bg-surface-800/60 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Add New Author</h3>
            <p className="text-xs text-surface-400">Create a new author entry</p>
          </div>
        </Link>
        <Link
          to="/books/new"
          id="quick-add-book"
          className="group flex items-center gap-4 p-5 rounded-2xl bg-surface-900/60 border border-surface-800/50 hover:border-accent-500/30 hover:bg-surface-800/60 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center text-accent-400 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Add New Book</h3>
            <p className="text-xs text-surface-400">Add a book to the library</p>
          </div>
        </Link>
      </div>

      {/* Recent items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Authors */}
        <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800/50">
            <h2 className="text-sm font-semibold text-white">Recent Authors</h2>
            <Link to="/authors" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-surface-800/30">
            {recentAuthors.map((author) => (
              <Link
                key={author.id}
                to={`/authors/${author.id}`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-800/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {author.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-surface-200 truncate">{author.name}</p>
                  <p className="text-xs text-surface-500">Added {new Date(author.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
            {recentAuthors.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-surface-500">No authors yet</p>
            )}
          </div>
        </div>

        {/* Recent Books */}
        <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-800/50">
            <h2 className="text-sm font-semibold text-white">Recent Books</h2>
            <Link to="/books" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-surface-800/30">
            {recentBooks.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-800/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-500/15 flex items-center justify-center text-accent-400 text-xs shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-surface-200 truncate">{book.title}</p>
                  <p className="text-xs text-surface-500">{book.authorName}</p>
                </div>
                {book.averageRating && (
                  <div className="flex items-center gap-1 text-xs text-warning-400">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                    {book.averageRating.toFixed(1)}
                  </div>
                )}
              </Link>
            ))}
            {recentBooks.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-surface-500">No books yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, gradient, link }) {
  return (
    <Link
      to={link}
      className="group relative overflow-hidden rounded-2xl bg-surface-900/60 border border-surface-800/50 p-5 hover:border-surface-700/50 transition-all duration-300"
    >
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg opacity-80`}>
          {icon}
        </div>
      </div>
    </Link>
  )
}
