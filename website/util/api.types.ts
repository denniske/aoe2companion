
export interface IMatchRaw {
  average_rating: any;
  cheats: boolean;
  ending_age: number;
  expansion: any;
  finished?: any;
  full_tech_tree: boolean;
  game_type: any;
  has_custom_content: any;
  has_password: boolean;
  leaderboard_id: number;
  lobby_id: any;
  lock_speed: boolean;
  lock_teams: boolean;
  map_size: number;
  map_type: number;
  match_id: string;
  match_uuid: string;
  name: string;
  num_players: number;
  num_slots: number;
  opened?: any;
  players: IPlayer[];
  pop: number;
  ranked: boolean;
  rating_type: any;
  resources: any;
  rms: any;
  scenario: any;
  server: string;
  shared_exploration: boolean;
  speed: number;
  started?: any;
  starting_age: number;
  team_positions: boolean;
  team_together: boolean;
  treaty_length: any;
  turbo: boolean;
  version: string;
  victory: any;
  victory_time: any;
  visibility: any;
}

export enum LeaderboardId {
  Unranked = 0,
  DM1v1 = 1,
  DMTeam = 2,
  RM1v1 = 3,
  RMTeam = 4,
}

export interface IMatch extends IMatchRaw {
  started?: Date;
  opened?: Date;
  finished?: Date;
}

