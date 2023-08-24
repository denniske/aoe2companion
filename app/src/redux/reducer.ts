import {produce} from "immer";
import { TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector } from 'react-redux';
import {ILeaderboard} from "@nex/data";
import {ILeaderboardsResponse, IMatch, IPlayer, IProfileResponse} from "@nex/data/api";
import {IAccount, IConfig, IFollowingEntry, IPrefs} from "../service/storage";
import {Manifest} from "expo-updates/build/Updates.types";
import {set} from 'lodash';


export const EXEC = 'EXEC'

export function exec(mutation: StateMutation) {
  return {
    type: EXEC,
    mutation
  }
}


export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector

type StateMutation = (state: AppState) => void;

export function useMutate() {
  const dispatch = useDispatch()
  return (m: StateMutation) => dispatch(exec(m));
}

export function setError(error: IError | null) {
  return (state: AppState) => {
    state.error = error;
    if (state.errors == null) {
      state.errors = [];
    }
    if (error) {
      state.errors.push(error);
    }
    if (state.errors.length > 10) {
      state.errors.unshift();
    }
  };
}

export function addLoadedLanguage(language: string) {
  return (state: AppState) => {
    state.loadedLanguages = [...(state.loadedLanguages?.filter(l => l !== language) || []), language];
  };
}

export function setPrefValue<T extends keyof IPrefs>(key: T, value: IPrefs[T]) {
  return (state: AppState) => {
    state.prefs[key] = value;
  };
}

export function setAuth(user: any | null) {
  return (state: AppState) => {
    state.auth = user;
  };
}

export function setLeaderboardCountry(country?: string | null) {
  return (state: AppState) => {
    state.leaderboardCountry = country;
  };
}

export function setFollowing(following: IFollowingEntry[]) {
  return (state: AppState) => {
    state.following = following;

    // Invalidate followedMatches cache
    state.followedMatches = undefined;
  };
}

export function setPurchaserInfo(purchaserInfo: any | null) {
  return (state: AppState) => {
    state.donation.purchaserInfo = purchaserInfo;
  };
}

export function setUpdateManifest(updateManifest: Manifest | null) {
  return (state: AppState) => {
    state.updateManifest = updateManifest;
    state.updateAvailable = true;
    state.updateState = 'expoUpdateAvailable';
  };
}

export function setUpdateStoreManifest(updateStoreManifest: any | null) {
  return (state: AppState) => {
    state.updateStoreManifest = updateStoreManifest;
    state.updateAvailable = true;
    state.updateState = 'storeUpdateAvailable';
  };
}

export function setUpdateElectronManifest(updateElectronManifest: any | null) {
  return (state: AppState) => {
    state.updateElectronManifest = updateElectronManifest;
    state.updateAvailable = true;
    state.updateState = 'electronUpdateAvailable';
  };
}

export function setUpdateAvailable(updateAvailable: boolean) {
  return (state: AppState) => {
    state.updateAvailable = updateAvailable;
  };
}

export function setUpdateState(updateState: string) {
  return (state: AppState) => {
    state.updateState = updateState;
  };
}

export function setConfig(config: IConfig) {
  return (state: AppState) => {
    state.config = config;
  };
}

export function clearStatsPlayer(profileId: number) {
  return (state: AppState) => {
    set(state, ['statsPlayer', profileId], undefined);
  };
}

export function clearMatchesPlayer(profileId: number) {
  return (state: AppState) => {
    set(state, ['user', profileId, 'matches'], undefined);
  };
}

export function setIngame(match: IMatch, player: IPlayer) {
  return (state: AppState) => {
    state.ingame = {
      match,
      player,
    };
  };
}

interface IAction {
  type: string;
  id?: string;
  note?: INote;
  mutation?: any;
}

interface INoteEntry {
  id: string;
  note: INote;
}

interface INote {
  noteTitle: string;
  noteValue: string;
}

interface IUser {
  profile?: IProfileResponse;
  profileWithStats?: IProfileResponse;
  matches?: IMatch[];
  matches5?: IMatch[];
  matchesVersus?: IMatch[];
}

interface IUserDict {
  [key: string]: IUser;
}

interface ILeaderboardDict {
  [key: string]: ILeaderboard;
}

export interface IError {
  title: string;
  extra: any;
  error: Error;
}

export interface IDonation {
  purchaserInfo?: any;
}

export type DarkMode = 'light' | 'dark' | 'system';

export interface AppState {
  account: IAccount;
  auth?: any | null;
  user: IUserDict;
  donation: IDonation;
  statsPlayer: any;
  leaderboards: ILeaderboardsResponse;
  civInfos: any;

  error?: IError | null;
  errors?: IError[] | null;

  config: IConfig;
  prefs: IPrefs;

  following: IFollowingEntry[];
  followedMatches?: IMatch[];

  leaderboardCountry?: string | null;

  leaderboard: ILeaderboardDict;

  loadedLanguages: string[];

  ingame: {
    match: IMatch;
    player: IPlayer;
  };

  updateState: string;
  updateAvailable: boolean;
  updateManifest?: Manifest | null;
  updateStoreManifest?: any | null;
  updateElectronManifest?: any | null;
}

const initialState: Partial<AppState> = {
  config: undefined,
  followedMatches: undefined,
  user: {},
  donation: {},
  leaderboard: {},
  auth: undefined,
  statsPlayer: undefined,
  civInfos: {},
};


export function setInitialState() {
  return (state: AppState) => {
    Object.assign(state, initialState);
  };
}

function notesReducer(state = initialState, action: IAction) {
  switch (action.type) {
    case EXEC:
      return produce(state, action.mutation);
    default:
      return state
  }
}

export default notesReducer
