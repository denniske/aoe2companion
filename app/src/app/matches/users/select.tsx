import { setAccountProfile } from '@app/api/following';
import { setAuth, useMutate, useSelector } from '@app/redux/reducer';
import { saveAuthToStorage } from '@app/service/storage';
import Search from '@app/view/components/search';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';

export type ISearchProfilePageParams = {
    search?: string;
}

const SelectProfilePage = () => {
    console.log('SelectProfilePage');

    const mutate = useMutate();
    const account = useSelector((state) => state.account);

    const { search } = useLocalSearchParams<ISearchProfilePageParams>();

    const onSelect = async (user: any) => {
        await saveAuthToStorage({
            profileId: user.profileId,
        });
        mutate(setAuth(user));
        setAccountProfile(account.id, { profile_id: user.profileId!, steam_id: user.steamId });
        router.navigate(`/matches/users/${user.profileId!}?name=${user.name}&country=${user.country}`);
    };

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: 'Find My Account' });
    }, [navigation]);

    return (
        <Search title="Enter your AoE username to track your games" selectedUser={onSelect} actionText="Choose" initialText={search} />
    );
};

export default SelectProfilePage;
