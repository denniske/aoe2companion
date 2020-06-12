import { createStore } from 'redux'
import notesReducer from './reducer'
import {getcache, setcache} from "./statecache";

const store = createStore(notesReducer, getcache())

store.subscribe(() => setcache(store.getState()));

export default store


