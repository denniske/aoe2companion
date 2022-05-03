
export interface UserIdBase {
    steam_id?: string;
    profile_id?: number;
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
        profile_id: (parts[0] === 'null' || parts[0] === 'undefined') ? undefined : parseInt(parts[0]),
        steam_id: (parts[1] === 'null' || parts[1] === 'undefined') ? undefined : parts[1],
    };
    return userIdFromBase(parsedUserBase);
}

export function userIdFromBase(base: UserIdBase): UserId {
    return {
        steam_id: base.steam_id,
        profile_id: base.profile_id,
        id: composeUserId(base),
    };
}

export function composeUserId(id: UserIdBase): string {
    if (id.steam_id) {
        return id.profile_id + '-' + id.steam_id;
    }
    return `${id.profile_id}`;
}

export function minifyUserId(id: UserIdBase): UserIdBase {
    // if (id.steam_id) {
    //     return {
    //         steam_id: id.steam_id,
    //     };
    // }
    return {
        profile_id: id.profile_id,
    };
}

export function composeUserIdFromParts(steam_id?: string, profile_id?: number): string {
    if (steam_id) {
        return profile_id + '-' + steam_id;
    }
    return `${profile_id}`;
}

export function userIdEmpty(userId: UserIdBase) {
    return userId.steam_id != null || userId.profile_id != null;
}

export function sameUser(userA: UserIdBase, userB: UserIdBase) {
   return (
       (userA.steam_id != null && userB.steam_id != null && userA.steam_id === userB.steam_id) ||
       (userA.profile_id != null && userB.profile_id != null && userA.profile_id === userB.profile_id)
   );
}

export function sameUserNull(userA?: UserIdBase | null, userB?: UserIdBase | null) {
   return (
       (userA?.steam_id != null && userB?.steam_id != null && userA.steam_id === userB.steam_id) ||
       (userA?.profile_id != null && userB?.profile_id != null && userA.profile_id === userB.profile_id)
   );
}
