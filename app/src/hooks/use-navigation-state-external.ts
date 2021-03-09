import {useEffect, useRef, useState} from 'react';
import {getRootNavigation} from "../service/navigation";
import {NavigationState} from '@react-navigation/native';


export function useNavigationStateExternal() {
    const [state, setState] = useState<NavigationState | null>(null);

    const onNavigationStateChanged = (ev: any) => {
        const state = ev.data.state as NavigationState;
        if (state != null) {
            setState(state);
        }
    };

    useEffect(() => {
        let nav = getRootNavigation();

        const timeoutHandler = setTimeout( () => {
            nav = getRootNavigation();
            nav.addListener('state', onNavigationStateChanged);
            setState(nav.getRootState());
        });

        return () => {
            clearTimeout(timeoutHandler);
            nav.removeListener('state', onNavigationStateChanged);
        };
    }, []);

    return state;
}
