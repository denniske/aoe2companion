import { setAccountProfile } from '@app/api/following';
import { setAuth, useMutate, useSelector } from '@app/redux/reducer';
import { saveSettingsToStorage } from '@app/service/storage';
import Search from '@app/view/components/search';
import { Stack, router } from 'expo-router';

const SelectProfilePage = () => {
    const mutate = useMutate();
    const account = useSelector((state) => state.account);

    const onSelect = async (user: any) => {
        await saveSettingsToStorage({
            profileId: user.profileId,
        });
        mutate(setAuth(user));
        setAccountProfile(account.id, { profile_id: user.profileId!, steam_id: user.steamId });
        router.navigate(`/matches/users/${user.profileId!}`);
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Find My Account' }} />
            <Search title="Enter your AoE username to track your games" selectedUser={onSelect} actionText="Choose" />
        </>
    );
};

export default SelectProfilePage;
