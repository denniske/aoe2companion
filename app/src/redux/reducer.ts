import { produce } from 'immer';
import { TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector } from 'react-redux';
import { IAccount, IConfig, IFollowingEntry, IPrefs, IScroll } from '../service/storage';
import { Manifest } from 'expo-updates/build/Updates.types';
import { set } from 'lodash';
import { ILeaderboardDef } from '../api/helper/api.types';

export const EXEC = 'EXEC';

export function exec(mutation: StateMutation) {
    return {
        type: EXEC,
        mutation,
    };
}

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;

type StateMutation = (state: AppState) => void;
type StateMutationAction = (...args: any[]) => StateMutation;

export function useMutate() {
    const dispatch = useDispatch();
    return (m: StateMutation) => dispatch(exec(m));
}

export function useMutateAction(ma: StateMutationAction) {
    const dispatch = useDispatch();
    return (...args: any[]) => dispatch(exec(ma(...args)));
}

export function useMutateScroll() {
    const setScrollPosition = useMutateAction((scrollPosition: number) => (state) => {
        state.scroll.scrollPosition = scrollPosition;
    });
    const setScrollToTop = useMutateAction((scrollToTop: string) => (state) => {
        state.scroll.scrollToTop = scrollToTop;
    });

    // const setScrollPosition = useMutateAction((scrollPosition: number) => (state) => (state.scroll.scrollPosition = scrollPosition));
    // const setScrollToTop = useMutateAction((scrollToTop: string) => (state) => (state.scroll.scrollToTop = scrollToTop));

    // const mutate = useMutate();
    // const setScrollPosition = (scrollPosition: number) => mutate((state) => {
    //     state.scroll.scrollPosition = scrollPosition;
    // });

    return { setScrollPosition, setScrollToTop };
}

export const useScroll = () => useSelector((state) => state.scroll);
export const useScrollPosition = () => useSelector((state) => state.scroll.scrollPosition);
export const useScrollToTop = () => useSelector((state) => state.scroll.scrollToTop);

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

export function setMainPageShown(mainPageShown: boolean) {
    return (state: AppState) => {
        state.mainPageShown = mainPageShown;
    };
}

export function setLeaderboardCountry(country?: string | null) {
    return (state: AppState) => {
        state.leaderboardCountry = country;
    };
}

// export function setPurchaserInfo(purchaserInfo: any | null) {
//     return (state: AppState) => {
//         state.donation.purchaserInfo = purchaserInfo;
//     };
// }

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

interface IAction {
    type: string;
    id?: string;
    mutation?: any;
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
    auth?: { profileId: number } | null;
    donation: IDonation;
    statsPlayer: any;
    leaderboards: ILeaderboardDef[];
    civInfos: any;

    error?: IError | null;
    errors?: IError[] | null;

    config: IConfig;
    prefs: IPrefs;
    scroll: IScroll;

    following: IFollowingEntry[];

    leaderboardCountry?: string | null;

    loadedLanguages: string[];

    updateState: string;
    updateAvailable: boolean;
    updateManifest?: Manifest | null;
    updateStoreManifest?: any | null;
    mainPage: string;
    mainPageShown?: boolean;
}

export const initialState: Partial<AppState> = {
    config: undefined,
    donation: {},
    scroll: { scrollPosition: 0 },
    auth: undefined,
    statsPlayer: undefined,
    civInfos: {},
};

function notesReducer(state = initialState, action: IAction) {
    switch (action.type) {
        case EXEC:
            return produce(state, action.mutation);

            // To ignore return value of mutation use this:
            // return produce(state, (state) => {
            //     action.mutation(state);
            // });
        default:
            return state;
    }
}

export default notesReducer;
