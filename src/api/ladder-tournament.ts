import { useQuery } from '@tanstack/react-query';
import { fetchJson } from '@app/api/util';
import { getHost } from '@nex/data';
import { appConfig } from '@nex/dataset';

// The Ladder Tournament (laddertournament.com.br). Our tournament service mirrors the organizer's API every
// 15 minutes and serves its copy, so the app never calls their server (the organizer asked us to keep load low).
// The types below are what /api/ladder-tournament answers; see LadderTournamentService in poc_collector.

export const ladderTournamentEnabled = appConfig.game === 'aoe2';

export const LADDER_TOURNAMENT_URL = 'https://laddertournament.com.br';
export const LADDER_TOURNAMENT_DISCORD_URL = 'https://discord.com/invite/HQxUnjcrNd';

export type LadderBadge = 'ladderwinner' | 'thelegend' | 'liquipedia' | 'paganini' | 'discord';

export interface LadderPlayer {
    profileId: number;
    // null when the profile is unknown to us or hidden.
    name: string | null;
    country: string | null;
}

export interface LadderStanding extends LadderPlayer {
    // Equal scores share a position (1, 1, 3).
    position: number;
    matches: number;
    wins: number;
    losses: number;
    score: number;
    // Average points per match. Not a win rate.
    rating: number;
    badges: LadderBadge[];
    casts: number;
}

export interface LadderVideo {
    key: string;
    title: string;
    castedBy: string;
    publishedAt: string | null;
    stage: string;
    seasonId: number;
    url: string | null;
    youtubeUrl: string | null;
    twitchUrl: string | null;
    youtubeId: string | null;
    thumbnailUrl: string | null;
    players: LadderPlayer[];
}

export interface LadderSeasonInfo {
    id: number;
    name: string;
    displayName: string | null;
    status: string;
    finished: boolean;
    registrationStart: string | null;
    registrationEnd: string | null;
    ladderStart: string | null;
    ladderEnd: string | null;
    registrationFee: string;
    playoffCut: number | null;
    semifinalCut: number | null;
    bestOf: { ladder: number | null; funnel: number | null; semifinal: number | null; final: number | null };
    challenge: {
        maxPositions: number | null;
        responseHours: number | null;
        matchDeadlineDays: number | null;
        inactivityDays: number | null;
        rematchDays: number | null;
        rematchOtherMatches: number | null;
    };
    players: number;
    casts: number;
    championsRecord: { wins: number; losses: number } | null;
    topScore: number | null;
}

export interface LadderSeason extends LadderSeasonInfo {
    champions: LadderPlayer[];
    // Sorted by score; ties keep the organizer's order.
    standings: LadderStanding[];
}

export interface LadderTournamentData {
    updatedAt: string;
    featuredSeasonId: number | null;
    // Newest first.
    seasons: LadderSeason[];
    // Newest first.
    videos: LadderVideo[];
}

export interface LadderTournamentPlayerData {
    profileId: number;
    seasons: { season: LadderSeasonInfo; standing: LadderStanding }[];
    videos: LadderVideo[];
}

function ladderApi<T>(path: string): Promise<T> {
    return fetchJson(`${getHost('aoe2companion-tournament')}api/${path}`);
}

export const useLadderTournament = () =>
    useQuery<LadderTournamentData>({
        queryKey: ['ladder-tournament'],
        queryFn: () => ladderApi('ladder-tournament'),
        staleTime: 5 * 60 * 1000,
        enabled: ladderTournamentEnabled,
    });

export const useLadderTournamentPlayer = (profileId: number | undefined) =>
    useQuery<LadderTournamentPlayerData>({
        queryKey: ['ladder-tournament', 'player', profileId],
        queryFn: () => ladderApi(`ladder-tournament/player?profile_id=${profileId}`),
        staleTime: 5 * 60 * 1000,
        enabled: ladderTournamentEnabled && !!profileId,
    });

export type LadderPhase = 'upcoming' | 'registration' | 'ladder' | 'playoffs' | 'finished' | 'unknown';

/** Where the season stands, from its dates. The organizer's status only tells us whether it is finished. */
export function ladderSeasonPhase(season: LadderSeasonInfo, now = new Date()): LadderPhase {
    if (season.finished) return 'finished';
    const time = now.getTime();
    const at = (value: string | null) => (value ? new Date(value).getTime() : null);
    const registrationStart = at(season.registrationStart);
    const ladderStart = at(season.ladderStart);
    const ladderEnd = at(season.ladderEnd);
    if (ladderEnd != null && time > ladderEnd) return 'playoffs';
    if (ladderStart != null && time >= ladderStart) return 'ladder';
    if (registrationStart != null && time >= registrationStart) return 'registration';
    if (registrationStart != null || ladderStart != null) return 'upcoming';
    return 'unknown';
}

/** Win share of the reported matches, clamped as the organizer's numbers don't always add up. */
export function ladderWinRate(standing: Pick<LadderStanding, 'wins' | 'matches'>) {
    if (standing.matches <= 0) return 0;
    return Math.max(0, Math.min(1, standing.wins / standing.matches));
}

// Known stages in display order; the rest go after them alphabetically, the ladder phase and unnamed ones last.
const STAGE_ORDER = [['FINAL', 'FINALS', 'GRAND FINAL'], ['THIRD PLACE'], ['SEMI-FINALS', 'SEMI-FINAL', 'SEMIFINALS', 'SEMIFINAL'], ['QUARTER-FINALS', 'QUARTER-FINAL', 'QUARTERFINALS'], ['FUNNEL']];

function stageOrder(stage: string) {
    const normalized = stage.trim().toUpperCase();
    if (normalized === '') return 1000;
    if (normalized === 'LADDER') return 999;
    const index = STAGE_ORDER.findIndex((names) => names.includes(normalized));
    return index === -1 ? STAGE_ORDER.length : index;
}

export function groupVideosByStage(videos: LadderVideo[]) {
    const groups = new Map<string, LadderVideo[]>();
    for (const video of videos) {
        const key = video.stage.trim().toUpperCase();
        groups.set(key, [...(groups.get(key) ?? []), video]);
    }
    return [...groups.entries()]
        .sort(([a], [b]) => stageOrder(a) - stageOrder(b) || a.localeCompare(b))
        .map(([stage, stageVideos]) => ({ stage, videos: stageVideos }));
}

/** "SEMI-FINALS" -> "Semi-Finals". */
export function formatStage(stage: string) {
    return stage
        .trim()
        .toLowerCase()
        .replace(/(^|[\s-])[a-z]/g, (match) => match.toUpperCase());
}
