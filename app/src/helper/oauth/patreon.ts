
export function getPatreonLoginUrl() {
    const queryString = new URLSearchParams({
        response_type: 'code',
        client_id: 'jsn5ztplpiU4BZ1PxAzOnK5ZyXti69KhEFGQpZSNCt2ahACRi1LMo6kMKmxLFVmn',
        // redirect_uri: `${getHost('aoe2companion')}auth/link/patreon`,
        redirect_uri: `https://www.aoe2companion.com/auth/link/patreon`,
        scope: 'identity identity.memberships',
        allow_signup: 'false',
    }).toString();

    return `https://www.patreon.com/oauth2/authorize?${queryString}`;
}
