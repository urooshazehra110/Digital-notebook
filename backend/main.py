from typing import List

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import engine, get_db, Base
from backend.models import Note
from backend.schemas import NoteCreate, NoteResponse, NoteUpdate


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Digital Notebook API",
    description="Backend API for my digital notebook",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Digital Notebook API is running!"
    }


@app.get(
    "/notes",
    response_model=List[NoteResponse]
)
def get_notes(db: Session = Depends(get_db)):

    notes = db.query(Note).all()

    return notes


@app.post(
    "/notes",
    response_model=NoteResponse
)
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db)
):

    new_note = Note(
        title=note.title,
        content=note.content
    )

    db.add(new_note)

    db.commit()

    db.refresh(new_note)

    return new_note


@app.get(
    "/notes/{note_id}",
    response_model=NoteResponse
)
def get_note(
    note_id: int,
    db: Session = Depends(get_db)
):

    note = db.query(Note).filter(
        Note.id == note_id
    ).first()

    if note is None:

        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    return note

@app.put(
    "/notes/{note_id}",
    response_model=NoteResponse
)
def update_note(
    note_id: int,
    note_data: NoteUpdate,
    db: Session = Depends(get_db)
):

    note = db.query(Note).filter(
        Note.id == note_id
    ).first()

    if note is None:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    note.title = note_data.title
    note.content = note_data.content

    db.commit()
    db.refresh(note)

    return note

@app.delete("/notes/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db)
):

    note = db.query(Note).filter(
        Note.id == note_id
    ).first()

    if note is None:

        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    db.delete(note)

    db.commit()

    return {
        "message": "Note deleted successfully"
    }