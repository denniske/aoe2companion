import Search from '@app/view/components/search';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from '@app/helper/translate';
import { useSaveAccountMutation } from '@app/mutations/save-account';
import { useAccount } from '@app/queries/all';

export type ISearchProfilePageParams = {
    search?: string;
};

const SelectProfilePage = () => {
    const { search } = useLocalSearchParams<ISearchProfilePageParams>();
    const { data: account } = useAccount();
    const saveAccountMutation = useSaveAccountMutation();
    const getTranslation = useTranslation();

    const onSelect = async (user: any) => {
        console.log('SELECTED', user);
        saveAccountMutation.mutate({
            profileId: user.profileId,
        });
        router.navigate(`/matches/users/${user.profileId!}/main-profile`);
    };

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: getTranslation('search.findmyaccount.title') });
    }, [navigation, getTranslation]);

    return (
        <Search
            title={getTranslation('search.findmyaccount.description')}
            selectedUser={onSelect}
            actionText={getTranslation('search.findmyaccount.action')}
            initialText={search}
        />
    );
};

export default SelectProfilePage;
