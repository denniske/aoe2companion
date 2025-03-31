
export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

interface IParams {
    [key: string]: any;
}

export function removeReactQueryParams(params: any) {
    const {queryKey, pageParam, meta, signal, ...rest} = params;
    return rest;
}

export function makeQueryString(params: IParams) {
    return  new URLSearchParams(params).toString();
    // return Object.keys(params)
    //     .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    //     .join('&');
}
