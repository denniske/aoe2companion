import { AsyncStorage } from 'react-native';
import { sleep } from '../helper/util';
import {composeUserId, sameUser} from "../helper/user";
import {Flag} from "../helper/flags";
import {IPlayerListPlayer} from "../view/components/player-list";

export interface ISettings {
    steam_id: string;
    profile_id: number;
}

export interface IFollowingEntry {
    id?: string;
    steam_id?: string;
    profile_id?: number;
    name: string;
    games: number;
    country: Flag;
}


export const loadSettingsFromStorage = async () => {
    // console.log("RETRIEVING JSON settings...");
    // await sleep(2000);
    const entry = await AsyncStorage.getItem('settings');
    // console.log("RETRIEVED JSON settings", entry);
    if (entry == null) {
        return null;
    }
    return JSON.parse(entry) as ISettings;
    // return {
    //     steam_id: new Date(),
    //     profile_id: 1,
    // }
};

export const loadFollowingFromStorage = async () => {
    const entry = await AsyncStorage.getItem('following');
    if (entry == null) {
        return [];
    }
    return JSON.parse(entry) as IFollowingEntry[];
};

export const saveFollowingToStorage = async (following: IFollowingEntry[]) => {
    await AsyncStorage.setItem('following', JSON.stringify(following));
};

export const toggleFollowingInStorage = async (user: IPlayerListPlayer) => {
    const following = await loadFollowingFromStorage();
    const index = following.findIndex(f => sameUser(f, user));
    if (index > -1) {
        following.splice(index, 1);
    } else {
        if (following.length >= 5) {
            alert('You can follow a maxmium of 2 users. Unfollow a user first to follow a new one.');
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
    console.log("MODIFIED FOLLOWING", following);
    await saveFollowingToStorage(following);
    return following;
};
