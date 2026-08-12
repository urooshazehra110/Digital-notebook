export default function NoteEditor({
  note,
  isNewNote,
  onChange,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  statusMessage,
}) {
  if (!note) {
    return (
      <section className="editor editor-empty">
        <div className="editor-empty-inner">
          <p className="editor-empty-quote">
            “Organise your thoughts, create your future…”
          </p>
          <p className="editor-empty-hint">
            Select a note from the sidebar, or start a new one.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="editor">
      <div className="editor-page">
        <div className="editor-page-header">
          <input
            className="editor-title-input"
            type="text"
            placeholder="Untitled note"
            value={note.title}
            onChange={(e) => onChange({ ...note, title: e.target.value })}
          />
          <span className="editor-date">
            {new Date(note.updated_at || Date.now()).toLocaleDateString(
              undefined,
              { year: 'numeric', month: 'short', day: 'numeric' }
            )}
          </span>
        </div>

        <textarea
          className="editor-content-input"
          placeholder="Start writing…"
          value={note.content}
          onChange={(e) => onChange({ ...note, content: e.target.value })}
        />

        <div className="editor-footer">
          <div className="editor-status">{statusMessage}</div>
          <div className="editor-actions">
            {!isNewNote && (
              <button
                className="btn btn-ghost-danger"
                onClick={onDelete}
                disabled={isDeleting || isSaving}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={onSave}
              disabled={isSaving || isDeleting}
            >
              {isSaving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
