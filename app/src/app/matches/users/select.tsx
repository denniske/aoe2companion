import { setAccountProfile } from '@app/api/following';
import { setAuth, useMutate, useSelector } from '@app/redux/reducer';
import { saveSettingsToStorage } from '@app/service/storage';
import Search from '@app/view/components/search';
import { router, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../../App2';

const SelectProfilePage = () => {
    const mutate = useMutate();
    const account = useSelector((state) => state.account);

    const route = useRoute<RouteProp<RootStackParamList, 'User'>>();

    const onSelect = async (user: any) => {
        await saveSettingsToStorage({
            profileId: user.profileId,
        });
        mutate(setAuth(user));
        setAccountProfile(account.id, { profile_id: user.profileId!, steam_id: user.steamId });
        router.navigate(`/matches/users/${user.profileId!}`);
    };

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: 'Find My Account' });
    }, [navigation]);

    return <Search
        title="Enter your AoE username to track your games"
        selectedUser={onSelect}
        actionText="Choose"
        initialText={route.params?.search}
    />;
};

export default SelectProfilePage;
