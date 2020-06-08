import { useEffect, useState } from 'react';

type UnPromisify<T> = T extends Promise<infer U> ? U : T;

export function useApi<A extends (...args: any) => any>(action: A, ...defArgs: Parameters<A>) {
    const [result, setResult] = useState(null as unknown as UnPromisify<ReturnType<A>>);
    const [loading, setLoading] = useState(false);

    const internalLoad = async (...args: Parameters<A>) => {
        setLoading(true);
        const result = await action(...args);
        setResult(result);
        setLoading(false);
    };

    const reload = () => {
        internalLoad(...defArgs);
    }

    const refetch = (...args: Parameters<A>) => {
        internalLoad(...args);
    }

    useEffect(() => {
        internalLoad(...defArgs);
    }, []);

    return {result, loading, refetch, reload} as const;
}

// function useAction(action: any) {
//     const [result, setResult] = useState(null as unknown as IRatingHistoryRow[]);
//     const [loading, setLoading] = useState(false);
//
//     const internalLoad = async () => {
//         setLoading(true);
//         const result = await action();
//         setResult(result);
//         setLoading(false);
//     };
//
//     useEffect(() => {
//         internalLoad();
//     }, []);
//
//     return [result, loading, internalLoad] as const;
// }
