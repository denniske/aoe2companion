import Search from '@app/view/components/search';
import { Stack, router } from 'expo-router';

export default function SearchPage() {
    return (
        <>
            <Stack.Screen options={{ title: 'Find Player' }} />
            <Search selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}`)} />
        </>
    );
}
