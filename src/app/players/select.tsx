import Search from '@app/view/components/search';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from '@app/helper/translate';
import { useSaveAccountMutation } from '@app/mutations/save-account';
import { useRedirectUnauthenticated } from '@app/hooks/use-redirect-unauthenticated';

export type ISearchProfilePageParams = {
    search?: string;
};

const SelectProfilePage = () => {
    useRedirectUnauthenticated();
    const { search } = useLocalSearchParams<ISearchProfilePageParams>();
    const saveAccountMutation = useSaveAccountMutation();
    const getTranslation = useTranslation();

    const onSelect = async (user: any) => {
        console.log('SELECTED', user);
        saveAccountMutation.mutate({
            profileId: user.profileId,
        });
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
