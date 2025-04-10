import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import NewNote, { links as newNoteLinks } from '~/components/NewNote';
import NoteList, { links as noteListLinks } from '~/components/NoteList';
import { getStoredNotes, storeNotes } from '~/data/notes';

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  return notes;
}

import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  // Add validation...
  
  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  //await new Promise<void>((resolve, reject) => setTimeout(() => resolve(), 2000));
  return redirect('/notes');
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}