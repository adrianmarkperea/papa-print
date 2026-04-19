const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-submission`

export async function sendSubmissionNotification({ name, link, submitter_name }) {
  await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, link, submitter_name }),
  })
}
