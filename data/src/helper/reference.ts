import {flatMap} from 'lodash';

export interface IReferencePlayer {
    name: string;
    country: string;
    esportsearnings: number;
    aoeelo: number;
    liquipedia: string;
    twitch: string;
    youtube: string;
    discord: string;
    discordServerId: string;
    platforms: {
        rl?: string[],
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

export function setAoeReferenceData(data: any) {
    aoeReferenceDataTyped = Object.assign(
        {},
        data,
        {
            players: [
                ...data.players,
                {
                    "name": "aoe2companion",
                    "country": "de",
                    "discord": "https://discord.gg/gCunWKx",
                    "discordServerId": "727175083977736262",
                    "platforms": {
                        "rl": [
                            "209525"
                        ]
                    }
                },
            ]
        }
    ) as unknown as IReferenceData;
    verifiedProfileIds = flatMap(aoeReferenceDataTyped.players, p => p.platforms.rl);
    // console.log('verifiedProfileIds', verifiedProfileIds);
}

let aoeReferenceDataTyped = {} as unknown as IReferenceData;
let verifiedProfileIds = [];

export function isVerifiedPlayer(profileId: number) {
    return verifiedProfileIds.includes(profileId.toString());
}

export function getVerifiedPlayer(profileId: number) {
    // console.log(profileId, verifiedPlayer);
    return aoeReferenceDataTyped.players?.find(p => p.platforms?.rl?.includes(profileId.toString()));
}

export function getVerifiedPlayerBy(findFunction: (player: IReferencePlayer) => boolean) {
    return aoeReferenceDataTyped.players?.find(findFunction);
}

export function getTwitchChannel(verifiedPlayer: IReferencePlayer) {
    return verifiedPlayer?.twitch?.[0]
        ?.replace('http://', '')
        ?.replace('https://', '')
        ?.replace('www.', '')
        ?.replace('twitch.tv/', '')
        ?.replace('/', '');
}

export function getDiscordInvitationId(verifiedPlayer: IReferencePlayer) {
    return verifiedPlayer?.discord?.[0]
        ?.replace('http://', '')
        ?.replace('https://', '')
        ?.replace('www.', '')
        ?.replace('discord.gg/', '')
        ?.replace('/', '');
}

export function getYoutubeChannel(verifiedPlayer: IReferencePlayer) {
    return verifiedPlayer?.youtube?.[0]
        ?.replace('http://', '')
        ?.replace('https://', '')
        ?.replace('www.', '')
        ?.replace('youtube.com/channel/', '')
        ?.replace('/', '');
}

export function getDoyouChannel(verifiedPlayer: IReferencePlayer) {
    return verifiedPlayer?.douyu?.[0]
        ?.replace('http://', '')
        ?.replace('https://', '')
        ?.replace('www.', '')
        ?.replace('douyu.com', '')
        ?.replace('/', '');
}
