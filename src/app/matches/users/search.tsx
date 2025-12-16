import Search from '@app/view/components/search';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@app/helper/translate';

type SearchPageParams = {
    query?: string;
};

export default function SearchPage() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<SearchPageParams>();

    return (
        <>
            <Stack.Screen options={{ title: getTranslation('matches.search.title') }} />
            <Search selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}`)} initialText={params.query} />
        </>
    );
}
