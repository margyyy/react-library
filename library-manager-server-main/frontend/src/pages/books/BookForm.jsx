import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom'
import { getBook, createBook, updateBook } from '../../api/books'
import { getAuthors } from '../../api/authors'
import { useToast } from '../../components/Layout'

const emptyForm = {
  title: '',
  isbn: '',
  isbn13: '',
  authorId: '',
  averageRating: '',
  languageCode: '',
  numPages: '',
  ratingsCount: '',
  textReviewsCount: '',
  publicationDate: '',
  publisher: '',
}

export default function BookForm() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const addToast = useToast()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ ...emptyForm, authorId: searchParams.get('authorId') || '' })
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    async function load() {
      try {
        const authorsRes = await getAuthors({ limit: 1000 })
        setAuthors(authorsRes.data)

        if (isEdit) {
          const bookData = await getBook(id)
          setForm({
            title: bookData.title || '',
            isbn: bookData.isbn || '',
            isbn13: bookData.isbn13 || '',
            authorId: String(bookData.authorId) || '',
            averageRating: bookData.averageRating != null ? String(bookData.averageRating) : '',
            languageCode: bookData.languageCode || '',
            numPages: bookData.numPages != null ? String(bookData.numPages) : '',
            ratingsCount: bookData.ratingsCount != null ? String(bookData.ratingsCount) : '',
            textReviewsCount: bookData.textReviewsCount != null ? String(bookData.textReviewsCount) : '',
            publicationDate: bookData.publicationDate || '',
            publisher: bookData.publisher || '',
          })
        }
      } catch (err) {
        addToast(err.message, 'error')
        navigate('/books')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id]) // eslint-disable-line

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.authorId) errs.authorId = 'Author is required'
    if (form.averageRating && (isNaN(Number(form.averageRating)) || Number(form.averageRating) < 0 || Number(form.averageRating) > 5)) {
      errs.averageRating = 'Rating must be between 0 and 5'
    }
    if (form.numPages && (isNaN(Number(form.numPages)) || Number(form.numPages) < 1)) {
      errs.numPages = 'Must be a positive number'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)

    const payload = {
      title: form.title.trim(),
      authorId: Number(form.authorId),
    }
    if (form.isbn.trim()) payload.isbn = form.isbn.trim()
    if (form.isbn13.trim()) payload.isbn13 = form.isbn13.trim()
    if (form.averageRating) payload.averageRating = Number(form.averageRating)
    if (form.languageCode.trim()) payload.languageCode = form.languageCode.trim()
    if (form.numPages) payload.numPages = Number(form.numPages)
    if (form.ratingsCount) payload.ratingsCount = Number(form.ratingsCount)
    if (form.textReviewsCount) payload.textReviewsCount = Number(form.textReviewsCount)
    if (form.publicationDate.trim()) payload.publicationDate = form.publicationDate.trim()
    if (form.publisher.trim()) payload.publisher = form.publisher.trim()

    try {
      if (isEdit) {
        await updateBook(id, payload)
        addToast('Book updated successfully')
        navigate(`/books/${id}`)
      } else {
        const created = await createBook(payload)
        addToast('Book created successfully')
        navigate(`/books/${created.id}`)
      }
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-[fadeIn_0.4s_ease]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-400">
        <Link to="/books" className="hover:text-surface-200 transition-colors">Books</Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-surface-200">{isEdit ? 'Edit Book' : 'New Book'}</span>
      </div>

      <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-surface-800/50">
          <h1 className="text-xl font-bold text-white">{isEdit ? 'Edit Book' : 'Create New Book'}</h1>
          <p className="text-sm text-surface-400 mt-1">
            {isEdit ? 'Update the book information below.' : 'Fill in the details to add a new book.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <Field label="Title" required error={errors.title}>
            <input
              id="book-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Harry Potter and the Philosopher's Stone"
              className={inputClass(errors.title)}
            />
          </Field>

          {/* Author */}
          <Field label="Author" required error={errors.authorId}>
            <select
              id="book-author"
              name="authorId"
              value={form.authorId}
              onChange={handleChange}
              className={inputClass(errors.authorId)}
            >
              <option value="">Select an author...</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </Field>

          {/* ISBNs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="ISBN">
              <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="ISBN-10" className={inputClass()} />
            </Field>
            <Field label="ISBN-13">
              <input name="isbn13" value={form.isbn13} onChange={handleChange} placeholder="ISBN-13" className={inputClass()} />
            </Field>
          </div>

          {/* Rating & Pages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Average Rating" error={errors.averageRating}>
              <input
                name="averageRating"
                type="number"
                step="0.01"
                min="0"
                max="5"
                value={form.averageRating}
                onChange={handleChange}
                placeholder="0 - 5"
                className={inputClass(errors.averageRating)}
              />
            </Field>
            <Field label="Number of Pages" error={errors.numPages}>
              <input
                name="numPages"
                type="number"
                min="1"
                value={form.numPages}
                onChange={handleChange}
                placeholder="e.g. 320"
                className={inputClass(errors.numPages)}
              />
            </Field>
          </div>

          {/* Language & Publisher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Language Code">
              <input name="languageCode" value={form.languageCode} onChange={handleChange} placeholder="e.g. eng" className={inputClass()} />
            </Field>
            <Field label="Publisher">
              <input name="publisher" value={form.publisher} onChange={handleChange} placeholder="Publisher name" className={inputClass()} />
            </Field>
          </div>

          {/* Publication Date */}
          <Field label="Publication Date">
            <input name="publicationDate" value={form.publicationDate} onChange={handleChange} placeholder="e.g. 6/26/1997" className={inputClass()} />
          </Field>

          {/* Ratings & Reviews Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Ratings Count">
              <input name="ratingsCount" type="number" min="0" value={form.ratingsCount} onChange={handleChange} placeholder="0" className={inputClass()} />
            </Field>
            <Field label="Text Reviews Count">
              <input name="textReviewsCount" type="number" min="0" value={form.textReviewsCount} onChange={handleChange} placeholder="0" className={inputClass()} />
            </Field>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              id="save-book-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-primary-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isEdit ? 'Update Book' : 'Create Book'}
            </button>
            <Link
              to={isEdit ? `/books/${id}` : '/books'}
              className="px-5 py-2.5 rounded-xl bg-surface-800 border border-surface-700/50 text-sm font-medium text-surface-300 hover:bg-surface-700 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-surface-300 mb-2">
        {label} {required && <span className="text-danger-400">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-danger-400">{error}</p>}
    </div>
  )
}

function inputClass(hasError) {
  return `w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:ring-1 transition-all ${
    hasError ? 'border-danger-500/50 focus:border-danger-500 focus:ring-danger-500/25' : 'border-surface-700/50 focus:border-primary-500/50 focus:ring-primary-500/25'
  }`
}
