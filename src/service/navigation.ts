import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = React.createRef<NavigationContainerRef>();

// export function navigate(name: any, params: any) {
//     navigationRef.current?.navigate(name, params);
// }

export function getRootNavigation() {
    return navigationRef.current!;
}
