import { merge } from "lodash";
import {IStoredPrefs, store} from "./store";

export let prefs: IStoredPrefs;

export function initPrefs() {
    prefs = merge({
        app: {
            windowHeight: 900,
        },
    } as IStoredPrefs, store.get('prefs'));
}

export function savePrefs() {
    console.log('save prefs', prefs);
    store.set('prefs', prefs);
}
