import { useState } from 'react'
import { generateName } from '../utils/nameGenerator'

const MAMA_PASSWORD = 'nandito na si mama'

export default function SubmitModal({ onSubmit, onClose }) {
  const [printName, setPrintName] = useState('')
  const [link, setLink] = useState('')
  const [submitterName, setSubmitterName] = useState('')
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [mamaMode, setMamaMode] = useState(false)
  const [mamaPassword, setMamaPassword] = useState('')

  function toggleMamaMode(enabled) {
    setMamaMode(enabled)
    setMamaPassword('')
    setErrors(p => ({ ...p, mamaPassword: '' }))
    if (enabled) setSubmitterName('Mama')
    else setSubmitterName('')
  }

  function validate() {
    const errs = {}
    if (!printName.trim()) errs.printName = 'Print name is required.'
    if (!link.trim()) {
      errs.link = 'Link is required.'
    } else {
      try { new URL(link) } catch { errs.link = 'Please enter a valid URL.' }
    }
    if (mamaMode && mamaPassword !== MAMA_PASSWORD) {
      errs.mamaPassword = 'Wrong password.'
    }
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    await onSubmit({
      name: printName.trim(),
      link: link.trim(),
      submitter_name: submitterName.trim() || generateName(),
      comment: comment.trim() || null,
      isMama: mamaMode && mamaPassword === MAMA_PASSWORD,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-bold text-gray-900 mb-5">Submit a Print</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Print Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={printName}
              onChange={e => { setPrintName(e.target.value); setErrors(p => ({ ...p, printName: '' })) }}
              placeholder="e.g. Benchy Boat"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            {errors.printName && <p className="text-red-500 text-xs mt-1">{errors.printName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={link}
              onChange={e => { setLink(e.target.value); setErrors(p => ({ ...p, link: '' })) }}
              placeholder="https://www.printables.com/..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.link && <p className="text-red-500 text-xs mt-1">{errors.link}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name{' '}
              <span className="text-gray-400 font-normal">(optional — leave blank for a mystery identity)</span>
            </label>
            <input
              type="text"
              value={submitterName}
              onChange={e => !mamaMode && setSubmitterName(e.target.value)}
              placeholder="Who are you?"
              readOnly={mamaMode}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent ${mamaMode ? 'border-pink-300 bg-pink-50 text-pink-700 font-medium focus:ring-pink-400 cursor-not-allowed' : 'border-gray-300 focus:ring-blue-500'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Any special instructions or details..."
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={mamaMode}
                onChange={e => toggleMamaMode(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-400"
              />
              <span className="text-sm font-medium text-pink-600">Mama Mode</span>
              <span className="text-xs text-gray-400">(cuts to the front of the queue)</span>
            </label>
            {mamaMode && (
              <div className="mt-2">
                <input
                  type="password"
                  value={mamaPassword}
                  onChange={e => { setMamaPassword(e.target.value); setErrors(p => ({ ...p, mamaPassword: '' })) }}
                  placeholder="Enter mama password..."
                  className="w-full border border-pink-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  autoFocus
                />
                {errors.mamaPassword && <p className="text-red-500 text-xs mt-1">{errors.mamaPassword}</p>}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add to Queue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
