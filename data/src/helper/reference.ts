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
    const verifiedPlayer = aoeReferenceDataTyped.players?.find(p => p.platforms?.rl?.includes(profileId.toString()));
    // console.log(profileId, verifiedPlayer);
    return verifiedPlayer;
}

export function getTwitchChannel(verifiedPlayer: IReferencePlayer) {
    try {
        return verifiedPlayer?.twitch?.[0]
            ?.replace('http://', '')
            ?.replace('https://', '')
            ?.replace('www.', '')
            ?.replace('twitch.tv/', '')
            ?.replace('/', '');
    } catch (err) {}
}

export function getDiscordInvitationId(verifiedPlayer: IReferencePlayer) {
    try {
        return verifiedPlayer?.discord?.[0]
            ?.replace('http://', '')
            ?.replace('https://', '')
            ?.replace('www.', '')
            ?.replace('discord.gg/', '')
            ?.replace('/', '');
    } catch (err) {}
}

export function getYoutubeChannel(verifiedPlayer: IReferencePlayer) {
    try {
        return verifiedPlayer?.youtube?.[0]
            ?.replace('http://', '')
            ?.replace('https://', '')
            ?.replace('www.', '')
            ?.replace('youtube.com/channel/', '')
            ?.replace('/', '');
    } catch (err) {}
}

export function getDoyouChannel(verifiedPlayer: IReferencePlayer) {
    try {
        return verifiedPlayer?.douyu?.[0]
            ?.replace('http://', '')
            ?.replace('https://', '')
            ?.replace('www.', '')
            ?.replace('douyu.com', '')
            ?.replace('/', '');
    } catch (err) {}
}
