import { makeQueryString } from '@nex/data';

export function getSteamLoginUrl() {
    // let realm = getHost('aoe2companion');
    // let returnUrl = `${getHost('aoe2companion')}auth/link/steam`;
    let realm = `https://www.aoe2companion.com`;
    let returnUrl = `https://www.aoe2companion.com/auth/link/steam`;

    let match = realm.match(/^(https?:\/\/[^:/]+)/);
    if (!match) {
        throw new Error(`"${realm}" does not appear to be a valid realm`);
    }
    realm = match[1].toLowerCase();

    let queryString = makeQueryString({
        'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
        'openid.mode': 'checkid_setup',
        'openid.ns': 'http://specs.openid.net/auth/2.0',
        'openid.realm': realm,
        'openid.return_to': returnUrl,
    });

    return 'https://steamcommunity.com/openid/login?' + queryString;
}
