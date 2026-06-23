import { useState, createContext, useContext, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Toast from './Toast'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      <div className="flex min-h-screen bg-surface-950">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
          {/* Top bar */}
          <header className="sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 h-16 bg-surface-900/80 backdrop-blur-xl border-b border-surface-800/50">
            <button
              id="mobile-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-2 text-sm text-surface-400">
              <div className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
              API Connected
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>

        {/* Toasts */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}
