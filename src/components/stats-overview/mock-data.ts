// POC only: hand-written activity numbers for the overview's two charts. The civ,
// map, rating and country numbers live in mock-detail-data.ts, shared with the
// detail pages so the overview and the pages it links to agree.

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
