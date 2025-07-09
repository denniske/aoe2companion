import store from '../redux/store';
import { exec, setError } from '../redux/reducer';
import { sleep } from './helper/util';

class FetchNotOkError extends Error {
    constructor(
        message: string,
        public status: number
    ) {
        super(message);
        this.name = 'FetchNotOkError';
    }
}

async function fetchAndParseJson(input: RequestInfo, init?: RequestInit, reviver?: any): Promise<any> {
    const response = await fetch(input, init);

    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    let body: any = null;
    if (isJson) {
        const text = await response.text();
        body = JSON.parse(text, reviver);
    }

    if (!response.ok) {
        throw new FetchNotOkError((body as any).error, response.status);
    }

    return body;
}

// Here we implement a retry mechanism for network requests.
// So we set QueryClientProvider retry to 0 for react query in _layout.tsx.
export async function fetchJson(title: string, input: RequestInfo, init?: RequestInit, reviver?: any) {
    try {
        return await fetchAndParseJson(input, init, reviver);
    } catch (e) {
        // Don't retry on 400 errors
        if (e instanceof FetchNotOkError && e.status === 400) {
            throwAndShowError(e as Error, title, input);
        }
        try {
            await sleep(Math.random() * 100);
            return await fetchAndParseJson(input, init, reviver);
        } catch (e) {
            throwAndShowError(e as Error, title, input);
        }
    }
}

function throwAndShowError(e: Error, title: string, input: RequestInfo) {

    // console.log('throwAndShowError', e)

    const titlePrefix = (e instanceof FetchNotOkError && e.status === 500) ? 'Server Error' : 'Network Request Failed';

    store.dispatch(
        exec(
            setError({
                error: e as Error,
                title: titlePrefix + ': ' + title,
                extra: {
                    url: input,
                    status: e instanceof FetchNotOkError ? e.status : 200, // maybe not 200
                },
            })
        )
    );
    throw e;
}

// export async function fetchJson(title: string, input: RequestInfo, init?: RequestInit) {
//     if (init) {
//         // console.log(input);
//         // console.log(input, init);
//     } else {
//         // console.log(input);
//     }
//
//     const timeLastDate = new Date();
//
//     let response = null;
//     try {
//         response = await fetch(input, init);
//         if (!response.ok) {
//             throw Error(response.statusText);
//         }
//         const json = await response.json();
//         // console.log(input, new Date().getTime() - timeLastDate.getTime());
//         return json;
//     } catch (e) {
//         // console.log(input, 'failed', response?.status);
//         if (response?.status !== 400)
//         {
//             await sleep(Math.random() * 100);
//             return await fetchJson2(title, input, init);
//         } else {
//             throwAndShowError(e as Error, title, input, response);
//         }
//     }
// }

// function catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
//     return promise
//         .then((data) => {
//             return [undefined, data] as [undefined, T];
//         })
//         .catch((error) => {
//             return [error];
//         });
// }

// async function fetchAndParseJson(
//     input: RequestInfo,
//     init?: RequestInit,
//     reviver?: any
// ): Promise<[Error | undefined, any]> {
//     let response = null;
//     try {
//         response = await fetch(input, init);
//         if (!response.ok) {
//             throw Error(response.statusText);
//         }
//         const text = await response.text();
//         return JSON.parse(text, reviver);
//     } catch (e) {
//         (e as any).status = response?.status;
//         throw e;
//     }
// }

// export async function fetchJson(title: string, input: RequestInfo, init?: RequestInit, reviver?: any) {
//     let response = null;
//     let text = null;
//     const [error, data] = await catchError(fetchAndParseJson(input, init, reviver));
//     response = await fetch(input, init);
//     if (!response.ok) {
//         throw Error(response.statusText);
//     }
//     text = await response.text();
//     return JSON.parse(text, reviver);
//     throwAndShowError(e as Error, title, input, response);
// }

// export async function fetchJson(title: string, input: RequestInfo, init?: RequestInit, reviver?: any) {
//     let response = null;
//     let text = null;
//     try {
//         response = await fetch(input, init);
//         if (!response.ok) {
//             throw Error(response.statusText);
//         }
//         text = await response.text();
//         return JSON.parse(text, reviver);
//     } catch (e) {
//         throwAndShowError(e as Error, title, input, response);
//     }
// }
