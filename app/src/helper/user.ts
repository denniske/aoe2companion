
export interface UserIdBase {
    steamId?: string;
    profileId?: number;
}

export interface UserId extends UserIdBase {
    id: string;
}

export interface UserInfo extends UserId {
    name: string;
}

export interface UserIdBaseWithName extends UserIdBase {
    name: string;
}

export function parseUserId(str: string): UserId {
    let parts = str.split('-');
    if (parts.length != 2) {
        // Long ids are steam ids
        if (str.length >= 12) {
            parts = ['null', str];
        } else {
            parts = [str, 'null'];
        }
    }
    const parsedUserBase = {
        profileId: (parts[0] === 'null' || parts[0] === 'undefined') ? undefined : parseInt(parts[0]),
        steamId: (parts[1] === 'null' || parts[1] === 'undefined') ? undefined : parts[1],
    };
    return userIdFromBase(parsedUserBase);
}

export function userIdFromBase(base: UserIdBase): UserId {
    return {
        steamId: base.steamId,
        profileId: base.profileId,
        id: composeUserId(base),
    };
}

export function composeUserId(id: UserIdBase): string {
    if (id.steamId) {
        return id.profileId + '-' + id.steamId;
    }
    return `${id.profileId}`;
}

export function minifyUserId(id: UserIdBase): UserIdBase {
    // if (id.steamId) {
    //     return {
    //         steamId: id.steamId,
    //     };
    // }
    return {
        profileId: id.profileId,
    };
}

export function composeUserIdFromParts(steamId?: string, profileId?: number): string {
    if (steamId) {
        return profileId + '-' + steamId;
    }
    return `${profileId}`;
}

export function userIdEmpty(userId: UserIdBase) {
    return userId.steamId != null || userId.profileId != null;
}

export function sameUser(userA: UserIdBase, userB: UserIdBase) {
   return (
       (userA.steamId != null && userB.steamId != null && userA.steamId === userB.steamId) ||
       (userA.profileId != null && userB.profileId != null && userA.profileId === userB.profileId)
   );
}

export function sameUserNull(userA?: UserIdBase | null, userB?: UserIdBase | null) {
   return (
       (userA?.steamId != null && userB?.steamId != null && userA.steamId === userB.steamId) ||
       (userA?.profileId != null && userB?.profileId != null && userA.profileId === userB.profileId)
   );
}
