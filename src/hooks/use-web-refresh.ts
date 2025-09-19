import {useWebKeyUp} from "./use-web-key-up";


export function useWebRefresh(onWebRefresh: () => void, deps: any[]) {
    useWebKeyUp((ev: KeyboardEvent) => {
        if (ev.code === 'F5') {
            onWebRefresh();
        }
    }, deps);
}
