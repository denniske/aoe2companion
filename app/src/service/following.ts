import {IPlayerListPlayer} from "../view/components/player-list";
import {composeUserId, sameUser} from "../helper/user";
import {loadFollowingFromStorage, saveFollowingToStorage} from "./storage";
import {follow, unfollow} from "../api/following";
import store from "../redux/store";
import {time} from "../../../data/src/helper/util";

const maxFollowing = 30;

export const toggleFollowing = async (user: IPlayerListPlayer) => {
    time(1);
    const pushNotificationsEnabled = store.getState().config?.pushNotificationsEnabled || false;
    const account_id = store.getState().account!.id;

    const following = await loadFollowingFromStorage();
    const index = following.findIndex(f => sameUser(f, user));
    if (index > -1) {
        await unfollow(account_id, [user.profile_id]);
    } else {
        if (following.length >= maxFollowing) {
            alert(`You can follow a maxmium of ${maxFollowing} users. Unfollow a user first to follow a new one.`);
            return;
        }
        await follow(account_id, [user.profile_id], pushNotificationsEnabled);
    }

    const following2 = await loadFollowingFromStorage();
    const index2 = following2.findIndex(f => sameUser(f, user));
    if (index2 > -1) {
        following2.splice(index2, 1);
    } else {
        following2.push({
            id: composeUserId(user),
            steam_id: user.steam_id,
            profile_id: user.profile_id,
            name: user.name,
            games: user.games,
            country: user.country,
        });
    }
    await saveFollowingToStorage(following2);
    return following2;
};
