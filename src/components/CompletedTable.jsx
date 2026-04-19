const STATUS_STYLES = {
  completed: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  cancelled: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
  failed:    'bg-red-50 text-red-700 ring-1 ring-red-200',
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

export default function CompletedTable({ prints, isAdmin, onDelete }) {
  if (prints.length === 0) return null

  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Completed Prints ({prints.length})
      </h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Print</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted By</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Queued</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time in Queue</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Finished</th>
              {isAdmin && <th className="px-4 py-3 w-20" />}
            </tr>
          </thead>
          <tbody className="bg-white">
            {prints.map(print => {
              const statusStyle = STATUS_STYLES[print.status] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
              return (
                <tr key={print.id} className="border-b border-gray-100 hover:bg-gray-50/70">
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
                      <button
                        onClick={() => onDelete(print.id)}
                        className="text-xs text-red-400 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
