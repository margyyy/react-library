import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AuthorList from './pages/authors/AuthorList'
import AuthorDetail from './pages/authors/AuthorDetail'
import AuthorForm from './pages/authors/AuthorForm'
import BookList from './pages/books/BookList'
import BookDetail from './pages/books/BookDetail'
import BookForm from './pages/books/BookForm'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/authors" element={<AuthorList />} />
        <Route path="/authors/new" element={<AuthorForm />} />
        <Route path="/authors/:id" element={<AuthorDetail />} />
        <Route path="/authors/:id/edit" element={<AuthorForm />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/new" element={<BookForm />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/books/:id/edit" element={<BookForm />} />
      </Route>
    </Routes>
  )
}
