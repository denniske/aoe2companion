import {fetchJson} from "./util";
import { getHost, makeQueryString } from '@nex/data';
import { supabaseClient } from '../../../data/src/helper/supabase';


export async function fetchAccount(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account`;

    const session = await supabaseClient.auth.getSession();

    const data = {

    };

    return await fetchJson('account', url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}

export async function accountUnlinkSteam(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/unlink/steam`;

    const session = await supabaseClient.auth.getSession();

    const data = {

    };

    return await fetchJson('accountUnlinkSteam', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}

export async function accountUnlinkPatreon(): Promise<any> {
    const url = getHost('aoe2companion-api') + `v2/account/unlink/patreon`;

    const session = await supabaseClient.auth.getSession();

    const data = {

    };

    return await fetchJson('accountUnlinkPatreon', url, {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}

export async function authLinkSteam(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/link/steam?${makeQueryString(params)}`;

    const session = await supabaseClient.auth.getSession();

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}


export async function authLinkPatreon(params: any): Promise<any> {
    const url = getHost('aoe2companion-api') + `auth/link/patreon?${makeQueryString(params)}`;

    const session = await supabaseClient.auth.getSession();

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${session?.data?.session?.access_token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(data),
    });
}
