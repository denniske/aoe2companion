import { produce } from 'immer';
import { TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector } from 'react-redux';
import { IScroll } from '../service/storage';
import { ExpoUpdatesManifest } from 'expo-manifests';

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

/**
 * Returns a dispatcher with a *stable* identity, so callers can put it in effect
 * dependency arrays (see useScrollView) without the effect re-running on every
 * render.
 *
 * React Compiler provides the memoization — it caches the returned closure on
 * `[dispatch, ma]`. No useCallback needed; adding one emits byte-identical code
 * and only risks a `preserve-manual-memoization` bailout if the body later reads
 * something the dep array misses.
 *
 * The stability does require `ma` to be a stable reference — declare action
 * creators at module scope, as below. Passing an arrow inline would make `ma` a
 * new value every render and defeat the cache.
 */
export function useMutateAction(ma: StateMutationAction) {
    const dispatch = useDispatch();
    return (...args: any[]) => dispatch(exec(ma(...args)));
}

const setScrollPositionAction: StateMutationAction = (scrollPosition: number) => (state) => {
    state.scroll.scrollPosition = scrollPosition;
};
const setScrollToTopAction: StateMutationAction = (scrollToTop: string) => (state) => {
    state.scroll.scrollToTop = scrollToTop;
};

export function useMutateScroll() {
    const setScrollPosition = useMutateAction(setScrollPositionAction);
    const setScrollToTop = useMutateAction(setScrollToTopAction);

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

export function addLog(log: string) {
    return (state: AppState) => {
        if (!state.logs) {
            state.logs = [];
        }
        state.logs.push(log);
    };
}

export function setUpdateManifest(updateManifest: ExpoUpdatesManifest | null) {
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

export type DarkMode = 'light' | 'dark' | 'system';

// Only holds global UI state that no other layer owns. Server data lives in
// react-query; anything that used to be mirrored here (account, following,
// leaderboards, civInfos, config, ...) was dropped once react-query took over.
export interface AppState {
    error?: IError | null;
    errors?: IError[] | null;
    logs?: string[] | null;

    scroll: IScroll;

    updateState: string;
    updateAvailable: boolean;
    updateManifest?: ExpoUpdatesManifest | null;
    updateStoreManifest?: any | null;
    mainPageShown?: boolean;
}

export const initialState: Partial<AppState> = {
    scroll: { scrollPosition: 0 },
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
