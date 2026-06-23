import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAuthor, createAuthor, updateAuthor } from '../../api/authors'
import { useToast } from '../../components/Layout'

export default function AuthorForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addToast = useToast()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ name: '' })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit) {
      getAuthor(id)
        .then((data) => {
          setForm({ name: data.name })
        })
        .catch((err) => {
          addToast(err.message, 'error')
          navigate('/authors')
        })
        .finally(() => setLoading(false))
    }
  }, [id]) // eslint-disable-line

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      if (isEdit) {
        await updateAuthor(id, form)
        addToast('Author updated successfully')
        navigate(`/authors/${id}`)
      } else {
        const created = await createAuthor(form)
        addToast('Author created successfully')
        navigate(`/authors/${created.id}`)
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
        <Link to="/authors" className="hover:text-surface-200 transition-colors">Authors</Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-surface-200">{isEdit ? 'Edit Author' : 'New Author'}</span>
      </div>

      <div className="rounded-2xl bg-surface-900/60 border border-surface-800/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-surface-800/50">
          <h1 className="text-xl font-bold text-white">{isEdit ? 'Edit Author' : 'Create New Author'}</h1>
          <p className="text-sm text-surface-400 mt-1">
            {isEdit ? 'Update the author information below.' : 'Fill in the details to add a new author.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="author-name" className="block text-sm font-medium text-surface-300 mb-2">
              Full Name <span className="text-danger-400">*</span>
            </label>
            <input
              id="author-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. J.K. Rowling"
              className={`w-full px-4 py-2.5 rounded-xl bg-surface-800/60 border text-surface-200 text-sm placeholder-surface-500 focus:outline-none focus:ring-1 transition-all ${
                errors.name ? 'border-danger-500/50 focus:border-danger-500 focus:ring-danger-500/25' : 'border-surface-700/50 focus:border-primary-500/50 focus:ring-primary-500/25'
              }`}
            />
            {errors.name && <p className="mt-1.5 text-xs text-danger-400">{errors.name}</p>}
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              id="save-author-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-primary-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isEdit ? 'Update Author' : 'Create Author'}
            </button>
            <Link
              to={isEdit ? `/authors/${id}` : '/authors'}
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
