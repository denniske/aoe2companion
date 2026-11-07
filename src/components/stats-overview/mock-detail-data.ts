// POC only: generated mock data for the statistics detail pages. Deterministic (a
// seeded PRNG), so the numbers stay put across reloads. Replace with API queries.

function prng(seed: number) {
    let s = seed >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 2 ** 32;
    };
}

// Every current aoe2 civ. 'Indians' is left out: the dataset keeps it only for old matches.
export const allCivs = [
    'Armenians', 'Aztecs', 'Bengalis', 'Berbers', 'Bohemians', 'Britons', 'Bulgarians', 'Burgundians', 'Burmese', 'Byzantines',
    'Celts', 'Chinese', 'Cumans', 'Danes', 'Dravidians', 'Ethiopians', 'Franks', 'Georgians', 'Goths', 'Gurjaras', 'Huns', 'Incas',
    'Hindustanis', 'Italians', 'Japanese', 'Jurchens', 'Khitans', 'Khmer', 'Koreans', 'Lithuanians', 'Magyars', 'Malay', 'Malians',
    'Mapuche', 'Mayans', 'Muisca', 'Mongols', 'Persians', 'Poles', 'Portuguese', 'Romans', 'Saracens', 'Saxons', 'Shu', 'Sicilians',
    'Slavs', 'Spanish', 'Tatars', 'Teutons', 'Tupi', 'Turks', 'Varangians', 'Vietnamese', 'Vikings', 'Wei', 'Wu',
] as const;
export type MockCiv = (typeof allCivs)[number];

const rand = prng(42);
// A hidden strength per civ (roughly -0.04..0.04) and a popularity weight; every
// generated number below is derived from these two, so the pages agree with each other.
const strength = Object.fromEntries(allCivs.map((civ) => [civ, (rand() - 0.5) * 0.08])) as Record<MockCiv, number>;
const popularity = Object.fromEntries(allCivs.map((civ) => [civ, 0.3 + rand() ** 2 * 3])) as Record<MockCiv, number>;
const totalPopularity = Object.values(popularity).reduce((a, b) => a + b, 0);

const TOTAL_GAMES = 438000;

export interface MockCivSummary {
    civ: MockCiv;
    games: number;
    winRate: number;
    playRate: number;
}

export const civSummaries: MockCivSummary[] = allCivs
    .map((civ) => ({
        civ,
        // Each game has two civs, hence the factor two.
        games: Math.round(((TOTAL_GAMES * 2) * popularity[civ]) / totalPopularity),
        winRate: 0.5 + strength[civ],
        playRate: popularity[civ] / totalPopularity,
    }))
    .sort((a, b) => b.games - a.games);

// Win rate of `a` against `b`. Antisymmetric, so the grid reads the same from both sides.
const matchupNoise = new Map<string, number>();
export function matchupWinRate(a: MockCiv, b: MockCiv): number | null {
    if (a === b) return null;
    const [x, y] = a < b ? [a, b] : [b, a];
    const key = `${x}|${y}`;
    if (!matchupNoise.has(key)) matchupNoise.set(key, (rand() - 0.5) * 0.12);
    const wx = 0.5 + strength[x] - strength[y] + matchupNoise.get(key)!;
    const clamped = Math.max(0.3, Math.min(0.7, wx));
    return a === x ? clamped : 1 - clamped;
}

export const mapNames = [
    'Arabia', 'Arena', 'Arabian Desert', 'Nomad', 'Glade', 'Haboob', 'Socotra', 'Megarandom', 'Steppe', 'Enclosed',
    'Four Lakes', 'Acropolis', 'Black Forest', 'Golden Pit', 'Hill Fort',
] as const;
export type MockMap = (typeof mapNames)[number];

const mapShare = mapNames.map((_, i) => 1 / (i + 1.6) ** 1.4);
const mapShareTotal = mapShare.reduce((a, b) => a + b, 0);

export const mapSummaries = mapNames.map((map, i) => ({
    map,
    games: Math.round((TOTAL_GAMES * mapShare[i]) / mapShareTotal),
    playRate: mapShare[i] / mapShareTotal,
    avgDurationMinutes: Math.round(20 + rand() * 8),
}));

// A per-map bias, so open maps and closed maps favour different civs.
const mapBias = new Map<string, number>();
export function mapCivWinRate(map: MockMap, civ: MockCiv): number {
    const key = `${map}|${civ}`;
    if (!mapBias.has(key)) mapBias.set(key, (rand() - 0.5) * 0.1);
    return Math.max(0.35, Math.min(0.65, 0.5 + strength[civ] + mapBias.get(key)!));
}

export const ratingGroups = [
    { key: 'beginner', label: 'Beginner', range: '0–1000', players: 21137, games: 179257, avgDurationMinutes: 25, avgRating: 747 },
    { key: 'intermediate', label: 'Intermediate', range: '1000–1400', players: 17671, games: 169770, avgDurationMinutes: 22, avgRating: 1170 },
    { key: 'advanced', label: 'Advanced', range: '1400–1800', players: 4918, games: 65264, avgDurationMinutes: 21, avgRating: 1562 },
    { key: 'expert', label: 'Expert', range: '1800–2200', players: 1261, games: 18483, avgDurationMinutes: 21, avgRating: 1955 },
    { key: 'master', label: 'Master', range: '2200+', players: 331, games: 6083, avgDurationMinutes: 21, avgRating: 2447 },
] as const;

// Higher groups spread wider: fewer games, and strong players lean harder on a civ's strengths.
const ratingBias = new Map<string, number>();
export function ratingCivWinRate(groupIndex: number, civ: MockCiv): number {
    const key = `${groupIndex}|${civ}`;
    if (!ratingBias.has(key)) ratingBias.set(key, (rand() - 0.5) * (0.04 + groupIndex * 0.03));
    return Math.max(0.35, Math.min(0.72, 0.5 + strength[civ] * (1 + groupIndex * 0.3) + ratingBias.get(key)!));
}

export const countryStats = [
    'US', 'AR', 'DE', 'CN', 'MX', 'BR', 'ES', 'FR', 'IT', 'GB', 'PL', 'CO', 'CL', 'VN', 'RU', 'IN', 'CA', 'NL', 'PE', 'AU',
].map((country, i) => {
    const players = Math.round(4600 / (1 + i * 0.32));
    return {
        country,
        players,
        games: Math.round(players * (9 + rand() * 4)),
        avgRating: Math.round(1000 + rand() * 250),
        winRate: 0.49 + rand() * 0.02,
        avgDurationMinutes: Math.round(21 + rand() * 4),
    };
});
