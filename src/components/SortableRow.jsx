import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const STATUS_STYLES = {
  queued:    'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  printing:  'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  completed: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  cancelled: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
  failed:    'bg-red-50 text-red-700 ring-1 ring-red-200',
}

function GripIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <circle cx="4" cy="3"  r="1.2" />
      <circle cx="10" cy="3"  r="1.2" />
      <circle cx="4" cy="7"  r="1.2" />
      <circle cx="10" cy="7"  r="1.2" />
      <circle cx="4" cy="11" r="1.2" />
      <circle cx="10" cy="11" r="1.2" />
    </svg>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function timeInQueue(createdAt, finishedAt) {
  const start = new Date(createdAt)
  const end = finishedAt ? new Date(finishedAt) : new Date()
  const totalSeconds = Math.floor((end - start) / 1000)
  const d = Math.floor(totalSeconds / 86400)
  const m = Math.floor((totalSeconds % 86400) / 60)
  const s = totalSeconds % 60
  return `${d}d ${m}m ${s}s`
}

export default function SortableRow({ print, isAdmin, onDelete, onMarkDone }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: print.id, disabled: !isAdmin })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const statusStyle = STATUS_STYLES[print.status] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-gray-100 transition-colors ${isDragging ? 'bg-blue-50 shadow-lg opacity-80' : 'hover:bg-gray-50/70'}`}
    >
      {isAdmin && (
        <td className="pl-3 pr-1 py-3 w-8">
          <button
            {...attributes}
            {...listeners}
            className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-1 rounded"
            title="Drag to reorder"
          >
            <GripIcon />
          </button>
        </td>
      )}
      <td className="px-4 py-3 text-xs text-gray-400 font-mono tabular-nums">
        #{print.id}
      </td>
      <td className="px-4 py-3 font-medium">
        <a
          href={print.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-2"
        >
          {print.name}
        </a>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {print.submitter_name}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle}`}>
          {print.status}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
        {formatDate(print.created_at)}
      </td>
      <td className="px-4 py-3 text-xs text-gray-500 tabular-nums">
        {timeInQueue(print.created_at, print.finished_at)}
      </td>
      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
        {formatDate(print.finished_at)}
      </td>
      {isAdmin && (
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            {!print.finished_at && (
              <button
                onClick={() => onMarkDone(print.id)}
                className="text-xs text-green-600 hover:text-green-800 font-medium px-2 py-1 rounded hover:bg-green-50"
              >
                Done
              </button>
            )}
            <button
              onClick={() => onDelete(print.id)}
              className="text-xs text-red-400 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </td>
      )}
    </tr>
  )
}
