import {useEffect, useRef, useState} from 'react';
import { AppState, useMutate, useSelector } from '../redux/reducer';

type UnPromisify<T> = T extends Promise<infer U> ? U:T;

type SelectorFun = (state: AppState) => any;
type MutatorFun = (state: AppState, value: any) => void;

export function useApi<A extends (...args: any) => any>(dep: any, selectorFun: SelectorFun, mutatorFun: MutatorFun, action: A, ...defArgs: Parameters<A>) {
    const allState = useSelector(state => state);
    const selectedState = useSelector(selectorFun);
    const mutate = useMutate()

    const [data, setData] = useState(selectedState);
    const [loading, setLoading] = useState(selectorFun === undefined);
    const mountedRef = useRef(true);

    const load = async (...args: Parameters<A>) => {
        setLoading(true);
        const data = await action(...args);

        if (!mountedRef.current) {
            // console.log("useApi aborted due to unmount");
            return null;
        }

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
        if (selectedState === undefined) {
            console.log("useApi wants to load", defArgs);
            load(...defArgs);
        } else {
            console.log("useApi has cached all", allState);
            console.log("useApi has cached value", selectedState);
        }
        return () => {
            mountedRef.current = false;
        };
    }, dep);

    return {data, loading, refetch, reload};
}

