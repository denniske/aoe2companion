import {getHost} from './host';
import {IFollowingEntry} from "../service/storage";


export async function follow(account_id: string, token_profile_id: number | undefined, following: IFollowingEntry[], enabled: boolean): Promise<any> {
    const url = getHost('aoe2companion-api') + `following`;
    console.log(url);
    const data = {
        account_id,
        token_profile_id,
        enabled,
        following,
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
