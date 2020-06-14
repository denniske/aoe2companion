import {useEffect, useRef, useState} from 'react';

type UnPromisify<T> = T extends Promise<infer U> ? U : T;

export function useLazyApi<A extends (...args: any) => any>(action: A, ...defArgs: Parameters<A>) {
    const [data, setData] = useState(null as UnPromisify<ReturnType<A>>);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    const mountedRef = useRef(true);

    const load = async (...args: Parameters<A>) => {
        setLoading(true);
        const data = await action(...args);

        if (!mountedRef.current) {
            // console.log("useLazyApi aborted due to unmount");
            return null;
        }

        setData(data);
        setLoading(false);
        setTouched(true);
    };

    const reset = () => {
        setData(null as UnPromisify<ReturnType<A>>);
        setTouched(false);
    }

    const reload = () => {
        load(...defArgs);
    }

    const refetch = (...args: Parameters<A>) => {
        load(...args);
    }

    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    return {touched, data, loading, refetch, reload, reset};
}
