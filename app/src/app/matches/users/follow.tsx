import { IProfilesResultProfile } from '@app/api/helper/api.types';
import { Button } from '@app/components/button';
import { getTranslation } from '@app/helper/translate';
import { setFollowing, useMutate, useSelector } from '@app/redux/reducer';
import { toggleFollowing } from '@app/service/following';
import { IPlayerListPlayer } from '@app/view/components/player-list';
import Search from '@app/view/components/search';
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Follow() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: 'Follow Player' });
    }, [navigation]);

    return (
        <Search
            selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}`)}
            action={(user: IProfilesResultProfile) => <FeedAction user={user} />}
        />
    );
}

function FeedAction({ user }: { user: IPlayerListPlayer }) {
    const mutate = useMutate();
    const following = useSelector((state) => state.following);
    const auth = useSelector((state) => state.auth);
    const isMe = auth?.profileId === user.profileId;
    const followingThisUser = following.find((f) => f.profileId === user.profileId);
    const [loading, setLoading] = useState(false);

    const onSelect = async () => {
        setLoading(true);
        try {
            const following = await toggleFollowing(user);
            if (following) {
                mutate(setFollowing(following));
            }
        } catch (e) {
            alert(getTranslation('feed.follow.error') + '\n\n' + e);
        }
        setLoading(false);
    };

    return (
        <Button onPress={onSelect} disabled={loading || isMe} size="small">
            {isMe
                ? getTranslation('feed.following.you')
                : followingThisUser
                  ? getTranslation('feed.follow.unfollow')
                  : getTranslation('feed.follow.follow')}
        </Button>
    );
}
