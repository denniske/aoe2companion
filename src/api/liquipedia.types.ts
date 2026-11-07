// The shapes the tournament screens render. They started as the `liquipedia` package's types, back when that
// package scraped the wiki for us; now src/api/liquipedia.convert.ts builds them from Liquipedia v3 rows served
// by our tournament service.

/** The app's tournament tiers. The values are the `category` the tournament service filters on. */
export enum TournamentCategory {
    TierS = 's',
    TierA = 'a',
    TierB = 'b',
    TierC = 'c',
    Weekly = 'weekly',
    Monthly = 'monthly',
    ShowMatches = 'showmatch',
    Qualifiers = 'qualifier',
    FFA = 'ffa',
    Miscellaneous = 'misc',
}

export enum TournamentType {
    Unknown = 'Unknown',
    Team = 'Team',
    Individual = 'Individual',
}

export enum TournamentLocationType {
    LAN = 'LAN',
    Online = 'Online',
}

export type Amount = {
    amount: number;
    code: 'USD';
};

export interface Country {
    name: string;
    code: string;
}

export interface Tournament {
    game: string;
    type: TournamentType;
    tier?: TournamentCategory;
    name: string;
    path: string;
    start?: Date;
    end?: Date;
    participantsCount: number;
    prizePool?: Amount;
    location?: {
        name: string;
        country?: Country;
        type: TournamentLocationType;
    };
    league?: {
        name: string;
        image?: string;
        path?: string;
    };
}

export interface EventPlayer {
    name?: string;
    civilization?: string;
    country?: Country;
}

export interface EventParticipant {
    name: string;
    score?: number | string;
    /** Upper-case ISO country code, shown as a flag. */
    country?: string;
    note?: string;
}

export interface Link {
    url: string;
    image?: string;
    text: string;
}

export interface PlayoffGame {
    map: string;
    players?: [EventPlayer[], EventPlayer[]];
    winner?: 0 | 1;
}

export interface PlayoffMatch {
    bestOf?: string;
    header?: {
        name: string;
        format?: string;
    };
    participants: [EventParticipant, EventParticipant] | [EventParticipant];
    winner?: 0 | 1;
    startTime?: Date;
    note?: string;
    links: Link[];
    games: PlayoffGame[];
}

export interface Round {
    id: string;
    name: string;
    format?: string;
    matches: PlayoffMatch[];
}

export type PlayoffRound = Round;

export interface Map {
    name: string;
    image?: string;
    category?: string;
}

export interface Score {
    win: number;
    loss: number;
    draw: number;
}

export interface GroupParticipant extends Omit<EventParticipant, 'score'> {
    position?: number;
    matchScore?: Score;
    gameScore?: Score;
    points?: string;
    status?: 'up' | 'stayup' | 'stay' | 'down';
}

export interface Group {
    name: string;
    participants: GroupParticipant[];
    rounds: Round[];
}

export interface Prize {
    place: string;
    prize?: Amount;
    participants: EventParticipant[];
}

export interface Playoff {
    name?: string;
    rounds: PlayoffRound[];
}

export interface TournamentDetail extends Tournament {
    format?: string;
    maps: Map[];
    participants: EventParticipant[];
    playoffs: Playoff[];
    groups: Group[];
    /** Matches outside any bracket or group: show matches, single match lists. */
    results: PlayoffMatch[];
    prizes: Prize[];
    organizer?: string;
    venue?: string;
}

export type Match = {
    participants: [EventParticipant, EventParticipant];
    format?: string;
    winner?: 0 | 1;
    startTime?: Date;
    links: Link[];
    tournament: {
        name: string;
        image?: string;
        path: string;
    };
};

export interface Player {
    name: string;
    image?: string;
    bio?: string;
    fullName?: string;
    nationality?: string;
    birthdate?: Date;
    age?: number;
    status?: string;
    yearsActive?: string;
    team?: string;
    totalWinnings?: Amount;
}
