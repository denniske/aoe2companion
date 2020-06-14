import { useState } from 'react';

type UnPromisify<T> = T extends Promise<infer U> ? U : T;

export function useLazyApi<A extends (...args: any) => any>(action: A, ...defArgs: Parameters<A>) {
    const [data, setData] = useState(null as UnPromisify<ReturnType<A>>);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);

    const load = async (...args: Parameters<A>) => {
        setLoading(true);
        const data = await action(...args);
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

    return {touched, data, loading, refetch, reload, reset};
}
