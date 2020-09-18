import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef>();

// export function navigate(name: any, params: any) {
//     navigationRef.current?.navigate(name, params);
// }

function findState(state: any, routeName: string): any {
    if (state == null) return null;
    const activeRoute = state.routes[state.index];
    const activeRouteName = activeRoute?.name;
    if (activeRouteName == routeName) {
        return activeRoute.state;
    }
    return findState(activeRoute.state, routeName);
}

function getActiveRouteName(state: any): any {
    if (state == null) return null;
    const activeRoute = state.routes[state.index];
    return activeRoute?.name;
}

function getActiveRoute(state: any): any {
    if (state == null) return null;
    return state.routes[state.index];
}

export function getRootNavigation() {
    return navigationRef.current!;
}
