import { createStore } from 'redux'
import notesReducer, {exec, setStartupTime} from './reducer'
import {getcache, setcache} from "./statecache";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getTimeSinceStartup} from "react-native-startup-time";

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

getTimeSinceStartup().then((time) => {
    console.log(`Time since startup...: ${time} ms`);
    let startupTime = time;
    store.dispatch(exec(setStartupTime(startupTime)));
});

export default store


