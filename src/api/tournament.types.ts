import { Match } from 'liquipedia';

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
        loweredges?: Array<{
            opponentIndex: number;
            lowerMatchIndex: number;
        }>;
        type: string;
        thirdplace?: string;
        bracketsection?: string;
        lowerMatchIds?: Array<string>;
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
    match2opponents: Array<{
        id: number;
        type: string;
        name: string;
        template: string;
        icon: string;
        score: number;
        status: string;
        placement: number;
        match2players: Array<{
            id: number;
            opid: number;
            name: string;
            displayname: string;
            flag: string;
            extradata: any;
        }>;
        extradata: Array<any>;
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
    }>;
    match2games: Array<{
        map: string;
        subgroup: string;
        match2gameid: number;
        scores: Array<number>;
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
        opponents: Array<{
            players: Array<{
                pageName: string;
                index: number;
                flag: string;
                civ: string;
                displayName: string;
            }>;
            status?: string;
            score?: number;
        }>;
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
    }>;
    wiki: string;
}
