import {useEffect, useRef, useState} from 'react';

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

type UnPromisify<T> = T extends Promise<infer U> ? U : T;

interface ILazyApiOptions<A extends (...args: any) => any> {
  append?: (data: UnPromisify<ReturnType<A>>, newData: UnPromisify<ReturnType<A>>, args: Parameters<A>) => UnPromisify<ReturnType<A>>;
}

export function useLazyApi<A extends (...args: any) => any>(options: ILazyApiOptions<A>, action: A, ...defArgs: Parameters<A>) {
  const [data, setData] = useState(null as UnPromisify<ReturnType<A>>);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState(false);
  const [lastParams, setLastParams] = useState(null as any);
  const mountedRef = useRef(true);

  const load = async (append: boolean, ...args: Parameters<A>) => {
    if (!mountedRef.current) return null;

    setLoading(true);
    setLastParams(args);

    // If load is called in useEffect() it may be run synchronously if action is an synchronous function.
    // So we call an async function to force running asynchronously.
    await sleep(0);

    try {
      let newData = await action(...args) as UnPromisify<ReturnType<A>>;

      if (append) {
        if (!options.append) throw new Error('options.append not defined');
        newData = options.append(data, newData, args);
      }

      if (!mountedRef.current) return null;

      setData(newData);
      setLoading(false);
      setTouched(true);
      setError(false);

      return newData;
    } catch (e) {
      console.warn(e);
      setError(true);
      return null;
    }
  };

  const reset = () => {
    setData(null as UnPromisify<ReturnType<A>>);
    setTouched(false);
  }

  const reload = async () => {
    await load(false, ...defArgs);
  }

  const refetch = async (...args: Parameters<A>) => {
    return await load(false, ...args);
  }

  const refetchAppend = async (...args: Parameters<A>) => {
    return await load(true, ...args);
  }

  useEffect(() => {
    mountedRef.current = true;
    load(false, ...defArgs);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {touched, data, loading, refetch, reload, reset, error, lastParams, refetchAppend};
}
