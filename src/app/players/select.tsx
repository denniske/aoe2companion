import Search from '@app/view/components/search';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useTranslation } from '@app/helper/translate';
import { useSaveAccountMutation } from '@app/mutations/save-account';
import { useAccount } from '@app/queries/all';
import { supabaseClient } from '@nex/data';

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
    };

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: getTranslation('search.findmyaccount.title') });
    }, [navigation, getTranslation]);

    useFocusEffect(
        useCallback(() => {
            supabaseClient.auth.getSession().then(({ data: { session } }) => {
                if (!session) {
                    router.replace('/more/account');
                }
            });
        }, [])
    );

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
