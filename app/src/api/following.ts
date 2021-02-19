import {getHost} from './host';
import {fetchJson} from "./util";


export async function follow(account_id: string, profile_ids: number[], enabled: boolean): Promise<any> {
    const url = getHost('aoe2companion-api') + `follow`;

    const data = {
        account_id,
        profile_ids,
        enabled,
    };

    return await fetchJson('follow', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
}

export async function unfollow(account_id: string, profile_ids: number[]): Promise<any> {
    const url = getHost('aoe2companion-api') + `unfollow`;

    const data = {
        account_id,
        profile_ids,
    };

    return await fetchJson('unfollow', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function setAccountPushToken(account_id: string, push_token: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/push_token`;

    const data = {
        account_id,
        push_token,
    };

    return await fetchJson('setAccountPushToken', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function setAccountPushTokenWeb(account_id: string, push_token_web: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/push_token_web`;

    const data = {
        account_id,
        push_token_web,
    };

    return await fetchJson('setAccountPushTokenWeb', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function setAccountPushTokenElectron(account_id: string, push_token_electron: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/push_token_electron`;

    const data = {
        account_id,
        push_token_electron,
    };

    return await fetchJson('setAccountPushTokenElectron', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function sendTestPushNotificationWeb(push_token_web: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `notification/send_test_web`;

    const data = {
        push_token_web,
    };

    return await fetchJson('sendTestPushNotificationWeb', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function sendTestPushNotificationElectron(push_token_electron: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `notification/send_test_electron`;

    const data = {
        push_token_electron: push_token_electron,
    };

    return await fetchJson('sendTestPushNotificationElectron', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function setAccountProfile(account_id: string, profile_id: number, steam_id?: string): Promise<any> {
    const url = getHost('aoe2companion-api') + `account/profile`;

    const data = {
        account_id,
        profile_id,
        steam_id,
    };

    return await fetchJson('setAccountProfile', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}

export async function setNotificationConfig(account_id: string, push_enabled: boolean): Promise<any> {
    const url = getHost('aoe2companion-api') + `notification/config`;

    const data = {
        account_id,
        push_enabled,
    };

    return await fetchJson('setNotificationConfig', url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
}
