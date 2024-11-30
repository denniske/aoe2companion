import Search from '@app/view/components/search';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useSaveAccountMutation } from '@app/mutations/save-account';
import { useAccount } from '@app/queries/all';

export type ISearchProfilePageParams = {
    search?: string;
};

const SelectProfilePage = () => {
    const { search } = useLocalSearchParams<ISearchProfilePageParams>();
    const { data: account } = useAccount();
    const saveAccountMutation = useSaveAccountMutation();

    const onSelect = async (user: any) => {
        console.log('SELECTED', user);
        saveAccountMutation.mutate({
            ...account!,
            profileId: user.profileId,
        });
        router.navigate(`/matches/users/${user.profileId!}`);
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
