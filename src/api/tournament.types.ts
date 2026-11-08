import type { Match } from './liquipedia.types';

export type ConvertedLiquipediaMatch = Match & {
    finished: boolean;
};

export interface ILiquipediaPlacement {
    pageid: number
    pagename: string
    namespace: number
    objectname: string
    tournament: string
    series: string
    parent: string
    imageurl: string
    imagedarkurl: string
    startdate: string
    date: string
    placement: string
    prizemoney: number
    individualprizemoney: number
    prizepoolindex: number
    weight: number
    mode: string
    type: string
    liquipediatier: string
    liquipediatiertype: string
    publishertier: string
    icon: string
    iconurl: string
    icondark: string
    icondarkurl: string
    game: string
    lastvsdata: {
        opponenttype: string
        opponentname: string
        score: number
        opponentplayers: {
            p1team?: string
            p1flag: string
            p1dn: string
            p1faction: string
            p1template?: string
            p1: string
        }
    }
    opponentname: string
    opponenttemplate: string
    opponenttype: string
    opponentplayers: {
        p1team?: string
        p1flag: string
        p1dn: string
        p1faction: string
        p1template?: string
        p1: string
    }
    qualifier: string
    qualifierpage: string
    qualifierurl: string
    extradata: {
        participantname: string
        lastvsname: string
        lastvsflag: string
        notabilitymod?: string
        prizepoints2: string
        prizepoints: string
        participantteam?: string
    }
    wiki: string
}

export interface INewLiquipediaMatch {
    pageid: number;
    pagename: string;
    namespace: number;
    objectname: string;
    match2id: string;
    match2bracketid: string;
    status: string;
    winner: string;
    walkover: string;
    resulttype: string;
    finished: number;
    mode: string;
    type: string;
    section: string;
    game: string;
    patch: string;
    date: string;
    dateexact: number;
    stream: any;
    links: {
        headtohead: string;
        mapdraft: string;
        civdraft: string;
    };
    bestof: number;
    vod: string;
    tournament: string;
    parent: string;
    tickername: string;
    shortname: string;
    series: string;
    icon: string;
    iconurl: string;
    icondark: string;
    icondarkurl: string;
    liquipediatier: string;
    liquipediatiertype: string;
    publishertier: string;
    extradata: {
        timestamp: number;
        matchsection?: string;
        timezoneoffset?: string;
        timezoneid?: string;
    };
    match2bracketdata: {
        loweredges?: {
            opponentIndex: number;
            lowerMatchIndex: number;
        }[];
        type: string;
        thirdplace?: string;
        bracketsection?: string;
        lowerMatchIds?: string[];
        toupper?: string;
        inheritedheader?: string;
        header?: string;
        bracketreset?: string;
        bracketindex: number;
        tolower?: string;
        coordinates?: {
            sectionIndex: number;
            depthCount: number;
            matchIndexInRound: number;
            roundIndex: number;
            rootIndex: number;
            semanticDepth?: number;
            semanticRoundIndex: number;
            depth: number;
            roundCount: number;
            sectionCount: number;
        };
        upperMatchId?: string;
        skipround?: number;
        sectionheader?: string;
        groupRoundIndex?: number;
        matchIndex?: number;
        next?: string;
        title?: string;
        qualwin?: string;
    };
    match2opponents: {
        id: number;
        type: string;
        name: string;
        template: string;
        icon: string;
        score: number;
        status: string;
        placement: number;
        match2players: {
            id: number;
            opid: number;
            name: string;
            displayname: string;
            flag: string;
            extradata: any;
        }[];
        extradata: any[];
        teamtemplate?: {
            template: string;
            page: string;
            name: string;
            shortname: string;
            bracketname: string;
            image: string;
            imagedark: string;
            legacyimage: string;
            legacyimagedark: string;
            imageurl: string;
            imagedarkurl: string;
            legacyimageurl: string;
            legacyimagedarkurl: string;
        };
    }[];
    match2games: {
        map: string;
        subgroup: string;
        match2gameid: number;
        scores: number[];
        participants: {
            '1_1': {
                pageName: string;
                index: number;
                flag: string;
                civ: string;
                displayName: string;
            };
            '2_1': {
                pageName: string;
                index: number;
                flag: string;
                civ: string;
                displayName: string;
            };
        };
        opponents: {
            players: {
                pageName: string;
                index: number;
                flag: string;
                civ: string;
                displayName: string;
            }[];
            status?: string;
            score?: number;
        }[];
        status: string;
        winner: string;
        walkover: string;
        resulttype: string;
        date: string;
        mode: string;
        type: string;
        game: string;
        patch: string;
        vod: string;
        length: string;
        extradata: {
            timestamp: number;
            dateexact: boolean;
            displayname?: string;
        };
    }[];
    wiki: string;
}

export interface ILiquipediaTournament {
    pagename: string;
    objectname: string;
    name: string;
    shortname: string;
    tickername: string;
    game: string;
    /** "1v1", "2v2", "team", ... */
    mode: string;
    /** "Online" or "Offline" */
    type: string;
    status: string;
    startdate: string;
    enddate: string;
    liquipediatier: string;
    liquipediatiertype: string;
    prizepool: number;
    participantsnumber: number;
    format: string;
    iconurl: string;
    icondarkurl: string;
    bannerurl: string;
    seriespage: string;
    /** JSON: {"1": {"link": "Arabia"}, ...} */
    maps: string;
    /** JSON: {"organizer1": "...", ...} */
    organizers: string;
    locations?: {
        city1?: string;
        venue1?: string;
        region1?: string;
        country1?: string;
    };
}

export interface ILiquipediaStandingsTable {
    pagename: string;
    parent: string;
    objectname: string;
    standingsindex: number;
    title: string;
    section: string;
    type: string;
    matches: string[];
}

export interface ILiquipediaStandingsEntry {
    pagename: string;
    parent: string;
    objectname: string;
    standingsindex: number;
    roundindex: number;
    placement: number;
    opponentname: string;
    opponenttype: string;
    opponentplayers?: { p1?: string; p1dn?: string; p1flag?: string };
    /** "up", "stayup", "stay", "down" */
    currentstatus: string;
    definitestatus: string;
    scoreboard?: {
        points?: number;
        match?: { w: number; l: number; d: number };
        game?: { w: number; l: number; d: number };
    };
}

/** A row of v3's `datapoint` table with type map. */
export interface ILiquipediaMap {
    pagename: string;
    name: string;
    imageurl: string;
    imagedarkurl: string;
    extradata?: {
        game?: string;
        maptype?: string;
        spawns?: string;
        creator1dn?: string;
        creator2dn?: string;
        creator3dn?: string;
    };
}

/** GET /api/tournament?pagename= on the tournament service. */
export interface ILiquipediaTournamentResponse {
    tournament: ILiquipediaTournament;
    /** The tournaments shown as tabs on this one, this one included. Empty when it has none. */
    subpages?: { pagename: string; name: string }[];
    /** The rows of the maps in tournament.maps that Liquipedia has data for. */
    maps?: ILiquipediaMap[];
    matches: INewLiquipediaMatch[];
    placements: ILiquipediaPlacement[];
    standingstables: ILiquipediaStandingsTable[];
    standingsentries: ILiquipediaStandingsEntry[];
}

/** GET /api/tournaments/player?pagename= on the tournament service. */
export interface ILiquipediaPlayer {
    name: string;
    fullName?: string;
    nationality?: string;
    birthdate?: string;
    status?: string;
    yearsActive?: string;
    team?: string;
    earnings?: number;
    image?: string;
    bio?: string;
    links?: Record<string, string>;
}
