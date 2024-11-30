import { IProfilesResultProfile } from '@app/api/helper/api.types';
import { Button } from '@app/components/button';
import { getTranslation } from '@app/helper/translate';
import { setFollowing, useMutate, useSelector } from '@app/redux/reducer';
import { IPlayerListPlayer } from '@app/view/components/player-list';
import Search from '@app/view/components/search';
import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAccount } from '@app/app/_layout';
import { useFollowMutation } from '@app/mutations/follow';
import { useUnfollowMutation } from '@app/mutations/unfollow';

export default function Follow() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: 'Follow Player' });
    }, [navigation]);

    return (
        <Search
            selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}?name=${user.name}&country=${user.country}`)}
            action={(user: IProfilesResultProfile) => <FeedAction user={user} />}
        />
    );
}

function FeedAction({ user }: { user: IPlayerListPlayer }) {
    const auth = useSelector((state) => state.auth);
    const isMe = auth?.profileId === user.profileId;

    const { data: account } = useAccount();
    const followingThisUser = !!account?.followedPlayers.find((f) => f.profileId === user.profileId);

    const followMutation = useFollowMutation();
    const unfollowMutation = useUnfollowMutation();

    const onSelect = async () => {
        try {
            if (followingThisUser) {
                await unfollowMutation.mutateAsync(user.profileId);
            } else {
                await followMutation.mutateAsync(user.profileId);
            }
        } catch (e) {
            alert(getTranslation('feed.follow.error') + '\n\n' + e);
        }
    };

    return (
        <Button onPress={onSelect} disabled={isMe} size="small">
            {isMe
                ? getTranslation('feed.following.you')
                : followingThisUser
                  ? getTranslation('feed.follow.unfollow')
                  : getTranslation('feed.follow.follow')}
        </Button>
    );
}
