const BASE_URL = 'http://127.0.0.1:8000/notes'

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    try {
      const body = await res.json()
      if (body?.detail) message = body.detail
    } catch {
      // ignore JSON parse errors on error responses
    }
    throw new Error(message)
  }
  // DELETE requests may return no content
  if (res.status === 204) return null
  return res.json()
}

export async function fetchNotes() {
  const res = await fetch(BASE_URL)
  return handleResponse(res)
}

export async function fetchNote(id) {
  const res = await fetch(`${BASE_URL}/${id}`)
  return handleResponse(res)
}

export async function createNote({ title, content }) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  })
  return handleResponse(res)
}

export async function updateNote(id, { title, content }) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  })
  return handleResponse(res)
}

export async function deleteNote(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(res)
}
