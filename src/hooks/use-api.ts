import { useEffect, useState } from 'react';

type UnPromisify<T> = T extends Promise<infer U> ? U:T;

export function useApi<A extends (...args: any) => any>(action: A, ...defArgs: Parameters<A>) {
    const [data, setData] = useState(null as UnPromisify<ReturnType<A>>);
    const [loading, setLoading] = useState(true);
    const [hot, setHot] = useState(100);



    console.log("----- useApi loading", loading);
    // console.log("----- useApi2 loading2", loading2);
    // console.log("----- useApi2 data == null", data == null);


    const load = async (...args: Parameters<A>) => {
        setLoading(true);
        const data = await action(...args);
        setData(data);
        setLoading(false);
    };

    const reload = () => {
        load(...defArgs);
    }

    const refetch = (...args: Parameters<A>) => {
        load(...args);
    }


    useEffect(() => {
        console.log("----- useApi useEffect loading", loading);
        console.log("----- useApi useEffect hot", hot);
        // if (hot === 100) {
            setHot(200);
            console.log("==> USE EFFECT IN useApi", name)
            load(...defArgs);
        // }
    }, []);

    return {data, loading, refetch, reload};
}
