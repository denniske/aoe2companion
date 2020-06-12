import { useEffect, useState } from 'react';
import { AppState, useMutate, useSelector } from '../redux/reducer';

type UnPromisify<T> = T extends Promise<infer U> ? U:T;

type SelectorFun = (state: AppState) => any;
type MutatorFun = (state: AppState, value: any) => void;

export function useApi<A extends (...args: any) => any>(selectorFun: SelectorFun, mutatorFun: MutatorFun, action: A, ...defArgs: Parameters<A>) {
    const [data, setData] = useState(undefined as UnPromisify<ReturnType<A>>);
    const [loading, setLoading] = useState(true);
    const [hot, setHot] = useState(100);

    const selectedState = useSelector(selectorFun);
    const mutate = useMutate()

    // console.log("----- useApi loading", loading);
    // console.log("----- useApi2 loading2", loading2);
    // console.log("----- useApi2 data == null", data == null);



    const load = async (...args: Parameters<A>) => {
        setLoading(true);
        const data = await action(...args);

        setData(data);

        mutate(state => {
            mutatorFun(state, data);
        });

        setLoading(false);
    };

    const reload = () => {
        load(...defArgs);
    }

    const refetch = (...args: Parameters<A>) => {
        load(...args);
    }


    useEffect(() => {
        // console.log("----- useApi useEffect loading", loading);
        // console.log("----- useApi useEffect hot", hot);
        // if (hot === 100) {
            setHot(200);
            // console.log("==> USE EFFECT IN useApi", name)
        if (selectedState === undefined) {
            load(...defArgs);
        } else {
            console.log("useApi has cached value", selectedState);
        }
        // }
    }, []);

    return {data, loading, refetch, reload};
}

