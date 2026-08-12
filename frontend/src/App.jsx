import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import NoteEditor from './components/NoteEditor.jsx'
import { fetchNotes, createNote, updateNote, deleteNote } from './api.js'

const DRAFT_ID = 'draft'

function emptyDraft() {
  return { id: DRAFT_ID, title: '', content: '' }
}

export default function App() {
  const [notes, setNotes] = useState([])
  const [activeNote, setActiveNote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadNotes() {
      setIsLoading(true)
      setLoadError('')
      try {
        const data = await fetchNotes()
        if (!cancelled) setNotes(data ?? [])
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            'Could not reach the notes server. Is the API running on 127.0.0.1:8000?'
          )
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadNotes()
    return () => {
      cancelled = true
    }
  }, [])

  const isNewNote = activeNote?.id === DRAFT_ID

  function handleSelect(id) {
    const note = notes.find((n) => n.id === id)
    if (note) {
      setActiveNote({ ...note })
      setStatusMessage('')
    }
  }

  function handleNewNote() {
    setActiveNote(emptyDraft())
    setStatusMessage('')
  }

  async function handleSave() {
    if (!activeNote) return
    const payload = {
      title: activeNote.title.trim() || 'Untitled note',
      content: activeNote.content,
    }

    setIsSaving(true)
    setStatusMessage('')
    try {
      if (isNewNote) {
        const created = await createNote(payload)
        setNotes((prev) => [created, ...prev])
        setActiveNote(created)
        setStatusMessage('Note created.')
      } else {
        const updated = await updateNote(activeNote.id, payload)
        setNotes((prev) =>
          prev.map((n) => (n.id === activeNote.id ? updated : n))
        )
        setActiveNote(updated)
        setStatusMessage('Note saved.')
      }
    } catch (err) {
      setStatusMessage(err.message || 'Something went wrong while saving.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!activeNote || isNewNote) return
    setIsDeleting(true)
    setStatusMessage('')
    try {
      await deleteNote(activeNote.id)
      setNotes((prev) => prev.filter((n) => n.id !== activeNote.id))
      setActiveNote(null)
    } catch (err) {
      setStatusMessage(err.message || 'Something went wrong while deleting.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        notes={notes}
        activeId={activeNote?.id}
        onSelect={handleSelect}
        onNewNote={handleNewNote}
        isLoading={isLoading}
        loadError={loadError}
      />
      <main className="main-panel">
        <NoteEditor
          note={activeNote}
          isNewNote={isNewNote}
          onChange={setActiveNote}
          onSave={handleSave}
          onDelete={handleDelete}
          isSaving={isSaving}
          isDeleting={isDeleting}
          statusMessage={statusMessage}
        />
      </main>
    </div>
  )
}
