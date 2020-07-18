import {useEffect, useRef, useState} from 'react';
import {sleep} from "../helper/util";

type UnPromisify<T> = T extends Promise<infer U> ? U : T;

export function useLazyApi<A extends (...args: any) => any>(action: A, ...defArgs: Parameters<A>) {
    const [data, setData] = useState(null as UnPromisify<ReturnType<A>>);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);
    const mountedRef = useRef(true);

    const load = async (...args: Parameters<A>) => {
        if (!mountedRef.current) return null;

        setLoading(true);

        // If load is called in useEffect() it may be run synchronously if action is an synchronous function.
        // So we call an async function to force running asynchronously.
        await sleep(0);

        const data = await action(...args) as UnPromisify<ReturnType<A>>;

        if (!mountedRef.current) return null;

        setData(data);
        setLoading(false);
        setTouched(true);

        return data;
    };

    const reset = () => {
        setData(null as UnPromisify<ReturnType<A>>);
        setTouched(false);
    }

    const reload = async () => {
        await load(...defArgs);
    }

    const refetch = async (...args: Parameters<A>) => {
        return await load(...args);
    }

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    return {touched, data, loading, refetch, reload, reset};
}
