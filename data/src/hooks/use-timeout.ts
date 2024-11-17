import {useEffect} from "react";

export const useTimeout = (onTimeout: () => void, delay?: number) => {
    useEffect(() => {
        const timeoutHandler = setTimeout(onTimeout, delay);
        return () => {
            clearTimeout(timeoutHandler);
        };
    }, []);
};
