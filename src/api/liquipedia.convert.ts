// Turns the Liquipedia v3 rows our tournament service returns into the shapes in liquipedia.types.ts.

import * as en from '../../assets/translations/en.json';
import { differenceInYears, isValid, parseISO } from 'date-fns';
import { compact, groupBy, orderBy, uniqBy } from 'lodash';
import { getHost } from '@nex/data';

import type {
    EventParticipant,
    EventPlayer,
    Group,
    GroupParticipant,
    Link,
    Map,
    Playoff,
    PlayoffMatch,
    Player,
    Prize,
    Round,
    Tab,
    Tournament,
    TournamentDetail,
} from './liquipedia.types';
import { TournamentCategory, TournamentLocationType, TournamentType } from './liquipedia.types';
import type {
    ConvertedLiquipediaMatch,
    ILiquipediaPlacement,
    ILiquipediaPlayer,
    ILiquipediaStandingsEntry,
    ILiquipediaStandingsTable,
    ILiquipediaTournament,
    ILiquipediaTournamentResponse,
    INewLiquipediaMatch,
} from './tournament.types';

/**
 * A Liquipedia image URL, by way of our tournament service. Liquipedia refuses images to browsers on other sites
 * (web shows a placeholder), and the service's copy is cached by Cloudflare.
 */
export function liquipediaImage(url?: string): string | undefined {
    if (!url) return undefined;
    const prefix = 'https://liquipedia.net/';
    if (!url.startsWith(prefix)) return url;
    return `${getHost('aoe2companion-tournament')}api/tournaments/image/${url.slice(prefix.length)}`;
}

// Liquipedia's own icon for a tournament without one, as the liquipedia package used to fall back to.
const DEFAULT_TOURNAMENT_ICON =
    'https://liquipedia.net/commons/images/thumb/3/35/Age_of_Empires_default_allmode.png/100px-Age_of_Empires_default_allmode.png';

/** v3 writes a missing date as year 0, and a date without time as midnight. */
function parseDate(value?: string): Date | undefined {
    if (!value || value.startsWith('0000') || value.startsWith('1970-01-01')) return undefined;
    const date = parseISO(value.length > 10 ? value.replace(' ', 'T') + 'Z' : value);
    return isValid(date) ? date : undefined;
}

// Liquipedia names countries in English ("Germany"). Most match our country translations; these do not.
const FLAG_OVERRIDES: Record<string, string> = {
    'Bolivia': 'BO',
    'England': 'GB',
    'Iran': 'IR',
    'Macau': 'MO',
    'Moldova': 'MD',
    'Palestine': 'PS',
    'Russia': 'RU',
    'Scotland': 'GB',
    'Serbia and Montenegro': 'RS',
    'South Korea': 'KR',
    'Syria': 'SY',
    'United Kingdom': 'GB',
    'United States': 'US',
    'Venezuela': 'VE',
    'Vietnam': 'VN',
    'Wales': 'GB',
};

let countryCodes: Record<string, string> | undefined;

/** The upper-case country code of a Liquipedia flag name, or undefined for "World", "Europe" and the like. */
export function flagCode(flag?: string): string | undefined {
    if (!flag) return undefined;
    if (!countryCodes) {
        countryCodes = { ...FLAG_OVERRIDES };
        for (const [key, name] of Object.entries(en as Record<string, string>)) {
            const match = key.match(/^country\.([a-z]{2})$/);
            if (match && !countryCodes[name]) countryCodes[name] = match[1].toUpperCase();
        }
    }
    return countryCodes[flag] ?? (/^[a-z]{2}$/i.test(flag) ? flag.toUpperCase() : undefined);
}

export function tournamentCategory(row: Pick<ILiquipediaTournament, 'liquipediatier' | 'liquipediatiertype'>): TournamentCategory {
    switch (row.liquipediatiertype) {
        case 'Weekly':
            return TournamentCategory.Weekly;
        case 'Monthly':
            return TournamentCategory.Monthly;
        case 'Showmatch':
            return TournamentCategory.ShowMatches;
        case 'Qualifier':
            return TournamentCategory.Qualifiers;
        case 'FFA':
            return TournamentCategory.FFA;
    }
    if (row.liquipediatiertype) return TournamentCategory.Miscellaneous;
    return (
        { '1': TournamentCategory.TierS, '2': TournamentCategory.TierA, '3': TournamentCategory.TierB, '4': TournamentCategory.TierC }[
            row.liquipediatier
        ] ?? TournamentCategory.Miscellaneous
    );
}

function jsonField<T>(value: T | string | undefined): T | undefined {
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch {
        return undefined;
    }
}

export function convertTournament(row: ILiquipediaTournament): Tournament {
    const countryCode = row.locations?.country1?.toUpperCase();
    const locationName = compact([row.locations?.city1, row.locations?.region1]).join(', ');
    return {
        game: row.game,
        type: row.mode === '1v1' ? TournamentType.Individual : row.mode ? TournamentType.Team : TournamentType.Unknown,
        tier: tournamentCategory(row),
        // An event across games names the game as a part: "Royal Blood: Age of Empires II: Qualifier".
        name: row.name.split(': ').filter((part) => part !== row.game).join(': '),
        path: row.pagename,
        start: parseDate(row.startdate),
        end: parseDate(row.enddate),
        participantsCount: row.participantsnumber > 0 ? row.participantsnumber : 0,
        prizePool: row.prizepool > 0 ? { amount: row.prizepool, code: 'USD' } : undefined,
        location:
            row.type === 'Online'
                ? { name: 'Online', type: TournamentLocationType.Online }
                : locationName || countryCode
                  ? {
                        name: locationName || countryCode!,
                        country: countryCode ? { name: countryCode, code: countryCode } : undefined,
                        type: TournamentLocationType.LAN,
                    }
                  : undefined,
        league: {
            name: row.seriespage?.replace(/_/g, ' ') ?? '',
            image: liquipediaImage(row.iconurl || row.icondarkurl || DEFAULT_TOURNAMENT_ICON),
            path: row.seriespage || undefined,
        },
    };
}

function winnerIndex(winner?: string): 0 | 1 | undefined {
    return winner === '1' ? 0 : winner === '2' ? 1 : undefined;
}

function matchLinks(match: INewLiquipediaMatch): Link[] {
    const links: Link[] = [];
    // stream is an empty array, not an object, when the match has none.
    const stream: Record<string, string> = Array.isArray(match.stream) ? {} : (match.stream ?? {});
    const matchLinks: Record<string, string> = Array.isArray(match.links) ? {} : (match.links ?? {});
    if (stream.twitch) links.push({ text: 'Twitch', url: `https://www.twitch.tv/${stream.twitch}` });
    if (stream.youtube) links.push({ text: 'YouTube', url: `https://www.youtube.com/${stream.youtube}` });
    if (match.vod) links.push({ text: 'Watch VOD', url: match.vod });
    if (matchLinks.mapdraft) links.push({ text: 'Map Draft', url: matchLinks.mapdraft });
    if (matchLinks.civdraft) links.push({ text: 'Civ Draft', url: matchLinks.civdraft });
    return links;
}

function opponentScore(opponent: INewLiquipediaMatch['match2opponents'][number]): number | string | undefined {
    if (opponent.score >= 0) return opponent.score;
    // W, FF (forfeit), DQ, L: a walkover has no score, only a status.
    return opponent.status && opponent.status !== 'S' ? opponent.status : undefined;
}

function opponentName(opponent: INewLiquipediaMatch['match2opponents'][number]): string {
    const solo = opponent.type === 'solo' ? opponent.match2players?.[0] : undefined;
    return solo?.displayname || opponent.name || '';
}

function convertGames(match: INewLiquipediaMatch) {
    return (match.match2games ?? []).map((game) => ({
        map: game.map,
        winner: winnerIndex(game.winner),
        players: (game.opponents ?? []).map((opponent) =>
            (opponent.players ?? []).map(
                (player): EventPlayer & { civ?: string } => ({
                    name: player.displayName || player.pageName,
                    civ: player.civ && player.civ !== 'unknown' ? player.civ : undefined,
                    country: flagCode(player.flag) ? { name: player.flag, code: flagCode(player.flag)! } : undefined,
                })
            )
        ) as [EventPlayer[], EventPlayer[]],
    }));
}

function convertPlayoffMatch(match: INewLiquipediaMatch): PlayoffMatch {
    return {
        bestOf: match.bestof > 0 ? String(match.bestof) : undefined,
        participants: match.match2opponents.map((opponent) => ({
            name: opponentName(opponent),
            score: opponentScore(opponent),
            country: opponent.type === 'solo' ? flagCode(opponent.match2players?.[0]?.flag) : undefined,
        })) as PlayoffMatch['participants'],
        winner: winnerIndex(match.winner),
        startTime: parseDate(match.date),
        links: matchLinks(match),
        games: convertGames(match),
    };
}

/** The upcoming-matches list: matches across tournaments, each with its tournament. */
export function convertMatches(matches: INewLiquipediaMatch[] | undefined, tournaments?: Tournament[]): ConvertedLiquipediaMatch[] {
    const list = (matches ?? []).map((match) => {
        const tournament = tournaments?.find((tournament) => tournament.path === match.parent);
        const converted = convertPlayoffMatch(match);
        return {
            ...converted,
            format: match.mode,
            finished: match.finished === 1,
            participants: converted.participants as [EventParticipant, EventParticipant],
            tournament: {
                ...tournament,
                name: tournament?.name ?? match.tournament,
                path: tournament?.path ?? match.parent,
                image: tournament?.league?.image ?? liquipediaImage(match.iconurl || DEFAULT_TOURNAMENT_ICON),
            },
        } as ConvertedLiquipediaMatch;
    });
    return orderBy(list, (m) => m.startTime);
}

/** "WB Round of 8 (Bo5)" → name "WB Round of 8", format "Bo5". */
function splitHeader(header?: string): { name: string; format?: string } {
    const match = header?.match(/^(.*?)\s*\(([^()]*)\)\s*$/);
    return match ? { name: match[1], format: match[2] } : { name: header ?? '' };
}

function roundsByHeader(matches: INewLiquipediaMatch[]): Round[] {
    const rounds: Round[] = [];
    for (const match of orderBy(matches, [(m) => m.match2bracketdata?.matchIndex ?? 0, 'date', 'match2id'])) {
        const header = splitHeader(match.match2bracketdata?.header || match.match2bracketdata?.inheritedheader);
        let round = rounds.find((r) => r.id === header.name);
        if (!round) {
            round = { id: header.name, name: header.name, format: header.format, matches: [] };
            rounds.push(round);
        }
        round.matches.push(convertPlayoffMatch(match));
    }
    return rounds;
}

/** A bracket's rounds, in the order Liquipedia draws them: upper bracket first, then lower, left to right. */
function bracketRounds(matches: INewLiquipediaMatch[]): Round[] {
    const byRound = groupBy(matches, (m) => {
        const c = m.match2bracketdata?.coordinates;
        return c ? `${c.sectionIndex}-${c.roundIndex}` : splitHeader(m.match2bracketdata?.inheritedheader).name;
    });
    const rounds = Object.entries(byRound).map(([id, roundMatches]) => {
        const sorted = orderBy(roundMatches, [(m) => m.match2bracketdata?.coordinates?.matchIndexInRound ?? 0, 'match2id']);
        const header = splitHeader(sorted.find((m) => m.match2bracketdata?.inheritedheader)?.match2bracketdata.inheritedheader);
        const c = sorted[0].match2bracketdata?.coordinates;
        return {
            sort: [c?.sectionIndex ?? 0, c?.roundIndex ?? 0],
            round: { id, name: header.name, format: header.format, matches: sorted.map(convertPlayoffMatch) },
        };
    });
    return orderBy(rounds, [(r) => r.sort[0], (r) => r.sort[1]]).map((r) => r.round);
}

const GROUP_STATUSES = ['up', 'stayup', 'stay', 'down'];

function convertGroups(tables: ILiquipediaStandingsTable[], entries: ILiquipediaStandingsEntry[], matches: Record<string, INewLiquipediaMatch>): Group[] {
    return orderBy(tables, 'standingsindex').map((table) => {
        const tableEntries = entries.filter((entry) => entry.standingsindex === table.standingsindex && entry.pagename === table.pagename);
        const lastRound = Math.max(0, ...tableEntries.map((entry) => entry.roundindex));
        const participants = orderBy(
            tableEntries.filter((entry) => entry.roundindex === lastRound),
            'placement'
        ).map((entry): GroupParticipant => {
            const status = entry.definitestatus || entry.currentstatus;
            const score = entry.scoreboard;
            return {
                name: entry.opponentplayers?.p1dn && entry.opponenttype === 'solo' ? entry.opponentplayers.p1dn : entry.opponentname,
                country: entry.opponenttype === 'solo' ? flagCode(entry.opponentplayers?.p1flag) : undefined,
                position: entry.placement,
                matchScore: score?.match && { win: score.match.w, loss: score.match.l, draw: score.match.d },
                gameScore: score?.game && { win: score.game.w, loss: score.game.l, draw: score.game.d },
                points: score?.points != null ? String(score.points) : undefined,
                status: GROUP_STATUSES.includes(status) ? (status as GroupParticipant['status']) : undefined,
            };
        });
        return {
            name: table.title || table.section,
            participants,
            rounds: roundsByHeader(compact((table.matches ?? []).map((id) => matches[id]))),
        };
    });
}

/** "3-4" → "3rd-4th" */
function ordinalPlace(place: string): string {
    const ordinal = (n: string) => {
        const number = parseInt(n);
        if (isNaN(number)) return n;
        const suffix = number % 100 >= 11 && number % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[number % 10] ?? 'th';
        return `${number}${suffix}`;
    };
    return place.split('-').map(ordinal).join('-');
}

function placementParticipant(placement: ILiquipediaPlacement): EventParticipant {
    return {
        name: placement.opponentname,
        country: placement.opponenttype === 'solo' ? flagCode(placement.opponentplayers?.p1flag) : undefined,
    };
}

const isAward = (placement: ILiquipediaPlacement) => placement.mode?.startsWith('award');
const isTbd = (name?: string) => !name || name.toUpperCase() === 'TBD';

function convertPrizes(placements: ILiquipediaPlacement[]): Prize[] {
    const ranked = orderBy(
        placements.filter((placement) => !isAward(placement) && placement.placement),
        [(placement) => parseInt(placement.placement), 'objectname']
    );
    return Object.values(groupBy(ranked, (placement) => placement.placement)).map((places) => {
        const money = places[0].individualprizemoney || places[0].prizemoney;
        return {
            place: ordinalPlace(places[0].placement),
            prize: money > 0 ? { amount: money, code: 'USD' } : undefined,
            participants: places.map(placementParticipant),
        };
    });
}

/** Tab labels are the part of each page name below the main page: `Royal_Blood/AoE2/Qualifier` → "Qualifier". */
function convertTabs(pagename: string, subpages: { pagename: string; name: string }[]): Tab[] {
    if (subpages.length < 2) return [];
    const depth = (page: string) => page.split('/').length;
    const rootDepth = Math.min(...subpages.map((page) => depth(page.pagename)));
    const isRoot = (page: string) => depth(page) === rootDepth && subpages.some((other) => depth(other.pagename) > rootDepth);
    return subpages.map((page) => ({
        name: isRoot(page.pagename) ? '' : page.pagename.split('/').slice(depth(page.pagename) - 1).join(' ').replace(/_/g, ' '),
        path: page.pagename,
        active: page.pagename === pagename,
    }));
}

export function convertTournamentDetail(response: ILiquipediaTournamentResponse): TournamentDetail {
    const { tournament: row, matches, placements, standingstables, standingsentries } = response;

    const byId: Record<string, INewLiquipediaMatch> = {};
    for (const match of matches) byId[match.match2id] = match;

    const inGroup = new Set(standingstables.flatMap((table) => table.matches ?? []));
    const playoffs: Playoff[] = [];
    const results: INewLiquipediaMatch[] = [];
    for (const bracket of Object.values(groupBy(matches, 'match2bracketid'))) {
        const ungrouped = bracket.filter((match) => !inGroup.has(match.match2id));
        if (ungrouped.length === 0) continue;
        if (ungrouped[0].match2bracketdata?.type === 'bracket') {
            playoffs.push({ name: ungrouped[0].match2bracketdata.sectionheader || ungrouped[0].match2bracketdata.title, rounds: bracketRounds(ungrouped) });
        } else {
            results.push(...ungrouped);
        }
    }

    const prizes = convertPrizes(placements);
    const fromPlacements = prizes.flatMap((prize) => prize.participants);
    const fromMatches = matches.flatMap((match) =>
        match.match2opponents.map((opponent) => ({
            name: opponentName(opponent),
            country: opponent.type === 'solo' ? flagCode(opponent.match2players?.[0]?.flag) : undefined,
        }))
    );
    const participants = uniqBy(
        (fromPlacements.length ? fromPlacements : fromMatches).filter((participant) => !isTbd(participant.name)),
        (participant) => participant.name
    );

    // `link` is the map's page, `name` how the tournament calls it when that differs: aoe4's "Dry Arabia" is the page
    // "Arabia (AoE4)".
    const tournamentMaps = Object.values(jsonField<Record<string, { link?: string; name?: string; map?: string }>>(row.maps) ?? {}).filter(
        (map) => map.link || map.map
    );
    const organizers = Object.values(jsonField<Record<string, string>>(row.organizers) ?? {});

    return {
        ...convertTournament(row),
        format: row.format || undefined,
        maps: tournamentMaps.map((tournamentMap): Map => {
            const link = (tournamentMap.link || tournamentMap.map)!;
            const name = tournamentMap.name || link;
            const path = link.replace(/ /g, '_');
            const map = response.maps?.find((m) => m.pagename === path);
            return {
                name,
                path,
                image: liquipediaImage(map?.imageurl || map?.imagedarkurl),
                category: map?.extradata?.maptype || undefined,
                creator: compact([map?.extradata?.creator1dn, map?.extradata?.creator2dn, map?.extradata?.creator3dn]).join(', ') || undefined,
                spawns: map?.extradata?.spawns || undefined,
            };
        }),
        tabs: convertTabs(row.pagename, response.subpages ?? []),
        participants,
        playoffs,
        groups: convertGroups(standingstables, standingsentries, byId),
        results: orderBy(results, ['date', 'match2id']).map((match) => ({
            ...convertPlayoffMatch(match),
            header: match.match2bracketdata?.header ? splitHeader(match.match2bracketdata.header) : undefined,
        })),
        prizes,
        organizer: organizers.join(', ') || undefined,
        venue: row.locations?.venue1 || undefined,
    };
}

export function convertPlayer(player: ILiquipediaPlayer): Player {
    const birthdate = parseDate(player.birthdate);
    return {
        name: player.name,
        image: liquipediaImage(player.image),
        bio: player.bio,
        fullName: player.fullName,
        nationality: player.nationality,
        birthdate,
        age: birthdate ? differenceInYears(new Date(), birthdate) : undefined,
        status: player.status,
        yearsActive: player.yearsActive,
        team: player.team,
        totalWinnings: player.earnings ? { amount: player.earnings, code: 'USD' } : undefined,
    };
}
