export interface IRecording {
    chat: IRecordingChat[];
    completed: boolean;
    dataset: IRecordingDataset;
    diplomacy: IRecordingDiplomacy;
    duration: number;
    encoding: string;
    file_hash: string;
    language: string;
    map: IRecordingMap;
    mirror: boolean;
    owner: number;
    platform: IRecordingPlatform;
    players: IRecordingPlayer[];
    postgame?: any;
    profile_ids: IRecordingProfileids;
    ratings: IRecordingRatings;
    restored: (boolean | number)[];
    start_time: number;
    teams: number[][];
}

interface IRecordingProfileids {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
    '6': number;
}

interface IRecordingPlayer {
    cheater: boolean;
    civilization: number;
    color_id: number;
    human: boolean;
    mvp?: any;
    name: string;
    number: number;
    position: number[];
    rate_snapshot?: any;
    score?: any;
    user_id: number;
    winner: boolean;
}

interface IRecordingPlatform {
    ladder?: any;
    lobby_name: string;
    platform_id: string;
    platform_match_id: string;
    rated?: any;
    ratings: IRecordingRatings;
}

interface IRecordingRatings {
}

interface IRecordingMap {
    custom: boolean;
    dimension: number;
    id: number;
    modes: IRecordingModes;
    name: string;
    seed: number;
    size: string;
    water: number;
    zr: boolean;
}

interface IRecordingModes {
    direct_placement: boolean;
    effect_quantity: boolean;
    fixed_positions: boolean;
    guard_state: boolean;
}

interface IRecordingDiplomacy {
    '1v1': boolean;
    FFA: boolean;
    TG: boolean;
    team_size: string;
    type: string;
}

interface IRecordingDataset {
    id: number;
    name: string;
    version?: any;
}

interface IRecordingChat {
    audience?: string;
    message?: string;
    origination: string;
    player_number?: number;
    timestamp: number;
    type: string;
}
