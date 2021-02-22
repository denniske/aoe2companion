import {aoeReferenceData} from '../data/aoe-reference-data';

export interface IReferencePlayer {
    name: string;
    country: string;
    esportsearnings: number;
    aoeelo: number;
    liquipedia: string;
    twitch: string;
    youtube: string;
    discord: string;
    platforms: {
        de?: string[],
    };
    aka: string[];
    douyu: string;
    mixer: string;
}

export interface IReferenceTeam {
    name: string;
    abbreviation: string;
    players: string[];
}

export interface IReferenceData {
    players: IReferencePlayer[];
    teams: IReferenceTeam[];
}

const aoeReferenceDataTyped = aoeReferenceData as unknown as IReferenceData;

export function getVerifiedPlayer(profileId: number) {
    const verifiedPlayer = aoeReferenceDataTyped.players.find(p => p.platforms.de?.includes(profileId.toString()));
    // console.log(profileId, verifiedPlayer);
    return verifiedPlayer;
}

export function getTwitchChannel(verifiedPlayer: IReferencePlayer) {
    return verifiedPlayer.twitch
        ?.replace('https://twitch.tv/', '')
        ?.replace('https://www.twitch.tv/', '')
        ?.replace('/', '');
}

