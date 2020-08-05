import {getHost} from './host';
import {sleep} from "../helper/util";


export async function follow(account_id: string, profile_ids: number[], enabled: boolean): Promise<any> {
    const url = getHost('aoe2companion-api') + `follow`;
    console.log(url);

    // await sleep(3000);

    const data = {
        account_id,
        profile_ids,
        enabled,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })

    // console.log("following response", response);

    const json = await response.json() as any;
    // console.log("following json", json);

    return json;
}

export async function unfollow(account_id: string, profile_ids: number[]): Promise<any> {
    const url = getHost('aoe2companion-api') + `unfollow`;
    console.log(url);

    // await sleep(3000);

    const data = {
        account_id,
        profile_ids,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })

    // console.log("following response", response);

    const json = await response.json() as any;
    // console.log("following json", json);

    return json;
}

export async function setAccountPushToken(account_id: string, push_token: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/push_token`;
    console.log(url);

    // await sleep(3000);

    const data = {
        account_id,
        push_token,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })

    // console.log("following response", response);

    const json = await response.json() as any;
    // console.log("following json", json);

    return json;
}

export async function setAccountProfile(account_id: string, profile_id: number, steam_id?: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/profile`;
    console.log(url);

    // await sleep(3000);

    const data = {
        account_id,
        profile_id,
        steam_id,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })

    // console.log("following response", response);

    const json = await response.json() as any;
    // console.log("following json", json);

    return json;
}

export async function setNotificationConfig(account_id: string, push_enabled: boolean): Promise<any> {
    const url = getHost('aoe2companion-api') + `notification/config`;
    console.log(url);

    // await sleep(3000);

    const data = {
        account_id,
        push_enabled,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })

    // console.log("following response", response);

    const json = await response.json() as any;
    // console.log("following json", json);

    return json;
}
