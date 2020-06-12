import {produce} from "immer";
import { v4 as uuidv4 } from 'uuid';
import { TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector } from 'react-redux';

export function getNoteId() {
  return uuidv4();
}

export const EXEC = 'EXEC'

export function exec(mutation: any) {
  return {
    type: EXEC,
    mutation
  }
}

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector

export function useMutate() {
  const dispatch = useDispatch()
  return (m: any) => dispatch(exec(m));
}

export function createNote(title: string, value: string) {
  return (notes: AppState) => {
    notes.push({
      id: getNoteId(),
      note: {
        noteTitle: title,
        noteValue: value,
      },
    });
  };
}

export function updateNote(id: string, title: string, value: string) {
  return (notes: AppState) => {
    const noteEntry = notes.find(n => n.id === id);
    if (noteEntry == null) throw Error('Cannot find note');
    noteEntry.note.noteTitle = title;
    noteEntry.note.noteValue = value;
  };
}

interface IAction {
  type: string;
  id?: string;
  note?: INote;
  mutation?: any;
}

interface INoteEntry {
  id: string;
  note: INote;
}

interface INote {
  noteTitle: string;
  noteValue: string;
}

type AppState = INoteEntry[];

const initialState: AppState = []

function notesReducer(state = initialState, action: IAction) {
  switch (action.type) {
    case EXEC:
      return produce(state, action.mutation);
    default:
      return state
  }
}

export default notesReducer
