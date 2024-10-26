import { expect, test } from "@playwright/test";
import { NotesClass } from "../../classes/notesClass";
import { CommonClass } from "../../classes/commonClass";

test.describe("API tests for Notes", () => {
  test("Create Note", async ({ request }) => {
    const notesClass = new NotesClass(request);
    const commonClass = new CommonClass();

    const createdNote = await notesClass.createNote();
    const createdNoteJson = await createdNote.resBody.json();
    expect(createdNoteJson.message).toBe("Note successfully created");

    const allNotes = await notesClass.getAllNotes();
    await notesClass.searchForNote(createdNote.noteId, allNotes, true);
    await commonClass.attachApiResponse(createdNoteJson);
  });

  test("Update Note", async ({ request }) => {
    const notesClass = new NotesClass(request);
    const commonClass = new CommonClass();
    const createdNote = await notesClass.createNote();
    const updatedNote = await notesClass.updateNote(createdNote.noteId);

    expect(updatedNote.status).toBe(200);
    expect(updatedNote.message).toBe("Note successfully Updated");
    await commonClass.attachApiResponse(updatedNote);
  });

  test("Create and Delete note", async ({ request }) => {
    const notesClass = new NotesClass(request);
    const commonClass = new CommonClass();

    const createdNote = await notesClass.createNote();
    const deletedNote = await notesClass.deleteNote(createdNote.noteId);
    expect(deletedNote.status).toBe(200);
    expect(deletedNote.message).toBe("Note successfully deleted");

    const allNotes = await notesClass.getAllNotes();
    await notesClass.searchForNote(createdNote.noteId, allNotes, false);

    await commonClass.attachApiResponse(deletedNote);
  });
});
