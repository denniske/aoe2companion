import { sleep } from '@nex/data';
import { useEffect, useRef, useState } from 'react';

import { AppState, useMutate, useSelector } from '../redux/reducer';

type UnPromisify<T> = T extends Promise<infer U> ? U : T;

type SelectorFun = (state: AppState) => any;
type MutatorFun = (state: AppState, value: any) => void;

interface ILazyApiOptions<A extends (...args: any) => any> {
    append?: (data: UnPromisify<ReturnType<A>>, newData: UnPromisify<ReturnType<A>>) => UnPromisify<ReturnType<A>>;
    enabled?: boolean;
}

export function useApi<A extends (...args: any) => any>(
    { enabled = true, ...options }: ILazyApiOptions<A>,
    dep: any[],
    selectorFun: SelectorFun,
    mutatorFun: MutatorFun,
    action: A,
    ...defArgs: Parameters<A>
) {
    const selectedState = useSelector(selectorFun) as UnPromisify<ReturnType<A>>;
    const mutate = useMutate();

    // const [data, setData] = useState(selectedState);
    const [loading, setLoading] = useState(selectorFun === undefined);
    const mountedRef = useRef(true);

    const load = async (append: boolean, ...args: Parameters<A>) => {
        if (!mountedRef.current) {
            console.log('unmounted1');
            return null;
        }

        setLoading(true);

        // If load is called in useEffect() it may be run synchronously if action is an synchronous function.
        // So we call an async function to force running asynchronously.
        await sleep(0);

        // console.log('==> load', args);
        let newData = (await action(...(args as any))) as UnPromisify<ReturnType<A>>;

        if (!mountedRef.current) {
            console.log('unmounted2');
            return null;
        }

        if (append) {
            if (!options.append) throw new Error('options.append not defined');
            newData = options.append(selectedState, newData);
        }

        mutate((state) => {
            mutatorFun(state, newData);
        });

        setLoading(false);

        return newData;
    };

    const reload = async () => {
        await load(false, ...defArgs);
    };

    const refetch = async (...args: Parameters<A>) => {
        return await load(false, ...args);
    };

    const refetchAppend = async (...args: Parameters<A>) => {
        return await load(true, ...args);
    };

    useEffect(() => {
        mountedRef.current = true;

        if (selectedState === undefined && enabled) {
            // console.log('useApi wants to load', defArgs);
            load(false, ...defArgs);
        } else {
            // console.log("useApi has cached all", allState);
            // console.log("useApi has cached value", selectedState);
        }
        return () => {
            mountedRef.current = false;
        };
    }, [...dep, enabled]);

    return { data: selectedState, loading, refetch, reload, refetchAppend };
}
