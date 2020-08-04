import {IPlayerListPlayer} from "../view/components/player-list";
import {composeUserId, sameUser} from "../helper/user";
import {loadFollowingFromStorage, saveFollowingToStorage} from "./storage";
import {follow} from "../api/following";
import {getToken} from "./push";
import store from "../redux/store";
import {time} from "../helper/util";

const maxFollowing = 5;

export const toggleFollowing = async (user: IPlayerListPlayer) => {
    time(1);
    const pushNotificationsEnabled = store.getState().config?.pushNotificationsEnabled || false;
    const profile_id = store.getState().auth?.profile_id;
    const account_id = store.getState().account!.id;

    await follow(account_id, profile_id, following, pushNotificationsEnabled);

    const following = await loadFollowingFromStorage();
    const index = following.findIndex(f => sameUser(f, user));
    if (index > -1) {
        following.splice(index, 1);
    } else {
        if (following.length >= maxFollowing) {
            alert(`You can follow a maxmium of ${maxFollowing} users. Unfollow a user first to follow a new one.`);
            return;
        }
        following.push({
            id: composeUserId(user),
            steam_id: user.steam_id,
            profile_id: user.profile_id,
            name: user.name,
            games: user.games,
            country: user.country,
        });
    }

    await saveFollowingToStorage(following);
    return following;
};
