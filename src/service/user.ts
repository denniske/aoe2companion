
export interface UserId {
    steam_id: string;
    profile_id: number;
}

export function parseUserId(str: string): UserId {
    const parts = str.split('-');
    return {
        steam_id: parts[0],
        profile_id: parseInt(parts[1]),
    };
}

export function printUserId(id: UserId): string {
    return id.steam_id + '-' + id.profile_id;
}
