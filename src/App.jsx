import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { sendSubmissionNotification } from './lib/resend'
import AnnouncementBanner from './components/AnnouncementBanner'
import QueueTable from './components/QueueTable'
import CompletedTable from './components/CompletedTable'
import SubmitModal from './components/SubmitModal'
import AdminLogin from './components/AdminLogin'

export default function App() {
  const [prints, setPrints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isAdmin, setIsAdmin] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  const [announcement, setAnnouncement] = useState('')
  const [editingAnnouncement, setEditingAnnouncement] = useState(false)
  const [draftAnnouncement, setDraftAnnouncement] = useState('')

  useEffect(() => {
    fetchPrints()
    fetchAnnouncement()
  }, [])

  async function fetchAnnouncement() {
    const { data } = await supabase
      .from('announcement')
      .select('message')
      .single()
    if (data) setAnnouncement(data.message)
  }

  async function fetchPrints() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('prints')
      .select('*')
      .order('position', { ascending: true })
    if (error) {
      setError('Could not load the queue. Check your Supabase configuration.')
    } else {
      setPrints(data ?? [])
    }
    setLoading(false)
  }

  async function handleSubmitPrint({ isMama, ...formData }) {
    const queued = prints.filter(p => p.status !== 'completed')
    let position
    if (isMama && queued.length > 0) {
      const minPosition = Math.min(...queued.map(p => p.position ?? 0))
      position = minPosition - 1
    } else {
      const maxPosition = prints.length > 0
        ? Math.max(...prints.map(p => p.position ?? 0))
        : -1
      position = maxPosition + 1
    }
    const { data, error } = await supabase
      .from('prints')
      .insert({ ...formData, position, status: 'queued' })
      .select()
      .single()
    if (!error && data) {
      setPrints(prev => isMama
        ? [data, ...prev]
        : [...prev, data]
      )
      sendSubmissionNotification(data)
    }
  }

  async function handleMarkDone(id) {
    const now = new Date().toISOString()
    const { error } = await supabase
      .from('prints')
      .update({ status: 'completed', finished_at: now })
      .eq('id', id)
      .is('finished_at', null)
    if (!error) {
      setPrints(prev => prev.map(p => p.id === id ? { ...p, status: 'completed', finished_at: now } : p))
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this print from the queue?')) return
    const { error } = await supabase.from('prints').delete().eq('id', id)
    if (!error) setPrints(prev => prev.filter(p => p.id !== id))
  }

  async function handleReorder(newPrints) {
    setPrints(newPrints)
    await Promise.all(
      newPrints.map((p, i) =>
        supabase.from('prints').update({ position: i }).eq('id', p.id)
      )
    )
  }

  function startEditAnnouncement() {
    setDraftAnnouncement(announcement)
    setEditingAnnouncement(true)
  }

  async function saveAnnouncement() {
    const trimmed = draftAnnouncement.trim()
    await supabase
      .from('announcement')
      .update({ message: trimmed, updated_at: new Date().toISOString() })
      .eq('id', true)
    setAnnouncement(trimmed)
    setEditingAnnouncement(false)
  }

  function cancelEditAnnouncement() {
    setEditingAnnouncement(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Announcement banner */}
      {announcement && !editingAnnouncement && (
        <AnnouncementBanner
          message={announcement}
          isAdmin={isAdmin}
          onEdit={startEditAnnouncement}
        />
      )}

      {/* Inline announcement editor */}
      {editingAnnouncement && (
        <div className="bg-amber-400 px-4 py-2.5 flex items-center gap-2">
          <input
            type="text"
            value={draftAnnouncement}
            onChange={e => setDraftAnnouncement(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveAnnouncement(); if (e.key === 'Escape') cancelEditAnnouncement() }}
            placeholder="Type your announcement..."
            className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-amber-600 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-700"
            autoFocus
          />
          <button
            onClick={saveAnnouncement}
            className="px-3 py-1.5 text-sm bg-amber-800 text-white rounded-lg hover:bg-amber-900 font-medium"
          >
            Save
          </button>
          <button
            onClick={cancelEditAnnouncement}
            className="px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-500 rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Papa Print
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {loading ? 'Loading...' : (() => { const n = prints.filter(p => p.status !== 'completed').length; return `${n} item${n !== 1 ? 's' : ''} in queue` })()}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {isAdmin && (
              <>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 ring-1 ring-purple-200">
                  Papa Mode
                </span>
                <button
                  onClick={startEditAnnouncement}
                  className="px-3 py-2 text-sm text-amber-700 border border-amber-300 bg-amber-50 rounded-lg hover:bg-amber-100 font-medium"
                >
                  {announcement ? 'Edit Announcement' : 'Add Announcement'}
                </button>
              </>
            )}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
            >
              + Submit Print
            </button>
            {!isAdmin ? (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Papa Mode
              </button>
            ) : (
              <button
                onClick={() => setIsAdmin(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Log Out
              </button>
            )}
          </div>
        </div>

        {/* Hero stats */}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
              <p className="text-3xl font-bold text-blue-600">
                {prints.filter(p => p.status !== 'completed').length}
              </p>
              <p className="text-sm text-gray-500 mt-1 font-medium">in queue</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
              <p className="text-3xl font-bold text-green-600">
                {prints.filter(p => p.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-500 mt-1 font-medium">completed</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Queue table — active prints only */}
        <QueueTable
          prints={prints.filter(p => p.status !== 'completed')}
          isAdmin={isAdmin}
          onDelete={handleDelete}
          onMarkDone={handleMarkDone}
          onReorder={handleReorder}
          loading={loading}
        />

        {isAdmin && prints.some(p => p.status !== 'completed') && (
          <p className="text-xs text-gray-400 mt-3 text-center">
            Drag rows to reorder the queue.
          </p>
        )}

        {/* Completed prints */}
        <CompletedTable
          prints={prints.filter(p => p.status === 'completed')}
          isAdmin={isAdmin}
          onDelete={handleDelete}
        />
      </div>

      {showSubmitModal && (
        <SubmitModal
          onSubmit={handleSubmitPrint}
          onClose={() => setShowSubmitModal(false)}
        />
      )}
      {showAdminLogin && (
        <AdminLogin
          onLogin={() => setIsAdmin(true)}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  )
}
