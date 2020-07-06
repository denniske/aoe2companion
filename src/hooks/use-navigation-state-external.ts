import {useEffect, useRef, useState} from 'react';
import {getRootNavigation} from "../service/navigation";
import {NavigationState} from "react-native-tab-view";


export function useNavigationStateExternal() {
    const mountedRef = useRef(true);
    // const callbackRef = useRef<any>(null);
    const [state, setState] = useState<NavigationState<any> | null>(null);

    const evented = (ev: any) => {
        const state = ev.data.state as NavigationState<any>;
        setState(state);
        // const activeRoute = state?.routes[state.index];
        // console.log('evented', activeRoute?.name);
    };

    useEffect(() => {
        mountedRef.current = true;
        // callbackRef.current = evented;

        console.log('evented SUBSCRIBED');
        const nav = getRootNavigation();
        nav.addListener('state', evented);

        return () => {
            console.log('evented UNSUBSCRIBED');
            nav.removeListener('state', evented);
            mountedRef.current = false;
        };
    }, []);

    return state;
}



