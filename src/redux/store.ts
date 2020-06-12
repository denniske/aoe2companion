import { createStore } from 'redux'
import notesReducer from './reducer'
import {getcache, setcache} from "./statecache";
import { AsyncStorage } from 'react-native';

const store = createStore(notesReducer, getcache())

store.subscribe(() => setcache(store.getState()));

(window as any).getState = () => console.log(store.getState());
(window as any).getStorage = () => {
    (async () => {
        const allKeys = await AsyncStorage.getAllKeys();
        for (const key of allKeys) {
            console.log(key, await AsyncStorage.getItem(key));
        }
    })();
    return null;
};


export default store


