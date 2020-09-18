import store from "../redux/store";
import {exec, setError} from "../redux/reducer";

export async function fetchJson(title: string, input: RequestInfo, init?: RequestInit) {
    if (init) {
        console.log(input, init);
    } else {
        console.log(input);
    }

    let response = null;
    try {
        response = await fetch(input, init);
        return await response.json();
    } catch (e) {
        console.log(input, 'failed', response?.status);
        if (response?.status !== 400)
        {
            await fetchJson2(title, input, init);
        } else {
            store.dispatch(exec(setError({
                error: e,
                title: 'Network Request Failed: ' + title,
                extra: {
                    url: input,
                    status: response?.status,
                },
            })));
            throw e;
        }
    }
}

export async function fetchJson2(title: string, input: RequestInfo, init?: RequestInit) {
    if (init) {
        console.log('fetchJson2', input, init);
    } else {
        console.log('fetchJson2', input);
    }

    let response = null;
    let text = null;
    try {
        response = await fetch(input, init);
        text = await response.text();
        return JSON.parse(text);
    } catch (e) {
        store.dispatch(exec(setError({
            error: e,
            title: 'Network Request Failed: ' + title,
            extra: {
                url: input,
                status: response?.status,
            },
        })));
        console.log(input, 'failed', response?.status);
        console.log(text);
        throw e;
    }
}

// export function fetchJson(...args) {
//
//     let response = null;
//     try {
//         response = fetch(...args);
//     } catch (err) {
//         if (!err.stack.match(/\d/)) throw TypeError(err.message);
//         throw err;
//     }
//
//     if (!response.ok) {
//         throw Error(response.statusText);
//     }
//
//     try {
//         return response.json();
//     } catch (err) {
//         if (!err.stack.match(/\d/)) throw TypeError(err.message);
//         throw err;
//     }
// }
