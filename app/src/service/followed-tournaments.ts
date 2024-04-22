import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { compact } from 'lodash';
import { useEffect, useState } from 'react';

type FolllowedId = string;
export const useFollowedTournaments = () => {
    const { getItem, setItem } = useAsyncStorage('followedTournaments');
    const [followedIds, setFollowedIds] = useState<FolllowedId[]>([]);

    const readItemFromStorage = async () => {
        const item = await getItem();
        if (item) {
            setFollowedIds(JSON.parse(item));
        } else {
            setFollowedIds([]);
        }
    };

    const writeItemToStorage = async (newValue: FolllowedId[]) => {
        await setItem(JSON.stringify(newValue));
        setFollowedIds(newValue);
    };

    useEffect(() => {
        readItemFromStorage();
    }, []);

    const toggleFollow = (id: FolllowedId) => {
        if (followedIds.includes(id)) {
            writeItemToStorage(followedIds.filter((followedId) => followedId !== id));
        } else {
            writeItemToStorage([...followedIds, id]);
        }
    };

    return {
        toggleFollow,
        followedIds: compact(followedIds),
        refetch: readItemFromStorage,
    };
};

export const useFollowedTournament = (id: FolllowedId) => {
    const { followedIds, toggleFollow } = useFollowedTournaments();

    return {
        toggleFollow: () => toggleFollow(id),
        isFollowed: followedIds.includes(id),
    };
};
