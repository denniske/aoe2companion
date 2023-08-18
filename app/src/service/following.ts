import {IPlayerListPlayer} from "../view/components/player-list";
import {loadFollowingFromStorage, saveFollowingToStorage} from "./storage";
import {follow, unfollow} from "../api/following";
import store from "../redux/store";
import {time} from "@nex/data";

const maxFollowing = 75;

export const toggleFollowing = async (user: IPlayerListPlayer) => {
    time(1);
    const pushNotificationsEnabled = store.getState().config?.pushNotificationsEnabled || false;
    const account_id = store.getState().account!.id;

    const following = await loadFollowingFromStorage();
    const index = following.findIndex(f => f.profileId, user.profileId);
    if (index > -1) {
        await unfollow(account_id, [user.profileId]);
    } else {
        if (following.length >= maxFollowing) {
            alert(`You can follow a maximum of ${maxFollowing} users. Unfollow a user first to follow a new one.`);
            return;
        }
        await follow(account_id, [user.profileId], pushNotificationsEnabled);
    }

    const following2 = await loadFollowingFromStorage();
    const index2 = following2.findIndex(f => f.profileId === user.profileId);
    if (index2 > -1) {
        following2.splice(index2, 1);
    } else {
        following2.push({
            steam_id: user.steamId,
            profileId: user.profileId,
            profile_id: user.profileId,
            name: user.name,
            games: user.games,
            country: user.country,
        });
    }
    await saveFollowingToStorage(following2);
    return following2;
};
