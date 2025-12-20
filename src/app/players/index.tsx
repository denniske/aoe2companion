import Search from '@app/view/components/search';
import { Stack } from 'expo-router';
import { useTranslation } from '@app/helper/translate';

export default function PlayersPage() {
    const getTranslation = useTranslation();

    return (
        <>
            <Stack.Screen options={{ title: getTranslation('players.title') }} />
            <Search />
        </>
    );
}
