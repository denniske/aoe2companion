import {useEffect} from 'react';
import {Platform} from "react-native";


export function useWebKeyUp(onKeyUp: (event: KeyboardEvent) => void, deps: any[]) {
    useEffect(() => {
        if (Platform.OS !== 'web') return;
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keyup', onKeyUp);
        };
    }, deps);
}
