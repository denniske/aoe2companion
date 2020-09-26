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
        let nav = getRootNavigation();

        const timeoutHandler = setTimeout( () => {
            nav = getRootNavigation();
            nav.addListener('state', onNavigationStateChanged);
            setState(nav.getRootState());
        });

        return () => {
            clearTimeout(timeoutHandler);
            nav.removeListener('state', onNavigationStateChanged);
            mountedRef.current = false;
        };
    }, []);

    return state;
}
