const TAB_LETTERS = ['A', 'B', 'C', 'D', 'E']

function getPreview(content) {
  if (!content) return 'No content yet'
  const clean = content.replace(/\s+/g, ' ').trim()
  return clean.length > 60 ? `${clean.slice(0, 60)}…` : clean
}

export default function Sidebar({
  notes,
  activeId,
  onSelect,
  onNewNote,
  isLoading,
  loadError,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p className="sidebar-eyebrow">My Notebook</p>
        <h1 className="sidebar-title">Notes</h1>
      </div>

      <button className="new-note-btn" onClick={onNewNote}>
        <span className="new-note-btn-icon">+</span>
        New Note
      </button>

      <div className="note-list">
        {isLoading && <p className="sidebar-status">Loading notes…</p>}
        {loadError && !isLoading && (
          <p className="sidebar-status sidebar-status-error">{loadError}</p>
        )}
        {!isLoading && !loadError && notes.length === 0 && (
          <p className="sidebar-status">
            No notes yet. Start your first page.
          </p>
        )}

        {!isLoading &&
          notes.map((note, index) => (
            <button
              key={note.id}
              className={`note-tab ${note.id === activeId ? 'note-tab-active' : ''}`}
              onClick={() => onSelect(note.id)}
            >
              <span className="note-tab-letter">
                {TAB_LETTERS[index % TAB_LETTERS.length]}
              </span>
              <span className="note-tab-body">
                <span className="note-tab-title">
                  {note.title?.trim() || 'Untitled note'}
                </span>
                <span className="note-tab-preview">
                  {getPreview(note.content)}
                </span>
              </span>
            </button>
          ))}
      </div>
    </aside>
  )
}
