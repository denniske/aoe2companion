import { IProfilesResultProfile } from '@app/api/helper/api.types';
import { Button } from '@app/components/button';
import { IPlayerListPlayer } from '@app/view/components/player-list';
import Search from '@app/view/components/search';
import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useAccount, useAuthProfileId } from '@app/queries/all';
import { useFollowMutation } from '@app/mutations/follow';
import { useUnfollowMutation } from '@app/mutations/unfollow';
import { useTranslation } from '@app/helper/translate';
import { showAlert } from '@app/helper/alert';
import { UserLoginWrapper } from '@app/components/user-login-wrapper';

export default function Follow() {
    const getTranslation = useTranslation();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: getTranslation('matches.follow.title') });
    }, [navigation]);

    return (
        <Search
            selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}`)}
            action={(user: IProfilesResultProfile) => <FeedAction user={user} />}
        />
    );
}

function FeedAction({ user }: { user: IPlayerListPlayer }) {
    const getTranslation = useTranslation();
    const authProfileId = useAuthProfileId();
    const isMe = authProfileId === user.profileId;

    const { data: account } = useAccount();
    const followingThisUser = !!account?.followedPlayers.find((f) => f.profileId === user.profileId);

    const followMutation = useFollowMutation();
    const unfollowMutation = useUnfollowMutation();

    const onSelect = async () => {
        try {
            if (followingThisUser) {
                await unfollowMutation.mutateAsync([user.profileId]);
            } else {
                await followMutation.mutateAsync([user.profileId]);
            }
        } catch (e) {
            console.error(e);
            showAlert(getTranslation('feed.follow.error') + '\n\n' + e);
        }
    };

    return (
        <UserLoginWrapper Component={Button} onPress={onSelect} disabled={isMe} size="small">
            {isMe
                ? getTranslation('feed.following.you')
                : followingThisUser
                ? getTranslation('feed.follow.unfollow')
                : getTranslation('feed.follow.follow')}
        </UserLoginWrapper>
    );
}
