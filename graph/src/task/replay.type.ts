
export interface IReplayPlayer {
    achievements?: any;
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

export interface IReplay {
    duration: number;
    players: IReplayPlayer[];
}

export interface IReplayResult {
    status: number;
    replay: IReplay;
}
