import store from '../redux/store';
import { exec, setError } from '../redux/reducer';
import { sleep } from './helper/util';
import { getHost, getSupabaseClient } from '@nex/data';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export class FetchNotOkError extends Error {
    constructor(
        message: string,
        public status: number,
        public code: string,
        public url?: string,
        public retryAfterMs?: number,
    ) {
        super(message);
        this.name = 'FetchNotOkError';
    }
}

// Cloudflare serves its 429 from the edge without CORS headers, so on web the browser rejects the
// fetch with an opaque TypeError instead of a readable response. We cannot tell such a failure apart
// from a real network error, so it gets its own error type and is backed off as if it were a 429.
export class FetchNetworkError extends Error {
    constructor(
        message: string,
        public url?: string,
        public cause?: unknown,
    ) {
        super(message);
        this.name = 'FetchNetworkError';
    }
}

// Paths covered by the Cloudflare rate limit rule (10 requests / 10s, shared budget).
const RATE_LIMITED_PATHS = [/\/api\/profiles\//, /\/api\/matches/];

// A retry landing inside the still-open window is counted by Cloudflare and only extends the block,
// so wait out the full window whenever the response did not tell us how long to wait.
export const RATE_LIMIT_WINDOW_MS = 11_000;

function getUrl(input: RequestInfo): string {
    return typeof input === 'string' ? input : ((input as Request)?.url ?? '');
}

function isRateLimitedUrl(url: string | undefined): boolean {
    if (!url) return false;
    return RATE_LIMITED_PATHS.some((pattern) => pattern.test(url));
}

// `Retry-After` is either a delay in seconds or an HTTP date. Cloudflare sends seconds.
function parseRetryAfter(value: string | null): number | undefined {
    if (!value) return undefined;
    const seconds = Number(value);
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
    const date = Date.parse(value);
    if (Number.isNaN(date)) return undefined;
    return Math.max(0, date - Date.now());
}

export function isRateLimitError(error: unknown): boolean {
    if (error instanceof FetchNotOkError) return error.status === 429;
    // On web a rate limited request is indistinguishable from a network failure, so treat any opaque
    // failure against a rate limited path as one.
    if (error instanceof FetchNetworkError) return isRateLimitedUrl(error.url);
    return false;
}

export function getRateLimitRetryDelay(error: unknown): number {
    const retryAfterMs = error instanceof FetchNotOkError ? error.retryAfterMs : undefined;
    // Add jitter so several queries failing together do not all retry in the same instant.
    return (retryAfterMs ?? RATE_LIMIT_WINDOW_MS) + Math.random() * 1000;
}

// Only the api host authenticates requests. The data host reads query params only, the tournament
// host is a Liquipedia proxy that strips `authorization` before forwarding, and fetchRecording talks
// to an S3 bucket -- sending the Supabase token to any of them hands it to a party that has no use
// for it, and an Authorization header also makes the response uncacheable at the Cloudflare edge.
function needsAuth(url: string): boolean {
    return url.startsWith(getHost('aoe2companion-api'));
}

function isDataHost(url: string): boolean {
    return url.startsWith(getHost('aoe2companion-data'));
}

// Requests carrying this parameter are excluded from the Cloudflare cache rules, so they always
// reach the origin. Valueless on purpose: it is a marker for the rule expression, not data.
export const REFETCH_PARAM = '_refetch_';

let cacheBustDepth = 0;

/**
 * Marks everything fetched inside `fn` as a deliberate refresh, so it bypasses the edge cache.
 *
 * Pull-to-refresh otherwise cannot see past Cloudflare: `refetch()` does go to the network, but the
 * network is entitled to answer from the edge copy, so the user can ask for fresh data and be handed
 * the same response they were already looking at.
 *
 * Note this is scoped by time rather than by query, so a background fetch that happens to overlap a
 * refresh is also bypassed. That is the desirable direction to err in -- a refresh gesture asking
 * for slightly more fresh data than strictly necessary.
 */
export async function withCacheBust<T>(fn: () => Promise<T>): Promise<T> {
    cacheBustDepth++;
    try {
        return await fn();
    } finally {
        cacheBustDepth--;
    }
}

function applyCacheBust(input: RequestInfo): RequestInfo {
    if (cacheBustDepth === 0 || typeof input !== 'string') return input;
    if (!isDataHost(input)) return input;
    if (input.includes(REFETCH_PARAM)) return input;
    return input + (input.includes('?') ? '&' : '?') + REFETCH_PARAM;
}

export async function fetchJson(input: RequestInfo, init?: RequestInit, reviver?: any, signal?: AbortSignal) {

    input = applyCacheBust(input);

    const headers: Record<string, string> = {
        'User-Agent': `AoEIICompanion/${getAppVersion()} (${getAppPlatform()})`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    if (needsAuth(getUrl(input))) {
        const { data: session } = await getSupabaseClient().auth.getSession();
        const accessToken = session?.session?.access_token;
        // Logged out this used to send the literal string `bearer undefined`.
        if (accessToken) {
            headers['Authorization'] = `bearer ${accessToken}`;
        }
    }

    let response: Response;
    try {
        response = await fetch(
            input,
            {
                ...init,
                headers: {
                    ...headers,
                    ...init?.headers,
                },
                signal,
            }
        );
    } catch (e) {
        // Let aborts propagate untouched, react-query relies on them.
        if ((e as Error)?.name === 'AbortError') throw e;
        throw new FetchNetworkError((e as Error)?.message ?? 'Network request failed', getUrl(input), e);
    }

    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    let body: any = null;
    if (isJson) {
        const text = await response.text();
        body = JSON.parse(text, reviver);
    }

    if (!response.ok) {
        // console.log('Fetch not ok', response.status, response.statusText, body);
        // Error responses are not necessarily JSON: Cloudflare's 429 is text/plain, which used to
        // leave body null and make reading `body.error` throw a bare TypeError, losing the status.
        throw new FetchNotOkError(
            // `message` is what the Nest throttler and other built-in exceptions return.
            body?.error ?? body?.message ?? response.statusText ?? `HTTP ${response.status}`,
            response.status,
            body?.code,
            getUrl(input),
            parseRetryAfter(response.headers.get('retry-after')),
        );
    }

    return body;
}

export function getAppVersion(): string {
    return Constants.expoConfig?.version || Constants.expoConfig?.extra?.expoClient?.version;
}

export function getAppPlatform(): string {
    return Platform.select({
        ios: 'iOS',
        android: 'Android',
        web: 'Web',
        default: 'Unknown',
    });
}

// async function fetchAndParseJson(input: RequestInfo, init?: RequestInit, reviver?: any): Promise<any> {
//     const response = await fetch(input, init);
//
//     const contentType = response.headers.get('content-type') ?? '';
//     const isJson = contentType.includes('application/json');
//
//     let body: any = null;
//     if (isJson) {
//         const text = await response.text();
//         body = JSON.parse(text, reviver);
//     }
//
//     if (!response.ok) {
//         console.log('Fetch not ok', response.status, response.statusText, body);
//         throw new FetchNotOkError((body as any).error, 500, (body as any).code);
//     }
//
//     return body;
// }

// Here we implement a retry mechanism for network requests.
// So we set QueryClientProvider retry to 0 for react query in _layout.tsx.
// export async function fetchJson(title: string, input: RequestInfo, init?: RequestInit, reviver?: any) {
//     const response = await fetch(input, init);
//
//     const contentType = response.headers.get('content-type') ?? '';
//     const isJson = contentType.includes('application/json');
//
//     let body: any = null;
//     if (isJson) {
//         const text = await response.text();
//         body = JSON.parse(text, reviver);
//     }
//
//     if (!response.ok) {
//         // console.log('Fetch not ok', response.status, response.statusText, body);
//         throw new FetchNotOkError((body as any).error, response.status, (body as any).code);
//     }
//
//     return body;
//
//     // try {
//     //     return await fetchAndParseJson(input, init, reviver);
//     // } catch (e) {
//     //     // Don't retry on 400 errors
//     //     if (e instanceof FetchNotOkError && e.status === 400) {
//     //         throwAndShowError(e as Error, title, input);
//     //     }
//     //     // try {
//     //     //     await sleep(Math.random() * 100);
//     //     //     return await fetchAndParseJson(input, init, reviver);
//     //     // } catch (e) {
//     //     //     throwAndShowError(e as Error, title, input);
//     //     // }
//     // }
// }

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
