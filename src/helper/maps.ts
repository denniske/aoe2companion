// Widths whitelisted by the CDN transform rules. Any other query is served as
// the untouched original, so only these values are worth asking for -- and the
// whitelist is what keeps the transformation count (and bill) bounded.
const CDN_HOST = 'backend.cdn.aoe2companion.com';

const PRESET_QUERY = {
    // Every thumbnail use is <= 80 CSS px, so 200 covers 3x phones and 2x desktops.
    thumb: 'width=200',
    // The map detail view is 250pt, which needs ~750px -- larger than the 720px
    // source. Nothing to resize there, just serve avif/webp instead of png.
    full: 'format=auto',
} as const;

export type ImagePreset = keyof typeof PRESET_QUERY;

// The rules match one exact query on one host, so leave anything else alone:
// a foreign host has no rules, and an existing query would stop matching.
//
// 'full' is the default because it never trades away resolution -- a call site
// that forgets to pick still looks right, it just misses the size win.
export function cdnImageUrl(url: string | undefined, preset: ImagePreset = 'full') {
    if (!url || url.includes('?') || !url.includes(CDN_HOST)) return url;
    return `${url}?${PRESET_QUERY[preset]}`;
}

export function getMapImage(data: { map: any; mapImageUrl: string }, preset: ImagePreset = 'full') {
    return { uri: cdnImageUrl(data.mapImageUrl, preset) };
}
