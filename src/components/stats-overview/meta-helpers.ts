import { MetaRatingGroup, MIN_CELL_GAMES } from '@app/api/meta';

/** Games a civ or pairing needs before it can headline a card ("strongest", "most one-sided"). */
export const MIN_RANKED_GAMES = 200;

export function indexBy<T, K>(items: T[], key: (item: T) => K) {
    return new Map(items.map((item) => [key(item), item]));
}

/**
 * A heatmap's value function over a list of cells: the win rate for (row, column), or null for a
 * mirror, a pairing with no games, or one with fewer than MIN_CELL_GAMES.
 */
export function cellLookup<T extends { games: number; winRate: number }>(cells: T[], row: (cell: T) => string, column: (cell: T) => string) {
    const byKey = new Map(cells.map((cell) => [`${row(cell)}|${column(cell)}`, cell]));
    return (r: string, c: string) => {
        const cell = byKey.get(`${r}|${c}`);
        return cell && cell.games >= MIN_CELL_GAMES ? cell.winRate : null;
    };
}

const GROUP_NAMES: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
    master: 'Master',
};

export function ratingGroupLabel(group: Pick<MetaRatingGroup, 'key' | 'min' | 'max'>) {
    return {
        name: GROUP_NAMES[group.key] ?? group.key,
        range: group.max == null ? `${group.min}+` : `${group.min}–${group.max}`,
    };
}
