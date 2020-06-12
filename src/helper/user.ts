
export interface UserId {
    id: string;
    steam_id: string;
    profile_id: number;
}

export function parseUserId(str: string): UserId {
    const parts = str.split('-');
    return {
        id: str,
        steam_id: parts[0],
        profile_id: parseInt(parts[1]),
    };
}

export function composeUserId(id: UserId): string {
    return id.steam_id + '-' + id.profile_id;
}

export function composeUserIdFromParts(steam_id: string, profile_id: number): string {
    return steam_id + '-' + profile_id;
}
