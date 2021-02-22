import {aoeReferenceData} from '../data/aoe-reference-data';
import {flatMap, merge} from "lodash";

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

const aoeReferenceDataTyped = Object.assign(
    {},
    aoeReferenceData,
    {
        players: [
            ...aoeReferenceData.players,
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
            {
                "name": "Grathwrang",
                "country": "ca",
                "twitch": "https://www.twitch.tv/grathwrang",
                "platforms": {
                    "de": [
                        "271243"
                    ]
                }
            },
            {
                "name": "StellarMeesh",
                "country": "us",
                "twitch": "https://www.twitch.tv/stellarMeesh",
                "platforms": {
                    "de": [
                        "209228"
                    ]
                }
            },
            {
                "name": "OrnLu",
                "country": "us",
                "twitch": "https://www.twitch.tv/Ornlu_AoE",
                "platforms": {
                    "de": [
                        "197707"
                    ]
                }
            },
            {
                "name": "ellie4k",
                "country": "at",
                "twitch": "https://www.twitch.tv/ellie4k",
                "platforms": {
                    "de": [
                        "1686373"
                    ]
                }
            },
        ]
    }
) as unknown as IReferenceData;

const verifiedProfileIds = flatMap(aoeReferenceDataTyped.players, p => p.platforms.de);

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
