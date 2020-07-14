import {useEffect, useRef, useState} from 'react';
import { AppState, useMutate, useSelector } from '../redux/reducer';
import {sleep} from "../helper/util";

type UnPromisify<T> = T extends Promise<infer U> ? U:T;

type ReloadPredicate = () => boolean;
type SelectorFun = (state: AppState) => any;
type MutatorFun = (state: AppState, value: any) => void;

export function useCachedConservedLazyApi<A extends (...args: any) => any>(dep: any, reloadPredicate: ReloadPredicate, selectorFun: SelectorFun, mutatorFun: MutatorFun, action: A, ...defArgs: Parameters<A>) {
    const [data, setData] = useState(null as UnPromisify<ReturnType<A>>);
    const selectedState = useSelector(selectorFun) as UnPromisify<ReturnType<A>>;
    const mutate = useMutate()

    const [loading, setLoading] = useState(selectorFun === undefined);
    const mountedRef = useRef(true);

    const load = async (...args: Parameters<A>) => {
        if (!mountedRef.current) {
            console.log('unmounted1');
            return null;
        }

        setLoading(true);

        // If load is called in useEffect() it may be run synchronously if action is an synchronous function.
        // So we call an async function to force running asynchronously.
        await sleep(1000);

        const data = await action(...args);

        if (!mountedRef.current) {
            console.log('unmounted2');
            return null;
        }

        mutate(state => {
            mutatorFun(state, data);
        });
        setData(data);

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

        console.log("==> RELOAD TRY");
        if (selectedState === undefined && reloadPredicate()) {
            console.log("==> RELOAD");
            load(...defArgs);
        }

        return () => {
            mountedRef.current = false;
        };
    }, dep);

    console.log('API SelectedState', selectedState);
    console.log('API data', data);

    return {data: selectedState !== undefined ? selectedState : data, loading, refetch, reload, init};
}

