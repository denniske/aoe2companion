import {useEffect, useRef, useState} from 'react';
import { AppState, useMutate, useSelector } from '../redux/reducer';

type UnPromisify<T> = T extends Promise<infer U> ? U:T;

type SelectorFun = (state: AppState) => any;
type MutatorFun = (state: AppState, value: any) => void;

export function useCachedLazyApi<A extends (...args: any) => any>(dep: any, selectorFun: SelectorFun, mutatorFun: MutatorFun, action: A, ...defArgs: Parameters<A>) {
    const selectedState = useSelector(selectorFun) as UnPromisify<ReturnType<A>>;
    const mutate = useMutate()

    // const [data, setData] = useState(selectedState);
    const [loading, setLoading] = useState(selectorFun === undefined);
    const mountedRef = useRef(true);

    const load = async (...args: Parameters<A>) => {
        if (!mountedRef.current) {
            console.log('unmounted1');
            return null;
        }

        setLoading(true);
        const data = await action(...args);

        if (!mountedRef.current) {
            console.log('unmounted2');
            return null;
        }

        // setData(data);

        mutate(state => {
            mutatorFun(state, data);
        });

        setLoading(false);
    };

    const reload = async () => {
        await load(...defArgs);
    }

    const refetch = async (...args: Parameters<A>) => {
        await load(...args);
    }

    const init = async (...args: Parameters<A>) => {
        if (selectedState === undefined) {
            // console.log("useApi wants to load", defArgs);
            console.log("==> CACHED LAZY LOAD");
            await load(...args);
        } else {
            console.log("==> CACHED LAZY INIT");
            // console.log("useApi has cached all", allState);
            // console.log("useApi has cached value", selectedState);
        }
    };

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, dep);

    return {data: selectedState, loading, refetch, reload, init};
}

