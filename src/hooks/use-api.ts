import { useEffect, useState } from 'react';
import { AppState, useMutate, useSelector } from '../redux/reducer';

type UnPromisify<T> = T extends Promise<infer U> ? U:T;

type SelectorFun = (state: AppState) => any;
type MutatorFun = (state: AppState, value: any) => void;

export function useApi<A extends (...args: any) => any>(selectorFun: SelectorFun, mutatorFun: MutatorFun, action: A, ...defArgs: Parameters<A>) {
    const allState = useSelector(state => state);
    const selectedState = useSelector(selectorFun);
    const mutate = useMutate()

    const [data, setData] = useState(selectedState);//undefined as UnPromisify<ReturnType<A>>);
    const [loading, setLoading] = useState(selectorFun === undefined);
    // const [hot, setHot] = useState(100);


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
        // console.log("useApi useEffect");
        // console.log("----- useApi useEffect loading", loading);
        // console.log("----- useApi useEffect hot", hot);
        // if (hot === 100) {
        //     setHot(200);
            // console.log("==> USE EFFECT IN useApi", name)
        if (selectedState === undefined) {
            load(...defArgs);
        } else {
            console.log("useApi has cached all", allState);
            console.log("useApi has cached value", selectedState);
        }
        // }
    }, []);

    return {data, loading, refetch, reload};
}

