import {useEffect, useRef, useState} from 'react';
import {getRootNavigation} from "../service/navigation";
import {NavigationState} from "react-native-tab-view";


export function useNavigationStateExternal() {
    const mountedRef = useRef(true);
    const [state, setState] = useState<NavigationState<any> | null>(null);

    const onNavigationStateChanged = (ev: any) => {
        const state = ev.data.state as NavigationState<any>;
        if (state != null) {
            setState(state);
        }
    };

    useEffect(() => {
        mountedRef.current = true;

        const nav = getRootNavigation();

        // console.log('evented SUBSCRIBED');
        nav.addListener('state', onNavigationStateChanged);

        setState(nav.getRootState());

        return () => {
            // console.log('evented UNSUBSCRIBED');
            nav.removeListener('state', onNavigationStateChanged);
            mountedRef.current = false;
        };
    }, []);

    return state;
}
