import {useEffect} from "react";

export const useInterval = (onInterval: () => void, delay?: number) => {
    useEffect(() => {
        const intervalHandler = setInterval(onInterval, delay);
        return () => {
            clearInterval(intervalHandler);
        };
    }, []);
};
