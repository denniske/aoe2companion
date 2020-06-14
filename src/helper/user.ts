
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

export function parseUserId(str: string): UserId {
    const parts = str.split('-');
    return {
        id: str,
        steam_id: parts[0] === 'null' ? undefined : parts[0],
        profile_id: parts[1] === 'null' ? undefined : parseInt(parts[1]),
    };
}

export function userIdFromBase(base: UserIdBase): UserId {
    return {
        ...base,
        id: composeUserId(base),
    };
}

export function composeUserId(id: UserIdBase): string {
    return id.steam_id + '-' + id.profile_id;
}

export function minifyUserId(id: UserIdBase): UserIdBase {
    if (id.steam_id) {
        return {
            steam_id: id.steam_id,
        };
    }
    return {
        profile_id: id.profile_id,
    };
}

export function composeUserIdFromParts(steam_id: string, profile_id: number): string {
    return steam_id + '-' + profile_id;
}

export function userIdEmpty(userId: UserIdBase) {
    return userId.steam_id != null || userId.profile_id != null;
}
