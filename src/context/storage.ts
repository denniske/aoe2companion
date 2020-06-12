import { ISettings } from '../service/storage';
import { useState } from 'react';
import { createContainer } from 'unstated-next';



export function useSettings(initialState: ISettings | undefined) {
    let [settings, setSettings] = useState(initialState);
    // let decrement = () => setCount(count - 1)
    // let increment = () => setCount(count + 1)

    // let increment = (x: ISettings) => setSettings(x)

    // let decrement = useCallback(() => setCount(count - 1), [count])
    // let increment = useCallback(() => setCount(count + 1), [count])
    // let decrement = useCallback(() => setCount(count => count - 1), [])
    // let increment = useCallback(() => setCount(count => count + 1), [])

    console.log("CONTEXT USE SETTINGS settings =", settings);

    return {settings, setSettings};
}

export let Settings = createContainer(useSettings);
