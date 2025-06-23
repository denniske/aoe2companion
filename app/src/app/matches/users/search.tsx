import Search from '@app/view/components/search';
import { Stack, router } from 'expo-router';
import { useTranslation } from '@app/helper/translate';

export default function SearchPage() {
    const getTranslation = useTranslation();
    return (
        <>
            <Stack.Screen options={{ title: getTranslation('matches.search.title') }} />
            <Search selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}?name=${user.name}&country=${user.country}`)} />
        </>
    );
}
