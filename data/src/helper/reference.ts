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
                        "de": [
                            "209525"
                        ]
                    }
                },
            ]
        }
    ) as unknown as IReferenceData;
    verifiedProfileIds = flatMap(aoeReferenceDataTyped.players, p => p.platforms.de);
}

let aoeReferenceDataTyped = {} as unknown as IReferenceData;
let verifiedProfileIds = [];

export function isVerifiedPlayer(profileId: number) {
    return verifiedProfileIds.includes(profileId.toString());
}

export function getVerifiedPlayer(profileId: number) {
    const verifiedPlayer = aoeReferenceDataTyped.players.find(p => p.platforms.de?.includes(profileId.toString()));
    // console.log(profileId, verifiedPlayer);
    return verifiedPlayer;
}

export function getTwitchChannel(verifiedPlayer: IReferencePlayer) {
    return verifiedPlayer.twitch
        ?.replace('http://', '')
        ?.replace('https://', '')
        ?.replace('www.', '')
        ?.replace('twitch.tv/', '')
        ?.replace('/', '');
}

export function getDiscordInvitationId(verifiedPlayer: IReferencePlayer) {
    return verifiedPlayer.discord
        ?.replace('http://', '')
        ?.replace('https://', '')
        ?.replace('www.', '')
        ?.replace('discord.gg/', '')
        ?.replace('/', '');
}

export function getYoutubeChannel(verifiedPlayer: IReferencePlayer) {
    return verifiedPlayer.youtube
        ?.replace('http://', '')
        ?.replace('https://', '')
        ?.replace('www.', '')
        ?.replace('youtube.com/channel/', '')
        ?.replace('/', '');
}

export function getDoyouChannel(verifiedPlayer: IReferencePlayer) {
    return verifiedPlayer.douyu
        ?.replace('http://', '')
        ?.replace('https://', '')
        ?.replace('www.', '')
        ?.replace('douyu.com', '')
        ?.replace('/', '');
}
