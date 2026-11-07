// POC only: hand-written numbers in the shape a future /api/winrates endpoint could
// return. Nothing here is real; replace with queries once the backend exists.

export interface MockCivStat {
    civ: string;
    games: number;
    winRate: number;
    playRate: number;
}

// Players in a match, hourly for the last 48 hours, oldest first. A daily curve
// peaking in the European evening, with a little noise so the two days differ.
export const mockCurrentlyPlayingHourly = Array.from({ length: 48 }, (_, i) => {
    const hourOfDay = i % 24;
    const curve = Math.sin(((hourOfDay - 13) / 24) * Math.PI * 2);
    const noise = ((i * 7919) % 13) * 120;
    return Math.round(17000 + curve * 7000 + noise);
});

export const mockTotals = {
    currentlyPlaying: mockCurrentlyPlayingHourly[mockCurrentlyPlayingHourly.length - 1],
    dailyMatches: 49601,
    // Last 7 days, oldest first; the last entry is today so far.
    dailyMatchesWeek: [
        { day: 'Sat', matches: 53100 },
        { day: 'Sun', matches: 55800 },
        { day: 'Mon', matches: 44100 },
        { day: 'Tue', matches: 43300 },
        { day: 'Wed', matches: 42900 },
        { day: 'Thu', matches: 45800 },
        { day: 'Fri', matches: 49601 },
    ],
};

export const mockCivs: MockCivStat[] = [
    { civ: 'Mongols', games: 26428, winRate: 0.512, playRate: 0.061 },
    { civ: 'Franks', games: 21964, winRate: 0.493, playRate: 0.051 },
    { civ: 'Persians', games: 16519, winRate: 0.518, playRate: 0.038 },
    { civ: 'Magyars', games: 15056, winRate: 0.501, playRate: 0.035 },
    { civ: 'Khmer', games: 14954, winRate: 0.507, playRate: 0.034 },
    { civ: 'Romans', games: 9120, winRate: 0.551, playRate: 0.021 },
    { civ: 'Armenians', games: 8410, winRate: 0.546, playRate: 0.019 },
    { civ: 'Bulgarians', games: 7980, winRate: 0.54, playRate: 0.018 },
    { civ: 'Malians', games: 7410, winRate: 0.539, playRate: 0.017 },
    { civ: 'Vikings', games: 6930, winRate: 0.528, playRate: 0.016 },
];

// Row civ's win rate against column civ. null on the diagonal (mirror).
export const mockMatchupCivs = ['Mongols', 'Franks', 'Persians', 'Magyars', 'Khmer', 'Romans'];
export const mockMatchups: (number | null)[][] = [
    [null, 0.61, 0.38, 0.46, 0.5, 0.47],
    [0.39, null, 0.5, 0.46, 0.52, 0.44],
    [0.62, 0.5, null, 0.63, 0.61, 0.55],
    [0.54, 0.54, 0.37, null, 0.52, 0.48],
    [0.5, 0.48, 0.39, 0.48, null, 0.43],
    [0.53, 0.56, 0.45, 0.52, 0.57, null],
];

export const mockMaps = [
    { map: 'Arabia', playRate: 0.394, bestCiv: 'Persians', bestWinRate: 0.52 },
    { map: 'Arena', playRate: 0.155, bestCiv: 'Khmer', bestWinRate: 0.54 },
    { map: 'Arabian Desert', playRate: 0.12, bestCiv: 'Mongols', bestWinRate: 0.53 },
    { map: 'Nomad', playRate: 0.053, bestCiv: 'Persians', bestWinRate: 0.57 },
    { map: 'Glade', playRate: 0.048, bestCiv: 'Bohemians', bestWinRate: 0.53 },
];

export const mockRatingGroups = [
    { label: '<1000', bestCiv: 'Armenians', winRate: 0.554, games: 179257 },
    { label: '1000–1400', bestCiv: 'Romans', winRate: 0.551, games: 169770 },
    { label: '1400–1800', bestCiv: 'Romans', winRate: 0.545, games: 65264 },
    { label: '1800–2200', bestCiv: 'Huns', winRate: 0.556, games: 18483 },
    { label: '2200+', bestCiv: 'Turks', winRate: 0.693, games: 6083 },
];

export const mockCountries = [
    { country: 'US', players: 4501 },
    { country: 'AR', players: 4281 },
    { country: 'DE', players: 2710 },
    { country: 'CN', players: 1895 },
    { country: 'MX', players: 1759 },
    { country: 'BR', players: 1642 },
    { country: 'ES', players: 1388 },
    { country: 'FR', players: 1201 },
];
