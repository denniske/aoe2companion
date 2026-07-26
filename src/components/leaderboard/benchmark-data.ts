import { ILeaderboardPlayer } from '../../api/helper/api.types';

/**
 * Fake leaderboard pages for the row test pages under /statistics. No network, so
 * a run costs the same every time, and the delay is long enough to see a page
 * land instead of guessing.
 *
 * Not used by the app itself.
 */

/** Long enough to start a profiler recording after pressing the button. */
export const PAGE_DELAY_MS = 2000;

// A 1x1 transparent PNG. A real avatar URL would drag network latency into the
// window being measured; this still mounts and decodes an <Image> per row.
const AVATAR_URI =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const NAMES = ['Hera', 'TheViper', 'Liereyy', 'MbL', 'Yo', 'Villese', 'DauT', 'TheMax', 'Vinchester', 'ACCM', 'Nicov', 'JorDan_AoE', 'Tim', 'Modri'];

/** `index` is the absolute position in the leaderboard, so rank follows from it. */
export function makeFakePlayer(index: number): ILeaderboardPlayer {
    return {
        clan: index % 3 === 0 ? 'GL' : '',
        leaderboardId: 3,
        profileId: 100000 + index,
        name: `${NAMES[index % NAMES.length]}${index % 4 === 0 ? `_${index}` : ''}`,
        rank: index + 1,
        rankCountry: index + 1,
        rating: Math.max(400, 2600 - index),
        maxRating: Math.max(400, 2700 - index),
        lastMatchTime: new Date(),
        streak: 0,
        wins: 900 + index,
        losses: 700 + index,
        drops: 0,
        updatedAt: '',
        games: 1600 + (index % 500) * 3,
        country: 'de',
        avatarSmallUrl: AVATAR_URI,
    };
}

export interface FakeLeaderboardPage {
    page: number;
    perPage: number;
    total: number;
    players: ILeaderboardPlayer[];
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Stands in for fetchLeaderboard(): same shape of answer, fixed cost, no network. */
export async function fetchFakeLeaderboardPage({ page, pageSize, total }: { page: number; pageSize: number; total: number }): Promise<FakeLeaderboardPage> {
    await sleep(PAGE_DELAY_MS);
    const offset = (page - 1) * pageSize;
    const length = Math.max(0, Math.min(pageSize, total - offset));
    return {
        page,
        perPage: pageSize,
        total,
        players: Array.from({ length }, (_, i) => makeFakePlayer(offset + i)),
    };
}
