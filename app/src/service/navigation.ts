import * as React from 'react';
import { NavigationContainerRef, NavigationState } from '@react-navigation/native';
import {PartialState, Route} from '@react-navigation/routers/src/types';

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

type MyRoute = (Route<string> & {
    state?: NavigationState | PartialState<NavigationState>;
});

export function getPathToRoute(state: NavigationState | null, routeKey: string): any {
    if (state == null) return [];

    for (const route of state.routes) {
        const path = getPathToRouteInternal(route, routeKey);
        if (path.length > 0) return path;
    }

    return [];
}

export function getPathToRouteInternal(route: MyRoute, routeKey: string): any {
    if (route.key == routeKey) return [route];

    if (route.state) {
        for (const childRoute of route.state.routes) {
            const path = getPathToRouteInternal(childRoute as MyRoute, routeKey);
            if (path.length > 0) return [route, ...path];
        }
    }

    return [];
}

export function getRoutesFromCurrentActiveStack(state: any): any {
    if (state == null || state.index == null) return [];
    const activeRoute = state.routes[state.index];
    return [activeRoute, ...getRoutesFromCurrentActiveStack(activeRoute.state)];
}

export function getRoutes(state: any): any {
    if (state == null) return [];
    const activeRoute = state.routes[state.index];
    return [activeRoute, ...getRoutes(activeRoute.state)];
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
